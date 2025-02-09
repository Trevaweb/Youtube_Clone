# Video Processing Service

This project is a video processing application built with **Next.js** and **Firebase**. It allows users to upload videos, process them, and watch them through a web interface.

## Table of Contents

- [Getting Started](#getting-started)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup](#setup)
- [Usage](#usage)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

To get started with this project, follow the instructions below to set up your local environment.

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- Firebase account

## Features

- User authentication with Google Sign-In
- Video upload functionality
- Video processing using Firebase Functions
- Video playback in a web interface

## Technologies Used

- **Frontend**: Next.js, React
- **Backend**: Firebase Functions, Firestore, Firebase Storage, Google Cloud
- **Styling**: CSS Modules
- **Video Processing**: Fluent FFmpeg
- **Others**: Docker

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/video-processing-service.git
   cd video-processing-service
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up Firebase:

   - Create a new Firebase project in the [Firebase Console](https://console.firebase.google.com/).
   - Enable Firestore and Firebase Storage.
   - Set up authentication with Google Sign-In.
   - Create a `.env` file in the root directory and add your Firebase configuration:

   ```plaintext
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

## Usage

1. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. Open your browser and navigate to `http://localhost:3000`.

3. You can now upload videos, which will be processed and stored in Firebase.

## Deployment

To deploy the application, you can use Firebase Hosting:

1. Install the Firebase CLI:

   ```bash
   npm install -g firebase-tools
   ```

2. Log in to Firebase:

   ```bash
   firebase login
   ```

3. Initialize Firebase in your project:

   ```bash
   firebase init
   ```

4. Deploy the application:

   ```bash
   firebase deploy
   ```

