'use client';

import { useSearchParams } from 'next/navigation'
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase/firebase';

export default function Watch() {
  const videoPrefix = 'https://storage.googleapis.com/treva-yt-processed-videos/';
  const videoSrc = useSearchParams().get('v');
  const deleteVideoCall = httpsCallable(functions, 'deleteVideo');

  const handleDelete = async (videoId: string) => {
    try {
      const response = await deleteVideoCall({ videoId });
      alert(response.data.message);
    } catch (error) {
      alert(`Failed to delete video: ${error}`);
    }
  };

  return (
    <div>
      <h1>Watch Page</h1>
      { <video controls src={videoPrefix + videoSrc}/> }
      <button onClick={() => handleDelete(videoSrc!)}>Delete</button>
    </div>
  );
}
