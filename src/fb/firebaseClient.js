import firebaseClient from "firebase/app";
import "firebase/auth";

const CLIENT_CONFIG = {
  apiKey: "AIzaSyCXm0aRrGqJaxurRZ2f3IosQrJ_4x9gIEs",
  authDomain: "infomarket-bbb0f.firebaseapp.com",
  projectId: "infomarket-bbb0f",
  storageBucket: "infomarket-bbb0f.appspot.com",
  messagingSenderId: "351114977627",
  appId: "1:351114977627:web:b7a7033882c3266e1afa7e",
  measurementId: "G-0Z6N68XNQR",
};

if (typeof window !== "undefined" && !firebaseClient.apps.length) {
  firebaseClient.initializeApp(CLIENT_CONFIG);
  firebaseClient
    .auth()
    .setPersistence(firebaseClient.auth.Auth.Persistence.LOCAL);
  window.firebase = firebaseClient;
  const auth = firebaseClient.auth();
  if (process.env.NEXT_PUBLIC_NODE_ENV === "development") {
    auth.useEmulator("http://localhost:9099");
  }
}

export { firebaseClient };
