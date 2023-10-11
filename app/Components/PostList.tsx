import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { db } from "../firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import Link from "next/link";

import FavoriteIcon from "@mui/icons-material/Favorite";
import Image from "next/image";

const PostList: React.FC = () => {
  const [posts, setPosts] = useState([
    {
      id: "",
      userAvatar: "",
      userName: "",
      postImage: "",
      postAddress: "",
      postTitle: "",
      postComment: "",
      postTimeStamp: null,
      likesCount: 0,
    },
  ]);

  //【投稿の全てと各投稿のいいね数を取得】
  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("postTimeStamp", "desc"));
    const unSub = onSnapshot(q, (snapshot) => {
      const updatedPosts = snapshot.docs.map((doc) => {
        const post = {
          id: doc.id,
          userAvatar: doc.data().userAvatar,
          userName: doc.data().userName,
          postImage: doc.data().postImage,
          postAddress: doc.data().postAddress,
          postTitle: doc.data().postTitle,
          postComment: doc.data().postComment,
          postTimeStamp: doc.data().postTimeStamp,
          likesCount: doc.data().likesCount,
        };
        return post;
      });
      setPosts(updatedPosts);
    });
    return () => {
      unSub();
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Header />

      <main className="c-template-02">
        <div className="c-template-02__inner">
          <h1 className="w-fit mx-auto text-2xl font-bold relative">
            投稿一覧
            <img
              className="w-16 c-absolute-01"
              src="/img/PostListPage/tabacco.svg"
              alt="喫煙所のアイコン"
            />
          </h1>

          {posts.map((post) => (
            <Link href={`/post-list/post-details?id=${post.id}`} key={post.id}>
              <section className="mt-10 border rounded-md border-gray-300 border-y-2 border-x-2 px-4 py-6 c-btn-03">
                <div className="flex">
                  <div className="w-1/2 mr-4">
                    <Image
                      className="h-32 w-full object-cover"
                      src={
                        post.postImage
                          ? post.postImage
                          : "/img/Common/post-dummy.png"
                      }
                      alt="投稿写真"
                      width={300}
                      height={0}
                    />
                  </div>
                  <div className="w-1/2">
                    <div className="font-bold md:text-lg">{post.postTitle}</div>

                    <div className="flex items-center">
                      <div className="">いいね！</div>
                      <div className="mr-1">
                        <FavoriteIcon style={{ color: "red" }} />
                      </div>
                      <p>{post.likesCount}件</p>
                    </div>

                    <div className="mt-1 text-sm md:text-base">
                      {post.postAddress}
                    </div>
                    <div className="flex items-center mt-1">
                      <img
                        className="w-8"
                        src={post.userAvatar}
                        alt="ユーザーアイコン"
                      />
                      <p className="text-sm md:text-base">{post.userName}</p>
                    </div>
                  </div>
                </div>
              </section>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PostList;
