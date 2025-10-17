import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header';
import Countdown from './components/Countdown';
import MessageList from './components/MessageList';
import PostForm from './components/PostForm';
import ThankYouCounter from './components/ThankYouCounter';
import TwitterFeed from './components/TwitterFeed';
import Footer from './components/Footer';
import { supabase, isSupabaseConfigured } from './services/supabase';
import type { Message } from './types';

const App: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [totalMessages, setTotalMessages] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const postFormRef = useRef<HTMLDivElement>(null);

    const scrollToForm = () => {
        postFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    const fetchMessages = useCallback(async () => {
        const { data, error: fetchError } = await supabase
            .from('messages')
            .select('*')
            .neq('delete_flg', '1')
            .order('create_at', { ascending: false });

        if (fetchError) {
            console.error('Error fetching messages:', fetchError);
            let errorMessage = 'メッセージの読み込みに失敗しました。';
            if (fetchError.message.includes('security policies') || fetchError.message.includes('permission denied')) {
                errorMessage += ' データへのアクセス権限がないようです。SupabaseのRow Level Security (RLS)設定を確認してください。';
            }
            setError(errorMessage);
            setMessages([]);
        } else {
            setMessages(data || []);
        }
    }, []);

    const fetchCount = useCallback(async () => {
        const { count, error: countError } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .neq('delete_flg', '1');

        if (countError) {
            console.error('Error fetching count:', countError);
             // メインのエラー表示に影響を与えないよう、ここではUIエラーを更新しない
        } else {
            setTotalMessages(count || 0);
        }
    }, []);

    const handlePostSuccess = useCallback(() => {
        if (!isSupabaseConfigured) return;
        fetchMessages();
        fetchCount();
    }, [fetchMessages, fetchCount]);

    useEffect(() => {
        if (!isSupabaseConfigured) {
            setIsLoading(false);
            return;
        }

        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            await Promise.all([fetchMessages(), fetchCount()]);
            setIsLoading(false);
        };
        fetchData();
        
        const intervalId = setInterval(fetchCount, 60000); // 1 minute auto-refresh for counter
        return () => clearInterval(intervalId);
    }, [fetchCount, fetchMessages]);

    return (
        <div className="text-gray-700 min-h-screen">
            <Header onPostClick={scrollToForm} />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* --- 開発者向けメッセージ --- */}
                {/* 以下のブロックは、Supabaseの設定が完了していない場合に警告を表示するためのものです。 */}
                {/* services/supabase.ts に正しいURLとキーを設定すると、このメッセージは自動的に非表示になります。 */}
                {/* 設定完了後にこのコードブロックごと削除しても問題ありません。 */}
                {!isSupabaseConfigured && (
                    <div className="bg-amber-100 text-amber-800 p-4 rounded-lg text-center mb-8 border border-amber-300">
                        <h2 className="font-bold text-lg mb-2">Supabaseの設定が必要です</h2>
                        <p>
                            アプリケーションを動作させるには、<code>services/supabase.ts</code> ファイルにあなたのSupabaseプロジェクトのURLと匿名キーを設定してください。
                        </p>
                    </div>
                )}
                {/* --- 開発者向けメッセージここまで --- */}
                
                <Countdown />
                
                <section id="messages" className="my-16">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl text-center mb-8 font-yusei text-pink-500">みんなの「好き」と「ありがとう」をシャチへ！</h2>
                    {isLoading ? (
                         <div className="text-center">読み込み中...</div>
                    ) : error ? (
                        <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>
                    ) : (
                        <MessageList messages={messages} />
                    )}
                </section>

                <div ref={postFormRef} className="scroll-mt-20">
                  <PostForm onPostSuccess={handlePostSuccess} isConfigured={isSupabaseConfigured} />
                </div>
                
                <ThankYouCounter count={totalMessages} />

                <TwitterFeed />
            </main>
            <Footer />
        </div>
    );
};

export default App;