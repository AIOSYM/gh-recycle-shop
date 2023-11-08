# GH Recycle Shop

## Overview
GH Recycle Shop is an open-source platform designed for recycling event organizers. It enables them to create and host events, manage item listings, and conduct lotteries to determine who wins the items. The platform aims to streamline the recycling event management process and make it more engaging for participants.

**Note:** This project was originally developed as a specialized tool for my university's student house, known as Global House (GH), to aid in hosting recycling events. It's crafted with the vision to encourage sustainability and community engagement within the student body.

## Features
- 📅 **Event Creation:** Organizers can easily set up recycling events within the platform.
- 🛍️ **Item Listing:** Users can browse through the items available for recycling and select the ones they are interested in.
- 🎟️ **Lottery System:** Organizers can conduct a lottery to fairly decide the winners of the items.
- 📊 **User Dashboard:** A personalized dashboard for users to track their participation and items of interest.



## Tech Stack
The GH Recycle Shop is built with the following technologies:

- **React**: A JavaScript library for building user interfaces, empowering our client-side application.
- **DaisyUI**: A React-compatible UI library based on Tailwind CSS that provides ready-to-use components for rapid UI development.
- **Firebase**: A comprehensive app development platform by Google that provides backend services such as authentication, real-time database, and hosting.

## Getting Started

### Installation
1. Clone the repository:
```bash
git clone https://github.com/AIOSYM/gh-recycle-shop
```

2. Clone the repository:
```bash
cd gh-recycle-shop
```

3. Install dependencies:
```bash
npm install
```

### Firebase Configuration

This project uses Firebase for backend services. To set up your Firebase instance, follow these steps:

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project or select an existing one.
3. Navigate to 'Project settings' > 'Service accounts' and click on 'Generate new private key'.
4. Save the JSON file with your service account credentials in a secure location.

### Adding Firebase to your project

In your project, you will need to set up environment variables for Firebase configuration. Create a `.env` file in your project root and add the following (replace with your actual config values):

```env
REACT_APP_FIREBASE_API_KEY="your-api-key"
REACT_APP_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
REACT_APP_FIREBASE_PROJECT_ID="your-project-id"
REACT_APP_FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
REACT_APP_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
REACT_APP_FIREBASE_APP_ID="your-app-id"
```
Important: Never commit your .env file or any sensitive keys to your version control system. Add .env to your .gitignore file.

### Initializing Firebase in your Application
Create a firebase.js file in your source directory and initialize Firebase with the config from your environment variables:
```javascript
import firebase from 'firebase/app';
import 'firebase/firestore'; // If using Firestore
import 'firebase/auth'; // If using Firebase Auth

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

firebase.initializeApp(firebaseConfig);

export default firebase;
```