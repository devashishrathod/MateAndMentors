const admin = require('firebase-admin');

// Since we may not have the service account key uploaded yet,
// we will instantiate it via standard env variables or ignore init if credentials don't exist yet, 
// to prevent the app from crashing on start if not configured.

let isFirebaseInitialized = false;

try {
    // Attempting to init using default application credentials (e.g. from FIREBASE_CONFIG env)
    // or by passing a specific JSON file path if specified in an env.

    // For local dev, a common pattern is checking for GOOGLE_APPLICATION_CREDENTIALS
    // Alternatively, you can use a serviceAccountKey.json path.
    if (!admin.apps.length) {
        // Option A: If a path to service account json is in environment variables (e.g. FIREBASE_SERVICE_ACCOUNT_PATH)
        if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
            const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
            isFirebaseInitialized = true;
        } else {
            // Option B: Attempt default init (relies on GOOGLE_APPLICATION_CREDENTIALS)
            admin.initializeApp();
            isFirebaseInitialized = true;
        }
    } else {
        isFirebaseInitialized = true; // Already initialized
    }
} catch (error) {
    console.error('Firebase Admin SDK Initialization Error: ', error.message);
    console.log('Push notifications might not work. Please ensure FIREBASE_SERVICE_ACCOUNT_PATH or GOOGLE_APPLICATION_CREDENTIALS is set properly in .env.');
}

module.exports = { admin, isFirebaseInitialized };
