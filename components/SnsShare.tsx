import React from 'react';
import { motion } from 'framer-motion';
import type { Oshimen } from '../types';

interface SnsShareProps {
    oshimen: Oshimen;
}

const SnsShare: React.FC<SnsShareProps> = ({ oshimen }) => {
    // Web Share APIで共有する際のテキスト（ハッシュタグを含む）
    const shareText = "TEAM SHACHIにメッセージを届けました💌 #シャチハッピーラストイヤー #TEAMSHACHI #タフ民からシャチのみんなへ";
    const shareUrl = "https://shachimessage.vercel.app"; // TODO: 本番環境のURLに更新してください

    // Web Share APIが使えないブラウザ用のURL
    const browserShareText = "TEAM SHACHIにメッセージを届けました💌";
    const browserHashtags = "シャチハッピーラストイヤー,TEAMSHACHI,タフ民からシャチのみんなへ";
    const twitterShareUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(browserShareText)}&url=${encodeURIComponent(shareUrl)}&hashtags=${encodeURIComponent(browserHashtags)}`;

    const handleShare = async () => {
        if (navigator.share) {
            // Web Share APIが利用可能な場合
            try {
                await navigator.share({
                    title: 'TEAM SHACHI FINAL MESSAGE',
                    text: shareText,
                    url: shareUrl,
                });
            } catch (error) {
                // ユーザーがキャンセルした場合などはエラーになるが、特に何もしない
                console.info('Web Share API was cancelled.', error);
            }
        } else {
            // Web Share APIが利用できない場合（PCなど）
            window.open(twitterShareUrl, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-6 text-center"
        >
            <p className="mb-4 text-gray-600">この想いをXでシェアしよう！</p>
            <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 bg-gray-800 hover:bg-black text-white font-bold py-2 px-6 rounded-full transition-colors duration-300 shadow-md"
                aria-label="Xで投稿をシェアする"
            >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                </svg>
                <span>Xでシェアする</span>
            </button>
        </motion.div>
    );
};

export default SnsShare;
