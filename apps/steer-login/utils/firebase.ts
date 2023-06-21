import { initializeApp } from "firebase/app";
import {
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  TwitterAuthProvider,
  signOut as firebaseSignOut,
  signInWithPopup
} from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCiBLG8uuum5aLfphODrcEbfuO3ISGiI4E",
    authDomain: "steer-bb667.firebaseapp.com",
    projectId: "steer-bb667",
    storageBucket: "steer-bb667.appspot.com",
    messagingSenderId: "59558391",
    appId: "1:59558391:web:07d10d19d9a362c080c6f2",
    measurementId: "G-GDRTRENV12"
  };

const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);


export function signOut() {
  return firebaseSignOut(auth);
}

export function loginGoogle() {
  const provider = new GoogleAuthProvider();

  return signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      console.debug('SignIn Google', { credential, result });
      return { credential, result };
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('SignIn Google', { errorCode, errorMessage });
      throw new Error(errorMessage)
    });
}

export function loginGitHub() {
  const provider = new GithubAuthProvider();
  return signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a GitHub Access Token. You can use it to access the GitHub API.
      const credential = GithubAuthProvider.credentialFromResult(result);
      console.debug('SignIn Github', { credential, result });
      return { credential, result };
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('SignIn Github', { errorCode, errorMessage });
      throw new Error(errorMessage)
    });
}

export function loginTwitter() {
  const provider = new TwitterAuthProvider();

  return signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Twitter Access Token. You can use it to access the Twitter API.
      const credential = TwitterAuthProvider.credentialFromResult(result);
      console.debug('SignIn Twitter', { credential, result });
      return { credential, result };
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('SignIn Twitter', { errorCode, errorMessage });
      throw new Error(errorMessage)
    });
}

