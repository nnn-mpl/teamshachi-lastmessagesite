import React from 'react';
import { motion } from 'framer-motion';

const SnsShare: React.FC = () => {
    const message = "TEAM SHACHIにメッセージを届けました💌";
    const url = "https://shachimessage.vercel.app";
    const hashtags = [
        "#シャチハッピーラストイヤー",
        "#TEAMSHACHI",
        "#タフ民からシャチのみんなへ"
    ];

    // To achieve line breaks in the tweet, we'll combine everything into the 'text' parameter.
    // The \n character will be URL-encoded to create new lines.
    const fullText = [
        message,
        "", // For a blank line between the message and hashtags
        ...hashtags,
        url
    ].join('\n');
    
    const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(fullText)}`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-6 text-center"
        >
            <p className="mb-4 text-gray-600">この想いをXでシェアしよう！</p>
            <a
                href={twitterShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-sky-400 hover:bg-sky-500 text-white font-bold py-2 px-6 rounded-full transition-colors duration-300 shadow-md"
            >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                </svg>
                <span>Xでシェアする</span>
            </a>
        </motion.div>
    );
};

export default SnsShare;