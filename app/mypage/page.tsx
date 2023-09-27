"use client";

import React from "react";
import Auth from "../Components/Auth";
import { useSelector } from "react-redux";
import { selectUser } from "../GlobalRedux/Features/userSlice";
import MyPage from "../Components/MyPage";

const Page = () => {
  const user = useSelector(selectUser);

  return (
    <div className="min-h-screen">{user.uid ? <MyPage /> : <Auth />}</div>
  );
};

export default Page;