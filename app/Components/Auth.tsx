"use client";

import Header from "./Header";
import Footer from "./Footer";
import { updateUserProfile } from "../GlobalRedux/Features/userSlice";

import React, { useState } from "react";
import { useDispatch } from "react-redux";

import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth, provider, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { IconButton, Modal, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import Image from "next/image";

const Auth: React.FC = () => {
  // 【useState 状態変数まとめ】
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [avatarImage, setAvatarImage] = useState<File | null>(null);
  const [avatarImageUrl, setAvatarImageUrl] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const dispatch = useDispatch();

  // 【パスワードリセット送信時の処理】
  const sendResetEmail = async (e: React.MouseEvent<HTMLElement>) => {
    await sendPasswordResetEmail(auth, resetEmail)
      .then(() => {
        setOpenModal(false);
        setResetEmail("");
      })
      .catch((err) => {
        alert(err.message);
        setResetEmail("");
      });
  };

  // 【ユーザーのアバター画像を登録する処理】
  const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      setAvatarImage(e.target.files![0]);
      setAvatarImageUrl(URL.createObjectURL(e.target.files![0]));
      e.target.value = "";
    }
  };

  // 【メール、パスワードでログインする処理】
  const signInEmail = async () => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  // 【新規アカウント作成する処理】
  const signUpEmail = async () => {
    const authUser = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    let url = "";

    if (avatarImage) {
      const S =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const N = 16;

      const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
        .map((n) => S[n % S.length])
        .join("");
      const fileName = randomChar + "_" + avatarImage.name;

      await uploadBytes(ref(storage, `userAvatars/${fileName}`), avatarImage);
      url = await getDownloadURL(ref(storage, `userAvatars/${fileName}`));
    }

    if (authUser.user) {
      await updateProfile(authUser.user, {
        displayName: userName,
        photoURL: url,
      });
    }

    dispatch(
      updateUserProfile({
        displayName: userName,
        photoUrl: url,
      })
    );
  };

  // 【Googleアカウントでのログイン処理】
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      alert((err as Error).message);
    }
  };

  //【ゲストモードでのログイン処理】
  const loginAsGuest = async () => {
    const guestUser = {
      email: "guest@gmail.com",
      password: "guestguest",
    };

    await signInWithEmailAndPassword(auth, guestUser.email, guestUser.password);
  };

  return (
    <div className="min-h-screen">
      {/* ヘッダー */}
      <Header />

      {/* メインコンテンツ */}
      <main className="c-template-01">
        <div className="c-template-01__inner flex flex-col items-center max-w-xl mx-auto lg:max-w-max lg:flex-row lg:justify-between lg:gap-8">
          {/* メインビジュアル */}
          <div className="relative lg:w-1/2">
            <img src="/img/AuthPage/mv.jpg" alt="メインビジュアル" />

            <h1 className="absolute top-16 left-1/2 transform -translate-x-1/2 flex flex-col justify-center items-center text-white text-xl w-full md:text-xl lg:text-2xl">
              <div className="c-text-shadow">あなたの声でつくる</div>
              <div className="c-text-shadow mt-2 lg:mt-4">
                喫煙所情報共有サイト
              </div>
              <div className="c-text-shadow mt-2 lg:mt-4">
                CoCo Sueruyo
                </div>
            </h1>
          </div>

          {/* 入力フォーム */}
          <div className="w-full mt-8 bg-gray-100 rounded-md lg:w-1/2 lg:mt-0">
            <div className="p-6">
              {/* タイトル */}
              <p className="font-bold text-lg">
                {isLogin ? "ユーザーログイン" : "新規登録"}
              </p>

              {/* アイコン 名前 */}
              {!isLogin && (
                <div className="mt-4">
                  {/* アイコン */}
                  <label className="block w-16 hover:opacity-50 transition duration-500 hover:cursor-pointer">
                    <img
                      className="rounded-full w-16"
                      src={avatarImageUrl || "/img/AuthPage/add-icon.png"}
                      alt="ユーザーアイコン登録画像"
                    />
                    <input
                      type="file"
                      onChange={onChangeImageHandler}
                      style={{ display: "none" }}
                    />
                  </label>

                  {/* ユーザーネーム */}
                  <p className="mt-4">UserName</p>
                  <input
                    className="mt-2 p-2 w-full rounded-md border border-gray-300 shadow-sm"
                    type="text"
                    placeholder="UserName"
                    value={userName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setUserName(e.target.value);
                    }}
                  />
                </div>
              )}

              {/* メールアドレス */}
              <p className="mt-4">Email</p>
              <input
                className="mt-2 p-2 w-full rounded-md border border-gray-300 shadow-sm"
                type="text"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setEmail(e.target.value);
                }}
              />

              {/* パスワード */}
              <p className="mt-4">PassWord</p>
              <input
                className="mt-2 p-2 w-full rounded-md border border-gray-300 shadow-sm"
                type="password"
                placeholder="******"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setPassword(e.target.value);
                }}
              />

              {/* 登録orログイン 既存アカウントでログインor新規登録はこちら パスワードをお忘れの方 ボタンセクション */}
              <div className="flex justify-between mt-4 border-b-2 border-gray-600 pb-10">
                {/* 登録orログインボタン */}
                <button
                  className={`bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-500 ease-in-out
                  ${
                    (isLogin && (!email || password.length < 6)) ||
                    (!isLogin &&
                      (!userName ||
                        !email ||
                        password.length < 6 ||
                        !avatarImage))
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={
                    isLogin
                      ? !email || password.length < 6
                      : !userName ||
                        !email ||
                        password.length < 6 ||
                        !avatarImage
                  }
                  onClick={
                    isLogin
                      ? async () => {
                          try {
                            await signInEmail();
                          } catch (err: any) {
                            alert(err.message);
                          }
                        }
                      : async () => {
                          try {
                            await signUpEmail();
                          } catch (err: any) {
                            alert(err.message);
                          }
                        }
                  }
                >
                  {isLogin ? "ログイン" : "登録"}
                </button>

                {/* 新規登録はこちらor既存のアカウントでログインボタン */}
                <div>
                  <button
                    className="block text-gray-600 text-sm hover:opacity-50 duration-500 md:text-base"
                    onClick={() => setIsLogin(!isLogin)}
                  >
                    {isLogin
                      ? "新規登録はこちら"
                      : "既存のアカウントでログイン"}
                  </button>

                  {/* パスワードをお忘れの方ボタン */}
                  <button
                    className="block text-gray-600 text-sm hover:opacity-50 duration-500 md:text-base"
                    onClick={() => setOpenModal(true)}
                  >
                    パスワードをお忘れの方
                  </button>
                </div>
              </div>

              {/* ゲストユーザーでログイン */}
              <div
                className="mt-6 w-fit mx-auto"
                onClick={() => loginAsGuest()}
              >
                <button className="flex items-center justify-between p-3 bg-white border border-gray-300 rounded-lg shadow-md w-fit  hover:opacity-50 duration-500">
                  <img
                    className=" w-8 mr-2"
                    src="/img/Common/user-icon.png"
                    alt="ゲストユーザーアイコン"
                  />
                  <p className="font-bold text-gray-500">
                    ゲストアカウントでログイン
                  </p>
                </button>
              </div>

              {/* Googleアカウントでログイン */}
              <div
                className="mt-6 w-fit mx-auto"
                onClick={() => signInWithGoogle()}
              >
                <button className="flex items-center justify-between p-3 bg-white border border-gray-300 rounded-lg shadow-md w-fit  hover:opacity-50 duration-500">
                  <img
                    className=" w-8 mr-2"
                    src="/img/AuthPage/google-logo.svg"
                    alt="Googleアイコン"
                  />
                  <p className="font-bold text-gray-500">
                    Googleアカウントでログイン
                  </p>
                </button>
              </div>

              <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <div
                  className="c-absolute-04 outline-none absolute w-400 rounded-10 bg-white shadow-lg p-10"
                >
                  <div className="text-center">
                    <TextField
                      InputLabelProps={{
                        shrink: true,
                      }}
                      type="email"
                      name="email"
                      label="Reset E-mail"
                      value={resetEmail}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setResetEmail(e.target.value);
                      }}
                    />

                    <IconButton onClick={sendResetEmail}>
                      <SendIcon />
                    </IconButton>
                  </div>
                </div>
              </Modal>
            </div>
          </div>
        </div>
      </main>

      {/* フッター */}
      <Footer />
    </div>
  );
};

export default Auth;
