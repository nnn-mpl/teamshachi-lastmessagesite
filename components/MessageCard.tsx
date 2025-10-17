import React from 'react';
import type { Message } from '../types';
import { MEMBERS } from '../constants';

interface MessageCardProps {
    message: Message;
}

const MessageCard: React.FC<MessageCardProps> = ({ message }) => {
    const member = MEMBERS.find(m => m.name === message.like_member);
    const borderColor = member?.borderColor.replace('-500', '-300') || 'border-gray-300';
    const bgColor = member?.bgColor.replace('/10', '/20').replace('-500', '-100') || 'bg-gray-50/50';

    const formattedDate = new Date(message.create_at).toLocaleString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <div className={`border-l-4 ${borderColor} ${bgColor} p-4 rounded-lg shadow-md bg-white`}>
            <p className="text-base whitespace-pre-wrap break-words text-gray-700 leading-relaxed">{message.message}</p>
            <div className="flex justify-between items-center mt-3 text-sm text-gray-400">
                <span>- {message.nickname} さん</span>
                <span>{formattedDate}</span>
            </div>
        </div>
    );
};

export default MessageCard;