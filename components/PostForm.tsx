import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { NG_WORDS, OSHIMEN_MEMBERS } from '../constants';
import type { Oshimen } from '../types';
import SnsShare from './SnsShare';
import { motion, AnimatePresence } from 'framer-motion';

interface PostFormProps {
    onPostSuccess: () => void;
    isConfigured: boolean;
}

const PostForm: React.FC<PostFormProps> = ({ onPostSuccess, isConfigured }) => {
    const [name, setName] = useState('');
    const [oshimen, setOshimen] = useState<Oshimen | ''>('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [lastSubmittedOshimen, setLastSubmittedOshimen] = useState<Oshimen | null>(null);
    const [showShare, setShowShare] = useState(false);

    const NICKNAME_MAX_LENGTH = 30;
    const MESSAGE_MAX_LENGTH = 450;

    const validateForm = () => {
        if (!name.trim()) return 'ニックネームを入力してください。';
        if (name.length > NICKNAME_MAX_LENGTH) return `ニックネームは${NICKNAME_MAX_LENGTH}文字以内で入力してください。`;
        if (!oshimen) return '推しメンを選択してください。';
        if (!message.trim()) return 'メッセージを入力してください。';
        if (message.length > MESSAGE_MAX_LENGTH) return `メッセージは${MESSAGE_MAX_LENGTH}文字以内で入力してください。`;
        
        const foundNGWord = NG_WORDS.find(word => message.includes(word));
        if (foundNGWord) {
            return `不適切な単語が含まれています: ${foundNGWord}`;
        }
        
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setShowShare(false);

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsSubmitting(true);
        const { error: insertError } = await supabase
            .from('messages')
            .insert([{ 
                nickname: name, 
                like_member: oshimen, 
                message,
                delete_flg: '0' 
            }]);
        
        setIsSubmitting(false);

        if (insertError) {
            setError('投稿に失敗しました。時間をおいて再度お試しください。');
            console.error('Insert error:', insertError);
        } else {
            setSuccessMessage('投稿ありがとうございました！あなたの想いが届きました。');
            setLastSubmittedOshimen(oshimen as Oshimen);
            setName('');
            setOshimen('');
            setMessage('');
            onPostSuccess();
            setShowShare(true);
            setTimeout(() => setSuccessMessage(null), 5000);
        }
    };

    return (
        <section id="post-form" className="my-16 p-6 sm:p-8 bg-white rounded-2xl shadow-xl shadow-pink-100/50 max-w-2xl mx-auto border border-gray-200">
            <h2 className="text-2xl sm:text-3xl md:text-4xl text-center mb-6 font-yusei text-pink-500">ありがとうと好きを届けよう</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <fieldset disabled={!isConfigured} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-500 mb-1">ニックネーム</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-transparent border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-pink-300 transition disabled:opacity-50"
                            placeholder="ニックネーム"
                            required
                            maxLength={NICKNAME_MAX_LENGTH + 5} // Allow typing a bit over to show error
                        />
                        <div className={`text-right text-xs mt-1 ${name.length > NICKNAME_MAX_LENGTH ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                            {name.length}/{NICKNAME_MAX_LENGTH}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="oshimen" className="block text-sm font-medium text-gray-500 mb-1">推しメン</label>
                        <select
                            id="oshimen"
                            value={oshimen}
                            onChange={(e) => setOshimen(e.target.value as Oshimen | '')}
                            className="w-full bg-transparent border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-pink-300 transition disabled:opacity-50"
                            required
                        >
                            <option value="" disabled>選択する</option>
                            {OSHIMEN_MEMBERS.map(member => (
                                <option key={member} value={member}>{member}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-500 mb-1">メッセージ</label>
                        <textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={5}
                            className="w-full bg-amber-50/50 border-2 border-gray-200 rounded-md px-4 py-2 focus:ring-2 focus:ring-pink-300 focus:border-pink-300 outline-none transition disabled:opacity-50"
                            placeholder="TEAM SHACHIへの感謝の気持ち、メンバーの好きなところ、伝えたい想いを自由に書いてください！"
                            required
                            maxLength={MESSAGE_MAX_LENGTH + 10} // Allow typing a bit over to show error
                        ></textarea>
                        <div className={`text-right text-xs mt-1 ${message.length > MESSAGE_MAX_LENGTH ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                            {message.length}/{MESSAGE_MAX_LENGTH}
                        </div>
                    </div>
                </fieldset>
                
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-red-100 text-red-700 p-3 rounded-md text-sm"
                        >
                            {error}
                        </motion.div>
                    )}
                    {successMessage && (
                        <motion.div
                             initial={{ opacity: 0, y: -10 }}
                             animate={{ opacity: 1, y: 0 }}
                             exit={{ opacity: 0, y: -10 }}
                             className="bg-green-100 text-green-700 p-3 rounded-md text-sm"
                        >
                            {successMessage}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="text-center pt-2">
                    <button
                        type="submit"
                        disabled={isSubmitting || !isConfigured}
                        className="w-full sm:w-auto bg-gradient-to-r from-pink-400 to-amber-300 hover:from-pink-500 hover:to-amber-400 text-white font-bold py-3 px-12 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg shadow-pink-200/80"
                    >
                        {isSubmitting ? '送信中...' : 'メッセージを送信'}
                    </button>
                    {!isConfigured && <p className="text-xs text-amber-600 mt-2">Supabaseが設定されていないため投稿できません。</p>}
                    <p className="text-xs text-gray-500 mt-4">
                        不適切なコメントと判断されたものは、<br className="sm:hidden" />管理者が予告なく削除する場合がございます。
                    </p>
                </div>
            </form>
            <AnimatePresence>
                {showShare && lastSubmittedOshimen && <SnsShare oshimen={lastSubmittedOshimen} />}
            </AnimatePresence>
        </section>
    );
};

export default PostForm;