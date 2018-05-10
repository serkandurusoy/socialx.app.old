export * from './gql';
export * from './appUI';
export * from './popup';
export * from './global';

// temp

import {IUserQuery} from './gql';

export interface FriendsSearchResult {
	id: string;
	fullName: string;
	location: string;
	avatarURL?: string;
}

export interface IWallPostCommentReply {
	id: string;
	text: string;
	user: {
		fullName: string;
		avatarURL?: string;
		id: string;
	};
	timestamp: Date;
	numberOfLikes: number;
	likes: IUserQuery[];
	likedByMe: boolean;
}

export interface IWallPostComment extends IWallPostCommentReply {
	replies: IWallPostCommentReply[];
}

export enum SearchFilterValues {
	People = 'people',
	Groups = 'groups',
}

export enum SearchResultKind {
	Friend = 'friend',
	NotFriend = 'notFriend',
	Group = 'group',
}

export interface SearchResultPeople {
	id: string;
	kind: SearchResultKind;
	fullName: string;
	username: string;
	avatarURL?: string;
}

export interface SearchResultGroups {
	id: string;
	kind: SearchResultKind;
	fullName: string;
	username: string;
	avatarURL?: string;
}

export interface SearchResultCreateGroup {
	id: string;
	fullName: string;
	location: string;
	avatarURL?: string;
}
