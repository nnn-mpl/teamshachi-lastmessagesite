import type { Member } from './types';
// Fix: Re-export OSHIMEN_MEMBERS from types.ts to resolve import errors.
export { OSHIMEN_MEMBERS } from './types';

export const MEMBERS: Member[] = [
    {
        id: 'honoka',
        name: '秋本帆華',
        color: '#E50012',
        borderColor: 'border-red-500',
        bgColor: 'bg-red-500/10',
        textColor: 'text-red-400',
        hashtag: '帆華推し',
    },
    {
        id: 'nao',
        name: '咲良菜緒',
        color: '#0080CC',
        borderColor: 'border-blue-500',
        bgColor: 'bg-blue-500/10',
        textColor: 'text-blue-400',
        hashtag: '菜緒推し',
    },
    {
        id: 'yuzuki',
        name: '大黒柚姫',
        color: '#8A008A',
        borderColor: 'border-purple-500',
        bgColor: 'bg-purple-500/10',
        textColor: 'text-purple-400',
        hashtag: '柚姫推し',
    },
    {
        id: 'haruna',
        name: '坂本遥奈',
        color: '#00B330',
        borderColor: 'border-green-500',
        bgColor: 'bg-green-500/10',
        textColor: 'text-green-400',
        hashtag: '遥奈推し',
    },
    {
        id: 'hakoiri',
        name: '箱推し',
        color: '#6B7280',
        borderColor: 'border-gray-500',
        bgColor: 'bg-gray-500/10',
        textColor: 'text-gray-500',
        hashtag: '箱推し',
    },
];

export const NG_WORDS: string[] = ["死ね", "バカ", "きもい", "キモ"];

export const FINAL_DATE = new Date('2025-12-13T00:00:00+09:00');