import React, { useState, useMemo, useLayoutEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { Message, Oshimen } from '../types';
import MessageCard from './MessageCard';
import { MEMBERS, OSHIMEN_MEMBERS } from '../constants';

interface MessageListProps {
    messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
    const [filter, setFilter] = useState<Oshimen | 'ALL'>('ALL');
    const containerRef = useRef<HTMLDivElement>(null);
    const marqueeRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null); // 実際のコンテンツの高さを測るためのRef
    const [animationProps, setAnimationProps] = useState<{ y: number[], duration: number } | null>(null);
    const [isOverflowing, setIsOverflowing] = useState(false);

    const filteredMessages = useMemo(() => {
        if (filter === 'ALL') return messages;
        return messages.filter(msg => msg.like_member === filter);
    }, [messages, filter]);
    
    // 1. メッセージリストが更新されたときに、オーバーフロー状態を決定する
    useLayoutEffect(() => {
        if (containerRef.current && contentRef.current) {
            const contentHeight = contentRef.current.offsetHeight;
            const containerHeight = containerRef.current.offsetHeight;
            const newIsOverflowing = contentHeight > containerHeight;

            if (newIsOverflowing !== isOverflowing) {
                setIsOverflowing(newIsOverflowing);
            }
        }
    }, [filteredMessages, isOverflowing]);

    // 2. オーバーフロー状態が確定した後に、アニメーションを設定する
    useLayoutEffect(() => {
        if (isOverflowing && contentRef.current) {
            const contentHeight = contentRef.current.offsetHeight;
            if (contentHeight > 0) {
                const speed = 40; // pixels per second
                const scrollDistance = contentHeight + 16; // pt-4 = 1rem = 16px
                const duration = scrollDistance / speed;
                
                setAnimationProps({
                    y: [0, -scrollDistance],
                    duration: duration,
                });
            }
        } else {
            // オーバーフローしていない場合はアニメーションを停止
            setAnimationProps(null);
        }
    }, [isOverflowing, filteredMessages]);


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

            <div ref={containerRef} className={`h-[600px] overflow-hidden relative ${isOverflowing ? 'mask-gradient' : ''}`}>
                {filteredMessages.length > 0 ? (
                    <motion.div
                        ref={marqueeRef}
                        // メッセージ数やフィルターが変わったらコンポーネントをリセットしてアニメーションを最初から開始
                        key={`${filter}-${filteredMessages.length}`}
                        animate={animationProps ? { y: animationProps.y } : { y: 0 }}
                        transition={animationProps ? { 
                            duration: animationProps.duration, 
                            repeat: Infinity,
                            repeatType: 'loop', // シームレスなループのために 'loop' を指定
                            ease: 'linear' 
                        } : { duration: 0 }}
                    >
                        {/* 常に1つ目のリストは描画し、高さを測定する */}
                        <div ref={contentRef} className="space-y-4">
                          {filteredMessages.map(msg => (
                              <MessageCard key={msg.id} message={msg} />
                          ))}
                        </div>
                        
                        {/* オーバーフローしている場合のみ、無限スクロール用の複製リストを描画 */}
                        {isOverflowing && (
                          <div className="space-y-4 pt-4">
                            {filteredMessages.map(msg => (
                                <MessageCard key={`${msg.id}-clone`} message={msg} />
                            ))}
                          </div>
                        )}
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