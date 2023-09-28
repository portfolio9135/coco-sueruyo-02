import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useSelector } from "react-redux";
import { selectUser } from "../GlobalRedux/Features/userSlice";
import Link from "next/link";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";

import FavoriteIcon from "@mui/icons-material/Favorite";

const TopPage = () => {
  const user = useSelector(selectUser);

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
    //いいね数が多い順に取得
    const q = query(collection(db, "posts"), orderBy("likesCount", "desc"));

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
  }, [posts]);

  return (
    <div className="min-h-screen">
      {/* ヘッダー */}
      <Header />

      <main className="pt-32 px-6 max-w-7xl mx-auto">
        {/* メインビジュアル */}
        <div className="relative">
          <img src="/img/TopPage/mv.jpg" alt="メインビジュアル" />

          <h1 className="absolute inset-0 flex flex-col justify-center items-center text-white text-xl md:text-3xl lg:text-5xl">
            <div className="c-text-shadow">あなたの声でつくる</div>
            <div className="c-text-shadow mt-4 lg:mt-10">
              喫煙所情報共有サイト
            </div>
            <div className="c-text-shadow mt-4 lg:mt-10">CoCo Sueruyo</div>
          </h1>
        </div>
        <a href="https://jp.freepik.com/free-vector/smoking-activity-landing-page-cigarettes-package_6929231.htm#query=isometric%E3%80%80smok&position=4&from_view=search&track=ais">
          著作者：vectorpouch
        </a>
        ／出典：Freepik
        <div>
          ロゴは{" "}
          <a
            href="https://www.designevo.com/jp/"
            title="無料オンラインロゴメーカー"
          >
            DesignEvo
          </a>{" "}
          ロゴメーカーさんに作られる
        </div>
        {/* 総合ランキング */}
        <div className="mt-16 w-full">
          <p className="font-bold text-4xl">総合ランキング</p>

          <div className="mt-8 flex flex-col items-center  gap-8 justify-center px-4 xl:flex-row">
            {posts.map((post, index) => (
              <Link href={`/post-list/post-details?id=${post.id}`} key={index}>
                <section className="w-80 h-56 border rounded-md border-gray-300 border-y-2 border-x-2 px-4 py-6 c-btn-03 md:w-96">
                  <div className="flex items-center w-fit mx-auto mb-4 text-xl">
                    {index === 0 && (
                      <img
                        className="w-12 mr-4 -mt-3"
                        src="img/TopPage/crown1.png"
                        alt="ランキングの王冠 1位"
                      />
                    )}
                    {index === 1 && (
                      <img
                        className="w-12 mr-4 -mt-3"
                        src="img/TopPage/crown2.png"
                        alt="ランキングの王冠 2位"
                      />
                    )}
                    {index === 2 && (
                      <img
                        className="w-12 mr-4 -mt-3"
                        src="img/TopPage/crown3.png"
                        alt="ランキングの王冠 3位"
                      />
                    )}

                    <div>{post.postTitle}</div>
                  </div>

                  <div className="flex w-full">
                    <div className="w-1/2 mr-4">
                      <img
                        className="h-32 object-cover"
                        src={
                          post.postImage
                            ? post.postImage
                            : "/img/Common/post-dummy.png"
                        }
                        alt="投稿写真"
                      />
                    </div>

                    <div className="w-1/2">
                      <div className="flex items-center">
                        <div className="">いいね！</div>
                        <div className="mr-1">
                        <FavoriteIcon style={{ color: 'red' }} />
                        </div>
                        <p> {post.likesCount}件</p>
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
        </div>
      </main>

      {/* フッター */}
      <Footer />
    </div>
  );
};

export default TopPage;
