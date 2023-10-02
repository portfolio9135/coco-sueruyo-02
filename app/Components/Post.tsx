import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useSelector } from "react-redux";
import { selectUser } from "../GlobalRedux/Features/userSlice";
import { storage } from "../firebase";
import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { IconButton } from "@mui/material";

import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";

const Post: React.FC = () => {
  const user = useSelector(selectUser);
  const db = getFirestore();

  const [postImg, setPostImg] = useState<File | null>(null);
  const [postImgUrl, setPostImgUrl] = useState("");
  const [postComment, setPostComment] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [postAddress, setPostAddress] = useState("");

  // 【ユーザーが喫煙所の画像を投稿する処理】
  const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      setPostImg(e.target.files![0]);
      setPostImgUrl(URL.createObjectURL(e.target.files![0]));
      e.target.value = "";
    }
  };

  //【投稿するボタンが押された時の処理】
  const sendPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //【画像ありの場合】
    if (postImg) {
      const S =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const N = 16;
      const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
        .map((n) => S[n % S.length])
        .join("");
      const fileName = randomChar + "_" + postImg.name;
      const storageRef = ref(storage, `postImages/${fileName}`);

      try {
        await uploadBytes(storageRef, postImg);
        const url = await getDownloadURL(storageRef);
        await addDoc(collection(db, "posts"), {
          postTitle: postTitle,
          postImage: url,
          postComment: postComment,
          postAddress: postAddress,
          userName: user.displayName,
          userAvatar: user.photoUrl,
          postTimeStamp: serverTimestamp(),
          likesCount: 0,
        });
      } catch (error) {
        alert("投稿処理中にエラーが発生しました。");
        console.error(error);
      }
    }
    //【画像なしの場合】
    else {
      try {
        await addDoc(collection(db, "posts"), {
          postTitle: postTitle,
          postImage: "",
          postComment: postComment,
          postAddress: postAddress,
          userName: user.displayName,
          userAvatar: user.photoUrl,
          postTimeStamp: serverTimestamp(),
          likesCount: 0,
        });
      } catch (error) {
        alert("投稿処理中にエラーが発生しました。");
        console.error(error);
      }
    }
    setPostTitle("");
    setPostImg(null);
    setPostImgUrl("");
    setPostComment("");
    setPostAddress("");
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="c-template-01">
        <div className="c-template-01__inner">
          <h1 className="w-fit mx-auto text-2xl font-bold relative">
            喫煙所の投稿
            <img
              className="w-16 c-absolute-01"
              src="/img/PostPage/tabacco.svg"
              alt="喫煙所のアイコン"
            />
          </h1>

          <form
            className="mt-10 border rounded-md border-gray-300 border-y-2 border-x-2 px-4 py-8"
            onSubmit={sendPost}
          >
            <section>
              <h2 className="mt-4">写真</h2>

              {postImgUrl ? (
                <div className="flex items-end">
                  <img
                    className="rounded-full w-52 mr-2"
                    src={postImgUrl}
                    alt="ユーザーアイコン登録画像"
                  />

                  <IconButton>
                    <label className="hover:cursor-pointer">
                      <ChangeCircleIcon style={{ fontSize: "93px" }} />
                      <input
                        type="file"
                        onChange={onChangeImageHandler}
                        style={{ display: "none" }}
                      />
                    </label>
                  </IconButton>
                </div>
              ) : (
                <IconButton>
                  <label className="hover:cursor-pointer">
                    <AddAPhotoIcon style={{ fontSize: "80px" }} />
                    <input
                      type="file"
                      onChange={onChangeImageHandler}
                      style={{ display: "none" }}
                    />
                  </label>
                </IconButton>
              )}
            </section>

            <section>
              <h2 className="mt-4">喫煙所名</h2>
              <input
                className="w-full border border-gray-200 rounded-md mt-4 p-4"
                placeholder="新宿区の喫煙所"
                type="text"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
              />
            </section>

            <section>
              <h2 className="mt-4">
                住所 <span className="text-red-500">*</span>
              </h2>
              <input
                className="w-full border border-gray-200 rounded-md mt-4 p-4"
                placeholder="東京都新宿区〇〇"
                type="text"
                value={postAddress}
                onChange={(e) => setPostAddress(e.target.value)}
              />
            </section>

            <section>
              <h2 className="mt-4">投稿者コメント</h2>
              <textarea
                className="w-full border border-gray-200 rounded-md mt-4 p-4"
                placeholder="投稿者のコメントを入力"
                rows={5}
                value={postComment}
                onChange={(e) => setPostComment(e.target.value)}
              />
            </section>

            <section className="flex justify-end mt-10">
              <button
                className={postAddress ? "c-btn-02" : "c-btn-02 opacity-50"}
                type="submit"
                disabled={!postAddress}
              >
                投稿する
              </button>
            </section>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Post;
