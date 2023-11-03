"use client";

import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../GlobalRedux/Features/userSlice";
import SendIcon from "@mui/icons-material/Send";
import {
  addLike,
  removeLike,
  selectPostLikes,
} from "../GlobalRedux/Features/likesSlice";

import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PrimaryButton from "./atoms/button/PrimaryButton";

//【コメントの型を定義】
interface COMMENT {
  id: string;
  avatar: string;
  userName: string;
  text: string;
  timeStamp: any;
}

const PostDetails: React.FC = () => {
  //*******************************************************************
  //【変数 状態変数の定義___全体】
  //*******************************************************************
  //【ログインしているユーザ情報をreduxから取得】
  const user = useSelector(selectUser);

  //【URLパラメータから投稿IDを取得】
  const searchParams = useSearchParams();
  const postId = searchParams.get("id");

  //【投稿の状態変数を定義】
  const [post, setPost] = React.useState({
    id: "",
    userAvatar: "",
    userName: "",
    postImage: "",
    postAddress: "",
    postTitle: "",
    postComment: "",
    postTimeStamp: null,
    likesCount: 0,
  });

  //【reduxへの通知するための変数を用意】
  const dispatch = useDispatch();

  //*******************************************************************
  //【変数 状態変数の定義___いいね機能】
  //*******************************************************************
  //【いいね情報をreduxから取得】
  const postLikes = useSelector(selectPostLikes);
  const [isLiked, setIsLiked] = useState(false);

  //*******************************************************************
  //【関数___コメント機能】
  //*******************************************************************
  //【投稿に対するコメントを状態変数で定義】
  const [userComment, setUserComment] = useState("");

  //【投稿に対するコメント全てを状態変数で定義】
  const [userComments, setUserComments] = useState<COMMENT[]>([
    {
      id: "",
      avatar: "",
      userName: "",
      text: "",
      timeStamp: null,
    },
  ]);

  //【投稿に対するコメント全てを状態変数にセット】
  const fetchComments = async () => {
    try {
      const postDocRef = doc(db, "posts", postId!);
      const commentsCollectionRef = collection(postDocRef, "comments");

      const querySnapshot = await getDocs(commentsCollectionRef);

      const commentData: any = querySnapshot.docs.map((doc) => doc.data());

      setUserComments(commentData);
    } catch (error) {
      console.error("コメントの取得中にエラーが発生しました", error);
    }
  };

  //【投稿に対するコメントに変化があるたびにセット】
  useEffect(() => {
    fetchComments();
  }, [userComments]);

  //【投稿に対するコメント全てを日付の新しい順に並べ替え】
  const sortedComments = [...userComments].sort((a, b) => {
    return b.timeStamp - a.timeStamp; // 降順（新しい順）にソート
  });

  //【投稿にコメントが送信された時の処理】
  const newComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Firestoreの参照を設定
      const postDocRef = doc(db, "posts", postId!);
      const commentsCollectionRef = collection(postDocRef, "comments");

      await addDoc(commentsCollectionRef, {
        id: user.uid,
        userName: user.displayName,
        avatar: user.photoUrl,
        text: userComment,
        timeStamp: serverTimestamp(),
      });

      setUserComment("");
    } catch (error) {
      alert("コメント処理中にエラーが発生しました。");
      console.error(error);
    }
  };

  //*******************************************************************
  //【関数___投稿の詳細画面を表示_いいね情報を取得】
  //*******************************************************************
  //【クエリパラメータの文字列と同じIDを持つ投稿を、投稿の状態変数にセットする】
  React.useEffect(() => {
    const fetchPost = async () => {
      const postDoc = doc(collection(db, "posts"), postId!);
      const docSnapshot = await getDoc(postDoc);

      if (docSnapshot.exists()) {
        const postData = docSnapshot.data();

        setPost({
          id: postId!,
          userAvatar: postData.userAvatar,
          userName: postData.userName,
          postImage: postData.postImage,
          postAddress: postData.postAddress,
          postTitle: postData.postTitle,
          postComment: postData.postComment,
          postTimeStamp: postData.postTimeStamp,
          likesCount: postData.likesCount,
        });
      }

      // いいね情報の取得
      const postDocRef = doc(db, "posts", postId!);
      const likesUserCollectionRef = collection(postDocRef, "likesUser");
      const likesUserSnapshot = await getDocs(likesUserCollectionRef);
      const likedByCurrentUser = likesUserSnapshot.docs.some(
        (doc) => doc.id === user.uid
      );

      // いいねの状態を設定
      setIsLiked(likedByCurrentUser);
    };

    fetchPost();
  }, [postId, user.uid, postLikes, post.likesCount]);

  //*******************************************************************
  //【関数___Googleマップ機能】
  //*******************************************************************
  // 【Google マップアプリを開くための関数】
  const openInGoogleMaps = () => {
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      post.postAddress
    )}`;
    window.open(mapUrl, "_blank");
  };

  //*******************************************************************
  //【関数___いいね機能】
  //*******************************************************************
  //【いいねボタンがクリックされたときの処理を実装】
  const toggleLike = async () => {
    try {
      if (!postId) {
        // postIdがnullの場合は何もしない
        return;
      }

      const postDocRef = doc(db, "posts", postId);
      const likesUserCollectionRef = collection(postDocRef, "likesUser");
      const likeDocRef = doc(likesUserCollectionRef, user.uid);

      const likeDocSnapshot = await getDoc(likeDocRef);

      if (likeDocSnapshot.exists()) {
        // すでにいいねしている場合、いいねを取り消す処理
        await deleteDoc(likeDocRef);

        // 投稿のlikesCountを1減少させる
        const postDoc = await getDoc(postDocRef);
        if (postDoc.exists()) {
          const currentLikesCount = postDoc.data().likesCount || 0;
          await updateDoc(postDocRef, {
            likesCount: currentLikesCount - 1,
          });
        }

        dispatch(removeLike({ postId, userId: user.uid }));
      } else {
        // いいねを追加する処理
        await setDoc(likeDocRef, {
          userId: user.uid,
          userName: user.displayName,
          avatar: user.photoUrl,
          timeStamp: serverTimestamp(),
        });

        // 投稿のlikesCountを1増加させる
        const postDoc = await getDoc(postDocRef);
        if (postDoc.exists()) {
          const currentLikesCount = postDoc.data().likesCount || 0;
          await updateDoc(postDocRef, {
            likesCount: currentLikesCount + 1,
          });
        }

        dispatch(addLike({ postId, userId: user.uid }));
      }

      // いいねの状態をトグル
      setIsLiked(!isLiked);
    } catch (error) {
      alert("いいねの処理中にエラーが発生しました。");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="c-template-02">
        <div className="c-template-02__inner">
          <section className="mt-10 border rounded-md border-gray-300 border-y-2 border-x-2">
            <div className=" border-b-2 border-gray-300 p-4">
              <div className="flex items-center">
                <img
                  className="w-10"
                  src={post.userAvatar}
                  alt="投稿者のアバター画像"
                />
                <p>{post.userName}</p>
              </div>
              <h1 className="font-bold text-2xl mb-2">{post.postTitle}</h1>
              <button className="w-8 mb-1" onClick={toggleLike}>
                {isLiked ? (
                  <div className="mr-1">
                    <FavoriteIcon style={{ color: "red" }} />
                  </div>
                ) : (
                  <div className="mr-1">
                    <FavoriteBorderIcon />
                  </div>
                )}
              </button>
              {/* postIdがnullの時、空文字列 '' を使ってデフォルト値を設定。これで型エラー回避。 */}
              <p>いいね！{post.likesCount || 0}件</p>
              <p>
                {post.postTimeStamp
                  ? new Date(
                      (post.postTimeStamp as any).toDate()
                    ).toLocaleString()
                  : null}
              </p>
            </div>

            <div className="p-4">
              <img
                className="w-full"
                src={
                  post.postImage ? post.postImage : "/img/Common/post-dummy.png"
                }
                alt="投稿画像"
              />

              <div className="mt-4">
                <p className="text-md">住所</p>
                <p>{post.postAddress}</p>
              </div>

              <div className="mt-4">
                <PrimaryButton onClick={openInGoogleMaps}>
                  Google マップで表示
                </PrimaryButton>
              </div>

              <div className="mt-10 p-4 border rounded-lg">
                <p className="text-md">【投稿者コメント】</p>
                {post.postComment ? (
                  <p className="mt-2">{post.postComment}</p>
                ) : (
                  <p>投稿者コメントはありません。</p>
                )}
              </div>

              <form onSubmit={newComment}>
                <div className="flex items-center mt-8">
                  <input
                    className="border p-4 rounded-lg w-full mr-4"
                    type="text"
                    placeholder="この投稿にコメントをする..."
                    value={userComment}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setUserComment(e.target.value)
                    }
                  />
                  <button
                    className={userComment ? " text-blue-400 " : "hidden"}
                    type="submit"
                  >
                    <SendIcon style={{ fontSize: "35px" }} />
                  </button>
                </div>
              </form>

              {sortedComments.map((com, index) => (
                <div key={index} className="flex mt-16">
                  <div className="w-1/4 mr-4">
                    <img
                      className="mb-2 border rounded-full w-full"
                      src={com.avatar}
                      alt="返信コメントのユーザーアイコン"
                    />

                    <p className="text-sm w-fit mx-auto">{com.userName}</p>
                  </div>

                  <div className="w-3/4 pt-2">
                    <p>
                      {com.timeStamp
                        ? new Date(
                            (com.timeStamp as any).toDate()
                          ).toLocaleString()
                        : null}
                    </p>

                    <div className="mt-2">
                      <p>{com.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PostDetails;
