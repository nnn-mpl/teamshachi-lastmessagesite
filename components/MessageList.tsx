import React, { useState, useMemo, useLayoutEffect, useRef, useEffect, useCallback } from 'react';
import type { Message, Oshimen } from '../types';
import MessageCard from './MessageCard';
import { MEMBERS, OSHIMEN_MEMBERS } from '../constants';

interface MessageListProps {
    messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
    const [filter, setFilter] = useState<Oshimen | 'ALL'>('ALL');
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [shouldAnimate, setShouldAnimate] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    
    const animationFrameId = useRef<number | null>(null);

    const filteredMessages = useMemo(() => {
        if (filter === 'ALL') return messages;
        return messages.filter(msg => msg.like_member === filter);
    }, [messages, filter]);
    
    useLayoutEffect(() => {
        if (contentRef.current && containerRef.current) {
            const contentH = contentRef.current.offsetHeight;
            const containerH = containerRef.current.offsetHeight;
            
            setContentHeight(contentH);
            const isOverflowing = contentH > containerH;
            setShouldAnimate(isOverflowing);

            // Reset scroll on filter change
            containerRef.current.scrollTop = 0;
        }
    }, [filteredMessages, filter]);

    const scrollSpeed = 0.5;

    const animateScroll = useCallback(() => {
        if (
            !shouldAnimate || 
            isPaused ||
            !containerRef.current
        ) {
            animationFrameId.current = requestAnimationFrame(animateScroll);
            return;
        }

        const container = containerRef.current;
        container.scrollTop += scrollSpeed;

        if (container.scrollTop >= contentHeight) {
            // When it reaches the end of the first block, loop back to the top seamlessly
            container.scrollTop = 0;
        }

        animationFrameId.current = requestAnimationFrame(animateScroll);
    }, [contentHeight, shouldAnimate, isPaused]);

    useEffect(() => {
        animationFrameId.current = requestAnimationFrame(animateScroll);

        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [animateScroll]);
    
    const tabs: (Oshimen | 'ALL')[] = ['ALL', ...OSHIMEN_MEMBERS];
    
    const tapeColors = [
      'bg-pink-300/70', 'bg-red-300/70', 'bg-blue-300/70',
      'bg-purple-300/70', 'bg-green-300/70', 'bg-gray-300/70'
    ];
    const rotations = ['-rotate-2', 'rotate-1', '-rotate-1', 'rotate-2', 'rotate-1', '-rotate-1'];

    return (
        <div>
            <div className="flex justify-center flex-wrap gap-4 mb-8">
                {tabs.map((tab, index) => (
                    <button
                        key={tab}
                        onClick={(e) => {
                            setFilter(tab);
                            e.currentTarget.blur(); // Remove focus after click
                        }}
                        className={`px-5 py-2 text-sm font-bold transition-all duration-300 shadow-md transform hover:scale-110 focus:outline-none ${rotations[index % rotations.length]} ${tapeColors[index % tapeColors.length]} ${filter === tab ? 'ring-2 ring-pink-400 text-white' : 'text-gray-600'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div 
                ref={containerRef} 
                className={`h-[600px] overflow-y-hidden relative mask-gradient`}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onTouchStart={() => setIsPaused(true)}
                onTouchEnd={() => setIsPaused(false)}
            >
                {filteredMessages.length > 0 ? (
                    <div key={filter}> {/* Add key here to force re-mount on filter change */}
                        <div ref={contentRef} className="space-y-4 pb-4">
                            {filteredMessages.map(msg => <MessageCard key={msg.id} message={msg} />)}
                        </div>
                        {/* Duplicate the content for a seamless loop, only if animating */}
                        {shouldAnimate && (
                            <div className="space-y-4 pb-4" aria-hidden="true">
                                {filteredMessages.map(msg => <MessageCard key={`${msg.id}-clone`} message={msg} />)}
                            </div>
                        )}
                    </div>
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