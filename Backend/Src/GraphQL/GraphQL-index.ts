
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export abstract class IQuery {
    abstract getUser(): Nullable<User> | Promise<Nullable<User>>;

    abstract getGuilds(): Nullable<Nullable<Guild>[]> | Promise<Nullable<Nullable<Guild>[]>>;

    abstract getMutualGuilds(): Nullable<Nullable<Guild>[]> | Promise<Nullable<Nullable<Guild>[]>>;
}

export class User {
    userID?: Nullable<string>;
    username: string;
    discriminator: string;
    avatar?: Nullable<string>;
    guilds?: Nullable<Nullable<Guild>[]>;
}

export class Guild {
    id: string;
    name: string;
    icon?: Nullable<string>;
    description?: Nullable<string>;
    banner?: Nullable<string>;
    owner_id?: Nullable<string>;
    premium_tier?: Nullable<number>;
    roles?: Nullable<Nullable<Role>[]>;
    emojis?: Nullable<Nullable<Emoji>[]>;
    stickers?: Nullable<Nullable<Sticker>[]>;
}

export class Role {
    id: string;
    name: string;
    permission: string;
    position: number;
    color: number;
    icon?: Nullable<string>;
}

export class Emoji {
    id: string;
    name: string;
    animation: boolean;
    available: boolean;
}

export class Sticker {
    id: string;
    name: string;
    description?: Nullable<string>;
    tags?: Nullable<string>;
    available: boolean;
}

type Nullable<T> = T | null;
