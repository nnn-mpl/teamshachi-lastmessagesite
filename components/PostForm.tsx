import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { NG_WORDS, OSHIMEN_MEMBERS } from '../constants';
import type { Oshimen, Message } from '../types';
import SnsShare from './SnsShare';
import MessageCard from './MessageCard';
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
    const [showPreview, setShowPreview] = useState(false);

    const validateForm = () => {
        if (!name.trim()) return 'ニックネームを入力してください。';
        if (name.length > 30) return 'ニックネームは30文字以内で入力してください。';
        if (!oshimen) return '推しメンを選択してください。';
        if (!message.trim()) return 'メッセージを入力してください。';
        if (message.length > 300) return 'メッセージは300文字以内で入力してください。';
        
        const foundNGWord = NG_WORDS.find(word => message.includes(word));
        if (foundNGWord) {
            return `不適切な単語が含まれています: ${foundNGWord}`;
        }
        
        return null;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }
        
        setError(null);
        setShowPreview(true);
    };
    
    const handleConfirmPost = async () => {
        setShowPreview(false);
        setError(null);
        setSuccessMessage(null);
        setShowShare(false);

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
        <>
            <section id="post-form" className="mt-12 p-6 sm:p-8 bg-white rounded-2xl shadow-xl shadow-pink-100/50 max-w-2xl mx-auto border border-gray-200">
                <h2 className="text-2xl sm:text-3xl md:text-4xl text-center mb-6 font-yusei text-pink-500 leading-relaxed">TEAM SHACHIへ<br />愛と感謝を届けよう</h2>
                <form onSubmit={handleSubmit} className="space-y-8">
                    <fieldset disabled={!isConfigured} className="space-y-8">
                        <div>
                            <label htmlFor="name" className="flex justify-between items-baseline text-sm font-medium text-gray-500 mb-1">
                                <span>ニックネーム</span>
                                <span className={`text-xs font-mono ${name.length > 30 ? 'text-red-500' : 'text-gray-400'}`}>
                                    {name.length} / 30
                                </span>
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-transparent border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-pink-300 transition disabled:opacity-50"
                                placeholder="ニックネーム"
                                required
                                maxLength={30}
                            />
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
                            <label htmlFor="message" className="flex justify-between items-baseline text-sm font-medium text-gray-500 mb-1">
                                <span>メッセージ</span>
                                <span className={`text-xs font-mono ${message.length > 300 ? 'text-red-500' : 'text-gray-400'}`}>
                                    {message.length} / 300
                                </span>
                            </label>
                            <textarea
                                id="message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={5}
                                className="w-full bg-amber-50/50 border-2 border-gray-200 rounded-md px-4 py-2 focus:ring-2 focus:ring-pink-300 focus:border-pink-300 outline-none transition disabled:opacity-50"
                                placeholder="TEAM SHACHIへの感謝の気持ち、メンバーの好きなところ、伝えたい想いを自由に書いてください！"
                                required
                                maxLength={300}
                            ></textarea>
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

                    <div className="text-center">
                        <button
                            type="submit"
                            disabled={isSubmitting || !isConfigured}
                            className="w-full sm:w-auto bg-gradient-to-r from-pink-400 to-amber-300 hover:from-pink-500 hover:to-amber-400 text-white font-bold py-3 px-12 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg shadow-pink-200/80"
                        >
                            {isSubmitting ? '送信中...' : 'メッセージを送信'}
                        </button>
                        {!isConfigured && <p className="text-xs text-amber-600 mt-2">Supabaseが設定されていないため投稿できません。</p>}
                        <p className="text-xs text-gray-500 mt-4">
                            誹謗中傷や個人情報の書き込みはご遠慮ください。<br />不適切なコメントと判断されたものは、<br className="sm:hidden" />管理者が予告なく削除する場合がございます。
                        </p>
                    </div>
                </form>
                <AnimatePresence>
                    {showShare && lastSubmittedOshimen && <SnsShare oshimen={lastSubmittedOshimen} />}
                </AnimatePresence>
            </section>

            <AnimatePresence>
                {showPreview && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        onClick={() => setShowPreview(false)}
                        aria-modal="true"
                        role="dialog"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-lg shadow-xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-xl font-bold text-center mb-4 text-gray-700">投稿内容の確認</h3>
                            
                            <div className="mb-6">
                                <MessageCard message={{
                                    id: 0,
                                    nickname: name,
                                    like_member: oshimen as Oshimen,
                                    message: message,
                                    create_at: new Date().toISOString(),
                                    delete_flg: '0'
                                }} />
                            </div>

                            <div className="bg-amber-100/60 border-l-4 border-amber-400 text-amber-800 p-4 rounded-r-lg mb-6 text-sm">
                                <p className="font-bold mb-1">投稿前の注意</p>
                                <p>誹謗中傷や個人情報の書き込みはご遠慮ください。不適切な内容と判断された場合、予告なく削除することがあります。</p>
                            </div>

                            <div className="flex flex-col sm:flex-row-reverse gap-4">
                                <button
                                    type="button"
                                    onClick={handleConfirmPost}
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-pink-400 to-amber-300 hover:from-pink-500 hover:to-amber-400 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 disabled:opacity-50"
                                >
                                    {isSubmitting ? '送信中...' : 'この内容で投稿する'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowPreview(false)}
                                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-full transition-colors duration-300"
                                >
                                    修正する
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default PostForm;