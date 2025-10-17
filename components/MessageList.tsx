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
    const contentRef = useRef<HTMLDivElement>(null); // Ref for the content block to measure
    const [duration, setDuration] = useState(100);
    const [shouldAnimate, setShouldAnimate] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);

    const filteredMessages = useMemo(() => {
        if (filter === 'ALL') return messages;
        return messages.filter(msg => msg.like_member === filter);
    }, [messages, filter]);
    
    useLayoutEffect(() => {
        if (contentRef.current && containerRef.current) {
            const contentH = contentRef.current.offsetHeight; // Use offsetHeight for accuracy
            const containerH = containerRef.current.offsetHeight;
            
            setContentHeight(contentH); // Store the height of one block
            const isOverflowing = contentH > containerH;
            setShouldAnimate(isOverflowing);

            if (isOverflowing) {
                // Set scroll speed (e.g., 25 pixels per second, was 35)
                const calculatedDuration = contentH / 25;
                setDuration(Math.max(30, calculatedDuration));
            }
        }
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

            <div ref={containerRef} className={`h-[600px] overflow-hidden relative ${shouldAnimate ? 'mask-gradient' : ''}`}>
                {filteredMessages.length > 0 ? (
                    <motion.div
                        key={filter}
                        animate={shouldAnimate ? { y: [0, -contentHeight] } : { y: 0 }}
                        transition={shouldAnimate ? { duration: duration, repeat: Infinity, ease: 'linear' } : { duration: 0 }}
                    >
                        <div ref={contentRef} className="space-y-4 pb-4">
                            {filteredMessages.map(msg => (
                                <MessageCard key={msg.id} message={msg} />
                            ))}
                        </div>
                        {/* Duplicate the content for a seamless loop, only if animating */}
                        {shouldAnimate && (
                            <div className="space-y-4 pb-4" aria-hidden="true">
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
                -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 3%, black 97%, transparent 100%);
                mask-image: linear-gradient(to bottom, transparent 0%, black 3%, black 97%, transparent 100%);
              }
            `}</style>
        </div>
    );
};

export default MessageList;