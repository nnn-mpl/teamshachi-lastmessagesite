import React from 'react';
import { motion } from 'framer-motion';

interface HeaderProps {
    onPostClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onPostClick }) => {
    return (
        <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md shadow-sm">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-end h-16">
                    <motion.button
                        onClick={onPostClick}
                        className="bg-pink-400 hover:bg-pink-500 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300 shadow-md shadow-pink-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        メッセージを投稿
                    </motion.button>
                </div>
            </div>
        </header>
    );
};

export default Header;