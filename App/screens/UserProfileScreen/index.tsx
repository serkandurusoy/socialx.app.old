import {ModalCloseButton} from 'components';
import {IWallPostCardProp} from 'components/Displayers';
import {ToggleIconButton} from 'components/Interaction';
import get from 'lodash/get';
import React, {Component} from 'react';
import {InteractionManager, View} from 'react-native';
import {NavigationScreenProp} from 'react-navigation';
import {Icons} from 'theme/';
import {IMediaProps} from 'types';
import UserProfileScreenComponent from './screen';

const GRID_PAGE_SIZE = 20;
const GRID_MAX_RESULTS = 5000;

const FULL_NAME = 'Lester Wheeler';
const USER_SMALL_AVATAR_URL = 'https://placeimg.com/120/120/people';
const USER_BIG_AVATAR_URL = 'https://placeimg.com/240/240/people';
const USER_NAME = 'LesterWheeler';

const RECENT_USER_POSTS: IWallPostCardProp[] = [
	{
		id: '111',
		title: 'My first post!',
		text:
			'This is a very long text that will be truncated and only the first 3 lines will be displayed. ' +
			'Then ellipsis will show to indicate that more text is hidden. ' +
			'To a general advertiser outdoor advertising is worthy of consideration',
		imageSource: 'https://placeimg.com/2000/1500/any',
		smallAvatar: USER_SMALL_AVATAR_URL,
		fullName: FULL_NAME,
		timestamp: new Date('Jan 20 2018'),
		numberOfLikes: 20,
		numberOfSuperLikes: 4,
		numberOfComments: 3,
		numberOfWalletCoins: 5,
		canDelete: true,
		mediaType: 'jpg',
	},
	{
		id: '222',
		taggedFriends: [{fullName: 'Isabelle Wilson'}, {fullName: 'Teddy Decola'}, {fullName: 'Michiko Bisson'}],
		location: 'Miami Beach, Florida',
		title: 'Hey, my second post to SocialX network!',
		imageSource: 'https://placeimg.com/640/550/any',
		smallAvatar: USER_SMALL_AVATAR_URL,
		fullName: FULL_NAME,
		timestamp: new Date('Jun 17 2017'),
		numberOfLikes: 11,
		numberOfSuperLikes: 6,
		numberOfComments: 4,
		numberOfWalletCoins: 2,
		canDelete: true,
		mediaType: 'jpg',
	},
];

const INITIAL_STATE = {
	numberOfPhotos: 13,
	numberOfLikes: 24,
	numberOfFollowers: 13401,
	numberOfFollowing: 876324,
	isFollowed: false,
	avatarURL: USER_BIG_AVATAR_URL,
	fullName: FULL_NAME,
	username: USER_NAME,
	aboutMeText:
		'You have finished building your own website. You have introduced your company and presented' +
		' your products and services. You have added propositions and promos to catch your target audience’s ' +
		'attention. You think you are doing everything “right”, but all your promotions have failed to produce growth.',
	recentPosts: RECENT_USER_POSTS,
};

interface IUserProfileScreenProps {
	navigation: NavigationScreenProp<any>;
}

interface IUserProfileScreenState {
	numberOfPhotos: number;
	numberOfLikes: number;
	numberOfFollowers: number;
	numberOfFollowing: number;
	isFollowed: boolean;
	avatarURL: any;
	fullName: string;
	username?: string;
	aboutMeText: string;
	recentPosts: IWallPostCardProp[];
}

export default class UserProfileScreen extends Component<IUserProfileScreenProps, IUserProfileScreenState> {
	private static navigationOptions = (props: IUserProfileScreenProps) => ({
		title: 'PROFILE',
		headerLeft: <View />,
		headerRight: (
			<View style={{flexDirection: 'row'}}>
				<ToggleIconButton
					selectedSource={Icons.iconHeartWhiteFilled}
					unselectedSource={Icons.iconHeartWhiteOutline}
					onPress={get(props, 'navigation.state.params.toggleFollow', undefined)}
					selected={get(props, 'navigation.state.params.isFollowed', false)}
				/>
				<ModalCloseButton navigation={props.navigation} />
			</View>
		),
	})

	public state = INITIAL_STATE;

	private lastLoadedPhotoIndex = 0;

	public componentDidMount() {
		InteractionManager.runAfterInteractions(() => {
			this.props.navigation.setParams({
				isFollowed: this.state.isFollowed,
				toggleFollow: this.toggleFollowHandler,
			});
		});
	}

	public render() {
		return (
			<UserProfileScreenComponent
				totalNumberOfPhotos={GRID_MAX_RESULTS}
				gridPageSize={GRID_PAGE_SIZE}
				numberOfPhotos={this.state.numberOfPhotos}
				numberOfLikes={this.state.numberOfLikes}
				numberOfFollowers={this.state.numberOfFollowers}
				numberOfFollowing={this.state.numberOfFollowing}
				isFollowed={this.state.isFollowed}
				avatarURL={this.state.avatarURL}
				fullName={this.state.fullName}
				username={this.state.username}
				aboutMeText={this.state.aboutMeText}
				recentPosts={this.state.recentPosts}
				loadMorePhotosHandler={() => this.loadMorePhotosHandler(GRID_PAGE_SIZE, GRID_MAX_RESULTS)}
			/>
		);
	}

	private toggleFollowHandler = () => {
		this.props.navigation.setParams({isFollowed: !this.state.isFollowed});
		this.setState({
			isFollowed: !this.state.isFollowed,
		});
	}

	private loadMorePhotosHandler = (numberOfResults: number, maxResults: number): IMediaProps[] => {
		const ret: IMediaProps[] = [];
		const endIndex = this.lastLoadedPhotoIndex + numberOfResults;
		for (let i = this.lastLoadedPhotoIndex; i < endIndex; i++) {
			if (this.lastLoadedPhotoIndex < maxResults) {
				const newMediaObject: IMediaProps = {
					id: (Math.random() * 99999).toString(),
					hash: 'QmWS5XaVeDDQAog9TcRHp7ryms4MP4a3u3gth3ZKwCvQTC',
					optimizedHash: 'QmWS5XaVeDDQAog9TcRHp7ryms4MP4a3u3gth3ZKwCvQTC',
					type: 'jpg',
					size: 123456,
				};
				ret.push(newMediaObject);
				this.lastLoadedPhotoIndex++;
			}
		}
		return ret;
	}
}
