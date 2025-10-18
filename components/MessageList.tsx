import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { Message, Oshimen } from '../types';
import MessageCard from './MessageCard';
import { MEMBERS, OSHIMEN_MEMBERS } from '../constants';

interface MessageListProps {
    messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
    const [filter, setFilter] = useState<Oshimen | 'ALL'>('ALL');
    const marqueeRef = useRef<HTMLDivElement>(null);
    const [animationProps, setAnimationProps] = useState<{ y: number[], duration: number } | null>(null);

    const filteredMessages = useMemo(() => {
        if (filter === 'ALL') return messages;
        return messages.filter(msg => msg.like_member === filter);
    }, [messages, filter]);
    
    useEffect(() => {
        // フィルターが変更されたときにアニメーションをリセット
        setAnimationProps(null);

        // DOMの更新後に高さを測定するため、setTimeoutで処理を遅延させる
        const timer = setTimeout(() => {
            if (marqueeRef.current && marqueeRef.current.parentElement) {
                // コンテンツは2倍になっているので、その半分の高さを取得
                const contentHeight = marqueeRef.current.scrollHeight / 2;
                const containerHeight = marqueeRef.current.parentElement.offsetHeight;

                // コンテンツがコンテナより大きい場合のみアニメーションを実行
                if (contentHeight > containerHeight && contentHeight > 0) {
                    const speed = 40; // pixels per second
                    const duration = contentHeight / speed;
                    
                    setAnimationProps({
                        y: [0, -contentHeight], // 上にスクロールさせる
                        duration: duration,
                    });
                }
            }
        }, 0);

        return () => clearTimeout(timer);
    }, [filteredMessages]);

    const tabs: (Oshimen | 'ALL')[] = ['ALL', ...OSHIMEN_MEMBERS];
    
    const tapeColors = [
      'bg-pink-300/70',
      'bg-red-300/70',
      'bg-blue-300/70',
      'bg-purple-300/70',
      'bg-green-300/70',
      'bg-gray-300/70'
    ];
    
    const rotations = ['-rotate-2', 'rotate-1', '-rotate-1', 'rotate-2', 'rotate-1', '-rotate-1'];


    return (
        <div>
            <div className="flex justify-center flex-wrap gap-4 mb-8">
                {tabs.map((tab, index) => {
                    const member = MEMBERS.find(m => m.name === tab);
                    const isActive = filter === tab;
                    
                    return (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`px-5 py-2 text-sm font-bold transition-all duration-300 shadow-md transform hover:scale-110 ${rotations[index % rotations.length]} ${tapeColors[index % tapeColors.length]} ${isActive ? 'ring-2 ring-pink-400 text-white' : 'text-gray-600'}`}
                        >
                            {tab}
                        </button>
                    );
                })}
            </div>

            <div className="h-[600px] overflow-hidden relative mask-gradient">
                {filteredMessages.length > 0 ? (
                    <motion.div
                        ref={marqueeRef}
                        key={filter} // Resets component state and animation when filter changes
                        animate={animationProps ? { y: animationProps.y } : { y: 0 }}
                        transition={animationProps ? { 
                            duration: animationProps.duration, 
                            repeat: Infinity,
                            repeatType: 'loop', // シームレスなループのために 'loop' を指定
                            ease: 'linear' 
                        } : {}}
                    >
                        {/* 無限スクロールのためにメッセージリストを2回レンダリング */}
                        <div className="space-y-4">
                          {filteredMessages.map(msg => (
                              <MessageCard key={msg.id} message={msg} />
                          ))}
                        </div>
                        <div className="space-y-4 pt-4">
                          {filteredMessages.map(msg => (
                              <MessageCard key={`${msg.id}-clone`} message={msg} />
                          ))}
                        </div>
                    </motion.div>
                ) : (
                    <div className="flex items-center justify-center h-full bg-white/30 rounded-2xl">
                        <p className="text-gray-500">まだメッセージはありません。</p>
                    </div>
                )}
            </div>
            <style>{`
              .mask-gradient {
                -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%);
                mask-image: linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%);
              }
            `}</style>
        </div>
    );
};

export default MessageList;
