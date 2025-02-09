import * as functions from "firebase-functions/v1";
import {initializeApp} from "firebase-admin/app";
import {Firestore} from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";
import {Storage} from "@google-cloud/storage";
import {onCall} from "firebase-functions/v2/https";

initializeApp();

const firestore = new Firestore();
const storage = new Storage();

const rawVideoBucketName = "treva-yt-raw-videos";
const processedVideoBucketName = "treva-yt-processed-videos";

export const createUser = functions.auth.user().onCreate((user) => {
  const userInfo = {
    uid: user.uid,
    email: user.email,
    photoUrl: user.photoURL,
  };

  firestore.collection("users").doc(user.uid).set(userInfo);
  logger.info(`User Created: ${JSON.stringify(userInfo)}`);
  return;
});

export const generateUploadUrl = onCall({maxInstances: 1}, async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The function must be called while authenticated."
    );
  }

  const auth = request.auth;
  const data = request.data;
  const bucket = storage.bucket(rawVideoBucketName);

  // Generate a unique filename for upload
  const fileName = `${auth.uid}-${Date.now()}.${data.fileExtension}`;

  // Get a v4 signed URL for uploading file
  const [url] = await bucket.file(fileName).getSignedUrl({
    version: "v4",
    action: "write",
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
  });

  // Store the metadata in Firestore
  await setVideo(fileName.split('.')[0], {
    id: fileName.split('.')[0],
    uid: auth.uid,
    status: "processing",
    title: data.title || "Untitled",
    description: data.description || ""
  });

  return {url, fileName};
});

const videoCollectionId = "videos";

export interface Video {
  id?: string,
  uid?: string,
  filename?: string,
  status?: "processing" | "processed",
  title?: string,
  description?: string
}

export const deleteVideo = onCall({maxInstances: 1}, async (request) => {
  console.log("Delete video called");
  console.log(request.data);
  if (!request.auth) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The function must be called while authenticated."
    );
  }

  const {videoId} = request.data;
  const splitVideoId:string[] = videoId.split("-");
  const rawVideoId = splitVideoId[1] + "-" + splitVideoId[2];
  console.log(rawVideoId);
  try {
    // Delete from Firestore if exists
    console.log("Deleting "+ rawVideoId + "from Firestore");
    const docRef = firestore.collection(videoCollectionId).doc(
      rawVideoId.replace(".mp4", ""));
    const doc = await docRef.get();
    if (doc.exists) {
      await docRef.delete();
    }

    // Delete from both raw and processed buckets
    try {
      console.log("Deleting "+ rawVideoId + "from" + rawVideoBucketName);
      await storage.bucket(rawVideoBucketName).file(rawVideoId).delete();
    } catch (e) {
      console.log("Raw video not found or already deleted");
    }

    try {
      console.log("Deleting "+ rawVideoId + "from" + processedVideoBucketName);
      await storage.bucket(processedVideoBucketName).file(videoId).delete();
    } catch (e) {
      console.log("Processed video not found or already deleted");
    }

    return {message: "Video deleted successfully"};
  } catch (error) {
    console.error("Delete operation failed:", error);
    throw new functions.https.HttpsError("internal", "Failed to delete video");
  }
});

export const getVideos = onCall({maxInstances: 1}, async () => {
  const querySnapshot =
    await firestore.collection(videoCollectionId).limit(10).get();
  return querySnapshot.docs.map((doc) => doc.data());
});

