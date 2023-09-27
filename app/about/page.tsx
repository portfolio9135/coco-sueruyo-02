"use client";

import React, { useEffect } from "react";
import Auth from "../Components/Auth";
import { useDispatch, useSelector } from "react-redux";
import { login, logout, selectUser } from "../GlobalRedux/Features/userSlice";
import About from "../Components/About";
import { auth } from "../firebase";

const Page = () => {
  const user = useSelector(selectUser);
  const dispath = useDispatch();

  useEffect(() => {
    const unSub = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispath(
          login({
            uid: authUser.uid,
            photoUrl: authUser.photoURL,
            displayName: authUser.displayName,
          })
        );
      } else {
        dispath(logout());
      }
    });
    return () => {
      unSub();
    };
  }, [dispath]);


  return (
    <div className="min-h-screen">{user.uid ? <About /> : <Auth />}</div>
  );
};

export default Page;