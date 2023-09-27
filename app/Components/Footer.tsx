import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 mt-20 sticky top-[100vh]">
      <div className=" max-w-7xl mx-auto py-6 px-4 flex flex-col items-center justify-between md:flex-row">
        <div>
          <img
            className=" w-28"
            src="/img/Common/logo.png"
            alt="フッターロゴ"
          />
        </div>

        <div className="mt-6">
          ©2023 CoCo Sueruyo All right reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;