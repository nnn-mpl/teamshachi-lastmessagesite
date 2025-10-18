import React, { useEffect } from 'react';

// Twitterのウィジェットがグローバルスコープに存在することをTypeScriptに伝える
declare global {
    interface Window {
        twttr?: any;
    }
}

const TwitterFeed: React.FC = () => {
    const twitterUrl = "https://x.com/shachi_staff";
    const instagramUrl = "https://www.instagram.com/team.shachi/";

    // コンポーネントがマウントされた後に、Twitterのウィジェットを再読み込みする
    useEffect(() => {
        if (window.twttr) {
            window.twttr.widgets.load();
        }
    }, []);

    const accountCardClasses = "bg-white rounded-2xl shadow-xl shadow-pink-100/50 p-6 border border-gray-200 flex flex-col";

    return (
        <section id="official-feed" className="my-16">
            <h2 className="text-3xl md:text-4xl text-center mb-8 font-yusei text-pink-500">公式アカウント</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Twitter Card */}
                <div className={accountCardClasses}>
                    <div className="flex items-center mb-4">
                         <div className="p-1 border-2 border-dashed border-pink-300 rounded-full">
                            <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <h3 className="font-bold text-gray-800">TEAM SHACHI (Official)</h3>
                            <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">@shachi_staff</a>
                        </div>
                    </div>
                    <div className="min-h-[400px] flex-grow">
                        <a 
                            className="twitter-timeline" 
                            data-height="400"
                            data-theme="light"
                            data-tweet-limit="3"
                            data-chrome="noheader nofooter noborders transparent"
                            href={twitterUrl}
                        >
                            Tweets by shachi_staff
                        </a>
                    </div>
                    <div className="text-center mt-6">
                         <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="bg-gray-800 hover:bg-black text-white font-bold py-2 px-6 rounded-full transition-colors duration-300 shadow-md">
                            もっと見る
                        </a>
                    </div>
                </div>

                {/* Instagram Card */}
                <div className={accountCardClasses}>
                    <div className="flex items-center mb-4">
                         <div className="p-1 border-2 border-dashed border-pink-300 rounded-full">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 via-pink-500 to-orange-400 flex items-center justify-center">
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.585-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.585-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.585.069-4.85c.149-3.225 1.664 4.771 4.919 4.919 1.266-.058 1.644-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.059-1.281.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.058-1.689-.072-4.948-.072z"></path><path d="M12 6.845a5.155 5.155 0 100 10.31 5.155 5.155 0 000-10.31zm0 8.31a3.155 3.155 0 110-6.31 3.155 3.155 0 010 6.31z"></path><path d="M16.949 7.854a1.233 1.233 0 10-2.466 0 1.233 1.233 0 002.466 0z"></path>
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <h3 className="font-bold text-gray-800">TEAM SHACHI (Official)</h3>
                            <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">@team.shachi</a>
                        </div>
                    </div>
                    <div className="min-h-[400px] flex-grow flex flex-col items-center justify-center bg-gray-50/50 rounded-lg p-4 text-center">
                        <p className="text-gray-600">
                            メンバーの素敵な写真や<br/>オフショットがたくさん！
                        </p>
                        <p className="text-xs text-gray-400 mt-4">
                            ※Instagramの仕様により、最新の投稿をここに直接表示することはできません。
                        </p>
                    </div>
                    <div className="text-center mt-6">
                         <a href={instagramUrl} target="_blank" rel="noopener noreferrer" 
                         className="bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 hover:opacity-90 text-white font-bold py-2 px-6 rounded-full transition-opacity duration-300 shadow-md">
                            Instagramで見る
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TwitterFeed;