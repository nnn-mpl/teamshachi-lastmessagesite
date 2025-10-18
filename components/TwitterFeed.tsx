import React, { useEffect, useRef } from "react";

// TypeScriptでtwttrの存在を定義
declare global {
  interface Window {
    twttr?: any;
  }
}

const TwitterFeed: React.FC = () => {
  const twitterContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // widgets.js を読み込む
    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.twttr && twitterContainer.current) {
        window.twttr.widgets.createTimeline(
          {
            sourceType: "profile",
            screenName: "shachi_staff",
          },
          twitterContainer.current,
          {
            tweetLimit: 3,
            chrome: "noheader nofooter noborders transparent",
            theme: "light",
            width: "100%",
            height: "400",
          }
        );
      }
    };

    // クリーンアップ
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <section id="official-feed" className="my-16">
      <h2 className="text-3xl md:text-4xl text-center mb-8 font-yusei text-pink-500">
        公式アカウント
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl shadow-pink-100/50 p-6 border border-gray-200 flex flex-col">
          <div className="flex items-center mb-4">
            <div className="p-1 border-2 border-dashed border-pink-300 rounded-full">
              <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="font-bold text-gray-800">
                TEAM SHACHI (Official)
              </h3>
              <a
                href="https://x.com/shachi_staff"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-500 hover:underline"
              >
                @shachi_staff
              </a>
            </div>
          </div>

          {/* Twitter埋め込み領域 */}
          <div ref={twitterContainer} className="min-h-[400px] flex-grow"></div>

          <div className="text-center mt-6">
            <a
              href="https://x.com/shachi_staff"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-800 hover:bg-black text-white font-bold py-2 px-6 rounded-full transition-colors duration-300 shadow-md"
            >
              もっと見る
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TwitterFeed;
