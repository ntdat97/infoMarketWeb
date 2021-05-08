import { useRouter } from "next/router";
import React, { useState, useEffect, useContext, createContext } from "react";
import { firebaseClient as firebase } from "./firebaseClient";

const authContext = createContext(null);
const getUserInfo = async (user) => {
  let res = await fetch(`/api/admin/members/get-userInfo?id=${user.uid}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const info = await res.json();

  return info;
};
// You can wrap your _app.js with this provider
export function AuthProvider({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

// Custom React hook to access the context
export const useAuth = () => {
  return useContext(authContext);
};

function useProvideAuth() {
  // Store the user in state
  const [user, setUser] = useState(null);
  const router = useRouter();

  const signinWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().languageCode = "vi";

    return firebase
      .auth()
      .signInWithPopup(provider)
      .then(async (response) => {
        const userInfo = await getUserInfo(response.user);
        if (userInfo.userState === "BANNED") {
          signout();
        } else {
          setUser(response.user);
        }

        /* console.log(response.user); */

        // router.reload();
      });
  };

  /*  const signupWithEmail = (email, password) => {
    firebase.auth().languageCode = "vi";

    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        setUser(response.user);
      });
  };

  const signinWithEmail = (email, password) => {
    firebase.auth().languageCode = "vi";

    return firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        setUser(response.user);
      });
  }; */

  // const forgotPassword = (email: string) => {
  //   return firebase.auth()
  // }

  const signout = () => {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        setUser(false);
        router.reload();
      });
  };

  useEffect(() => {
    const unsubscribe = firebase
      .auth()
      .onIdTokenChanged((user) => (user ? setUser(user) : setUser(false)));
    return () => unsubscribe();
  }, []);

  return {
    user,
    signinWithGoogle,
    /*     signinWithEmail,
    signupWithEmail, */
    signout,
  };
}
