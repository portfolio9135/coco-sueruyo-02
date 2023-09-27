"use client";

import { useState } from "react";
import { selectUser } from "../GlobalRedux/Features/userSlice";
import { auth } from "../firebase";
import { useSelector } from "react-redux";
import Link from "next/link";

const Header = () => {
  const user = useSelector(selectUser);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="shadow-lg bg-white fixed w-full z-50">
      <div className="max-w-7xl mx-auto py-6 px-4">
        <nav className="flex justify-between mx-auto items-center">
          <Link
            className="text-4xl w-56 transition-opacity duration-500 hover:opacity-50"
            href="/"
          >
            <img className="w-28" src="/img/Common/logo.png" alt="ヘッダーロゴ" />
          </Link>

          <div className="flex items-center">
            {user.uid && (
              <div className="flex flex-col mr-2 items-center md:hidden">
                {user.photoUrl ? (
                  <div>
                    <img
                      className="w-10 rounded-full"
                      src={user.photoUrl}
                      alt="ログインしているユーザーアイコン"
                    />
                  </div>
                ) : (
                  <div>
                    <img
                      className="w-10"
                      src="/img/Common/user-icon.png"
                      alt="ゲストユーザーアイコン"
                    />
                  </div>
                )}
              </div>
            )}

            <button
              className="text-gray-600 text-2xl md:hidden focus:outline-none"
              onClick={() => toggleMenu()}
            >
              {menuOpen ? (
                <div className="relative mr-8">
                  <div className="w-8 h-1 bg-gray-400 rounded-md transform rotate-45 origin-center absolute left-0"></div>
                  <div className="w-8 h-1 bg-gray-400 rounded-md transform -rotate-45 origin-center absolute left-0"></div>
                </div>
              ) : (
                <div>
                  <div className="w-8 h-1 bg-gray-400 rounded-md"></div>
                  <div className="w-8 h-1 bg-gray-400 rounded-md mt-2"></div>
                  <div className="w-8 h-1 bg-gray-400 rounded-md mt-2"></div>
                </div>
              )}
            </button>
          </div>

          {/* 【PCメニュー】 */}
          <div className="hidden md:flex md:items-center md:gap-6 md:font-bold">
            <Link href="/about" className="hover:opacity-50 duration-300">
              About
            </Link>

            <Link href="/post-list" className="hover:opacity-50 duration-300">
              投稿一覧
            </Link>

            <Link
              href="/post"
              className="hover:opacity-50 duration-300"
            >
              <div className="flex items-center relative mr-12">
                <p>投稿する</p>
                <img
                  className="w-10 c-absolute-02"
                  src="/img/Common/tabacco.svg"
                  alt="タバコのアイコン"
                />
              </div>
            </Link>

            {user.uid && (
              <button
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-2 px-6 rounded-full shadow-md transform hover:scale-105 transition duration-300 ease-in-out"
                onClick={() => auth.signOut()}
              >
                ログアウト
              </button>
            )}

            {user.uid && (
              <Link href="/mypage">
                <div className="hidden hover:opacity-50 duration-500 md:block">
                  {user.photoUrl ? (
                    <div>
                      <img
                        className="w-10 rounded-full"
                        src={user.photoUrl}
                        alt="ログインしているユーザーアイコン"
                      />
                    </div>
                  ) : (
                    <div>
                      <img
                        className="w-10"
                        src="/img/Common/user-icon.png"
                        alt="ゲストユーザーアイコン"
                      />
                    </div>
                  )}
                </div>
              </Link>
            )}
          </div>

          {/* 【SPメニュー】 */}
          <div
            className={`fixed top-[88.5px] right-0 bg-white  h-full w-4/5 z-40 shadow-2xl transform transition-transform duration-500 ${
              menuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <nav className="pt-8 text-center">
              <Link
                href="/mypage"
                className="block py-4 text-xl text-gray-700 hover:bg-gray-100 duration-300"
              >
                マイページ
              </Link>

              <Link
                href="/about"
                className="block py-4 text-xl text-gray-700 hover:bg-gray-100 duration-300"
              >
                About
              </Link>

              <Link
                href="/post-list"
                className="block py-4 text-xl text-gray-700 hover:bg-gray-100 duration-300"
              >
                施設一覧
              </Link>

              <Link
                href="/post"
                className="block py-4 text-gray-700 hover:bg-gray-100 duration-300"
              >
                <div>
                  <div className="flex items-center relative w-fit mx-auto">
                    <p className="text-xl">投稿する</p>
                    <img
                      className="w-10 c-absolute-03"
                      src="/img/Common/tabacco.svg"
                      alt="タバコのアイコン"
                    />
                  </div>
                </div>
              </Link>

              {user.uid && (
                <button
                  className="block mt-4 mx-auto c-btn-02"
                  onClick={() => auth.signOut()}
                >
                  ログアウト
                </button>
              )}
            </nav>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
