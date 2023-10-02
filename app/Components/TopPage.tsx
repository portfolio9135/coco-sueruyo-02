import Header from "./Header";
import Footer from "./Footer";
import Ranking from "./Ranking";

const TopPage = () => {

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

        <div>
          <a href="https://jp.freepik.com/free-vector/smoking-activity-landing-page-cigarettes-package_6929231.htm#query=isometric%E3%80%80smok&position=4&from_view=search&track=ais">
            著作者：vectorpouch
          </a>
          <p>／出典：Freepik</p>
        </div>

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
        <Ranking/>
      </main>

      {/* フッター */}
      <Footer />
    </div>
  );
};

export default TopPage;