export const OSHIMEN_MEMBERS = ['秋本帆華', '咲良菜緒', '大黒柚姫', '坂本遥奈', '箱推し'] as const;
export type Oshimen = typeof OSHIMEN_MEMBERS[number];

export interface Message {
    id: number;
    nickname: string;
    like_member: Oshimen;
    message: string;
    create_at: string;
    delete_flg: string;
}

export interface Member {
    id: string;
    name: Oshimen;
    color: string;
    borderColor: string;
    bgColor: string;
    textColor: string;
    hashtag: string;
}