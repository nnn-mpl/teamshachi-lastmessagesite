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
    const [duration, setDuration] = useState(100);

    const filteredMessages = useMemo(() => {
        if (filter === 'ALL') return messages;
        return messages.filter(msg => msg.like_member === filter);
    }, [messages, filter]);
    
    useEffect(() => {
        if (marqueeRef.current) {
            const height = marqueeRef.current.scrollHeight;
            const calculatedDuration = Math.max(30, filteredMessages.length * 5); 
            setDuration(calculatedDuration);
        }
    }, [filteredMessages.length]);

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
                        className="space-y-4"
                        animate={{ y: ['100%', `-${(filteredMessages.length * 150)}px`] }}
                        transition={{ duration: duration, repeat: Infinity, ease: 'linear' }}
                    >
                        {filteredMessages.map(msg => (
                            <MessageCard key={msg.id} message={msg} />
                        ))}
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