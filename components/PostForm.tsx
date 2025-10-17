import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { NG_WORDS, OSHIMEN_MEMBERS, MEMBERS } from '../constants';
import type { Oshimen } from '../types';
import SnsShare from './SnsShare';
import { motion, AnimatePresence } from 'framer-motion';

// Fix: Define the PostFormProps interface to type the component's props.
interface PostFormProps {
    onPostSuccess: () => void;
    isConfigured: boolean;
}

interface PreviewData {
    name: string;
    oshimen: Oshimen;
    message: string;
}

const PostForm: React.FC<PostFormProps> = ({ onPostSuccess, isConfigured }) => {
    const [name, setName] = useState('');
    const [oshimen, setOshimen] = useState<Oshimen | ''>('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [showShare, setShowShare] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [previewData, setPreviewData] = useState<PreviewData | null>(null);

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

    const handlePreview = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setShowShare(false);

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }
        
        setPreviewData({ name, oshimen: oshimen as Oshimen, message });
        setShowPreview(true);
    };
    
    const handleConfirmSubmit = async () => {
        if (!previewData) return;

        setIsSubmitting(true);
        setShowPreview(false);

        const { error: insertError } = await supabase
            .from('messages')
            .insert([{ 
                nickname: previewData.name, 
                like_member: previewData.oshimen, 
                message: previewData.message,
                delete_flg: '0' 
            }]);
        
        setIsSubmitting(false);

        if (insertError) {
            setError('投稿に失敗しました。時間をおいて再度お試しください。');
            console.error('Insert error:', insertError);
        } else {
            setSuccessMessage('投稿ありがとうございました！あなたの想いが届きました。');
            setName('');
            setOshimen('');
            setMessage('');
            onPostSuccess();
            setShowShare(true);
            setTimeout(() => setSuccessMessage(null), 5000);
        }
        setPreviewData(null);
    };

    const handleCancelPreview = () => {
        setShowPreview(false);
        setPreviewData(null);
    }
    
    const memberForPreview = previewData ? MEMBERS.find(m => m.name === previewData.oshimen) : null;
    const borderColorForPreview = memberForPreview?.borderColor.replace('-500', '-300') || 'border-gray-300';
    const bgColorForPreview = memberForPreview?.bgColor.replace('/10', '/20').replace('-500', '-100') || 'bg-gray-50/50';

    return (
        <>
            <section id="post-form" className="my-16 p-6 sm:p-8 bg-white rounded-2xl shadow-xl shadow-pink-100/50 max-w-2xl mx-auto border border-gray-200">
                <h2 className="text-2xl sm:text-3xl md:text-4xl text-center mb-6 font-yusei text-pink-500">TEAM SHACHIへ愛と感謝を届けよう</h2>
                <form onSubmit={handlePreview} className="space-y-6">
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
                            {isSubmitting ? '送信中...' : '投稿内容を確認する'}
                        </button>
                        {!isConfigured && <p className="text-xs text-amber-600 mt-2">Supabaseが設定されていないため投稿できません。</p>}
                        <p className="text-xs text-gray-500 mt-4">
                            不適切なコメントと判断されたものは、<br className="sm:hidden" />管理者が予告なく削除する場合がございます。
                        </p>
                    </div>
                </form>
                <AnimatePresence>
                    {showShare && <SnsShare />}
                </AnimatePresence>
            </section>

            <AnimatePresence>
                {showPreview && previewData && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        onClick={handleCancelPreview}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl max-w-lg w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-xl sm:text-2xl text-center mb-6 font-yusei text-pink-500">投稿内容の確認</h3>
                            
                            <div className={`border-l-4 ${borderColorForPreview} ${bgColorForPreview} p-4 rounded-lg shadow-inner bg-white`}>
                                <p className="text-base whitespace-pre-wrap break-words text-gray-700 leading-relaxed max-h-48 overflow-y-auto">{previewData.message}</p>
                                <div className="flex justify-between items-center mt-3 text-sm text-gray-400">
                                    <span>- {previewData.name} さん</span>
                                    <span className="font-bold">{previewData.oshimen}</span>
                                </div>
                            </div>

                            <p className="text-xs text-center text-red-600 mt-6 bg-red-50 p-3 rounded-lg border border-red-200">
                                メンバーや他のファンの方々が悲しむような<br className="sm:hidden" />誹謗中傷やネガティブな内容の投稿はご遠慮ください。
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 mt-6">
                                <button
                                    onClick={handleCancelPreview}
                                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-full transition-colors duration-300"
                                >
                                    修正する
                                </button>
                                <button
                                    onClick={handleConfirmSubmit}
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-pink-400 to-amber-300 hover:from-pink-500 hover:to-amber-400 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 disabled:opacity-50"
                                >
                                    {isSubmitting ? '送信中...' : 'この内容で投稿する'}
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