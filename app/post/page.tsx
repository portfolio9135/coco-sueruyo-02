"use client";

import Auth from "@/app/Components/Auth";
import Post from "@/app/Components/Post";
import { login, logout, selectUser } from "@/app/GlobalRedux/Features/userSlice";
import { auth } from "@/app/firebase";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

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

  return <div className="min-h-screen">{user.uid ? <Post /> : <Auth />}</div>;
};

export default Page;