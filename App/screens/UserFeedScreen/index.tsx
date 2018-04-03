import React, {Component} from 'react';
import {View} from 'react-native';
import {NavigationScreenProp, NavigationStackScreenOptions} from 'react-navigation';
import {IWallPostCardProp} from '../../components/WallPostCard';
import {Images} from '../../theme';
import {MediaObject, NewWallPostData} from '../NewWallPostScreen';
import UserFeedScreenComponent from './screen';

import {graphql} from 'react-apollo';
import {addMediaHoc, createPostHoc, getAllPostsHoc, getUserPostsHoc, userHoc} from '../../graphql';
import {IAllPostsDataResponse, IPostsProps, IUserDataResponse} from '../../types/gql';

import {IBlobData} from '../../lib/ipfs';
import {addBlob} from '../../utils/ipfs';

import {IMediaRec} from './types';

interface IUserFeedScreenProps {
	navigation: NavigationScreenProp<any>;
	data: IUserDataResponse;
	// TODO: create interface
	Posts: IAllPostsDataResponse;
	User: IUserDataResponse;
	createPost: any;
	addMedia: any;
}

interface IUserFeedScreenState {
	wallPosts: IWallPostCardProp[];
	refreshing: boolean;
}

const INITIAL_USER_POSTS: IWallPostCardProp[] = [
	{
		title: 'Post title here',
		text: 'Sample existing post text',
		location: 'Tower Bridge, London',
		smallAvatar: 'https://placeimg.com/110/110/people',
		fullName: 'Ionut Movila',
		timestamp: new Date(),
		numberOfLikes: 0,
		numberOfSuperLikes: 0,
		numberOfComments: 0,
		numberOfWalletCoins: 0,
	},
];

class UserFeedScreen extends Component<IUserFeedScreenProps, IUserFeedScreenState> {
	private static navigationOptions: Partial<NavigationStackScreenOptions> = {
		title: 'FEED',
	};

	public state = {
		wallPosts: INITIAL_USER_POSTS,
		refreshing: false,
	};

	public componentWillReceiveProps(nextProps: IUserFeedScreenProps) {
		const {data, Posts} = nextProps;
		if (data.loading || Posts.loading) {
			return;
		}
		this.setState({wallPosts: this.getWallPosts()});
	}

	public render() {
		const {Posts, data} = this.props;
		if (data.loading || Posts.loading) {
			// TODO: content Loading..
			return <View />;
		}
		// TODO: make better
		const avatarUri = data.user.avatar
			? {uri: 'http://testnet.socialx.network:8080/ipfs/' + data.user.avatar.hash}
			: Images.user_avatar_placeholder;

		return (
			<UserFeedScreenComponent
				refreshing={this.state.refreshing}
				refreshData={this.refreshWallPosts}
				fullName={this.props.data.user.name}
				avatarImage={avatarUri}
				wallPosts={this.state.wallPosts}
				loadMorePosts={this.loadMorePostsHandler}
				addWallPost={this.addWallPostHandler}
				showNewWallPostPage={this.showNewWallPostPage}
			/>
		);
	}

	private getWallPosts = () => {
		const {data, Posts} = this.props;
		const arty: any[] = [];
		for (let i = 0; i < Posts.allPosts.length; i++) {
			const post = Posts.allPosts[i];
			const media = post.Media
				? post.Media.length > 0 ? 'http://testnet.socialx.network:8080/ipfs/' + post.Media[0].hash : undefined
				: undefined;
			const res = {
				text: post.text,
				smallAvatar: post.owner.avatar
					? 'http://testnet.socialx.network:8080/ipfs/' + post.owner.avatar.hash
					: Images.user_avatar_placeholder,
				imageSource: media,
				fullName: data.user.name,
				timestamp: new Date(post.createdAt),
				numberOfLikes: 0,
				numberOfSuperLikes: 0,
				numberOfComments: 0,
				numberOfWalletCoins: 0,
			};
			arty.push(res);
		}

		return arty;
	}

	private showNewWallPostPage = () => {
		const avatarUri = this.props.data.user.avatar
			? {uri: 'http://testnet.socialx.network:8080/ipfs/' + this.props.data.user.avatar.hash}
			: Images.user_avatar_placeholder;
		this.props.navigation.navigate('NewWallPostScreen', {
			fullName: this.props.data.user.name,
			avatarImage: avatarUri,
			postCreate: this.addWallPostHandler,
		});
	}

	private loadMorePostsHandler = () => {
		// TODO
		// this.setState({
		// 	wallPosts: this.state.wallPosts.concat(INITIAL_USER_POSTS),
		// });
	}

	private addWallPostHandler = async (data: NewWallPostData) => {
		const {createPost, addMedia} = this.props;
		const blobfiles: IBlobData[] = [] as IBlobData[];
		const ipfsHashes: any = [];
		const mediaIds: string[] = [];
		let multiflag = false;
		data.mediaObjects.forEach((media: MediaObject) => {
			blobfiles.push({filename: media.name, data: media.content, name: media.name.split('.')[0]});
		});
		try {
			// check if user entered any text
			if (data.text.length < 5) {
				// TODO: add some warning
				return;
			}
			// there is media
			if (data.mediaObjects.length > 0) {
				// add files to ipfs
				let ipfsResp = await addBlob(blobfiles);
				ipfsResp = ipfsResp.data.split('\n');
				// parse all media files from ipfs
				if (ipfsResp.length > 2) {
					multiflag = true;
					ipfsResp.forEach((resp: string) => {
						if (resp !== '') {
							const parsed = JSON.parse(resp);
							ipfsHashes.push({size: parsed.Size, hash: parsed.Hash, type: parsed.Name.split('.')[1]});
						}
					});
				} else {
					const parsed = JSON.parse(ipfsResp[0]);
					ipfsHashes.push({size: parsed.Size, hash: parsed.Hash, type: parsed.Name.split('.')[1]});
				}
				// add media file/s to appsync
				if (multiflag) {
					for (let i = 0; i < ipfsHashes.length; i++) {
						const ipfsData = ipfsHashes[i];
						const resp = await addMedia({
							variables: {hash: ipfsData.hash, type: ipfsData.type, size: parseInt(ipfsData.size, undefined)},
						});
						mediaIds.push(resp.data.addMedia.id);
					}
				} else {
					const ipfsData = ipfsHashes[0];
					const resp = await addMedia({
						variables: {hash: ipfsData.hash, type: ipfsData.type, size: parseInt(ipfsData.size, undefined)},
					});
					mediaIds.push(resp.data.addMedia.id);
				}

				// create the post with media
				await createPost({
					variables: {
						text: data.text,
						Media: mediaIds,
					},
				});
			} else {
				// create the post without media
				await createPost({
					variables: {
						text: data.text,
					},
				});
			}

			// refresh the wall posts to append the new post
			this.refreshWallPosts();
		} catch (ex) {
			// TODO: err handle
			console.log(ex);
		}
	}

	private refreshWallPosts = async () => {
		const {Posts} = this.props;

		this.setState({refreshing: true});
		await Posts.refetch();
		this.setState({refreshing: false, wallPosts: this.getWallPosts()});
	}
}

const userWrapper = userHoc(UserFeedScreen);
const allPostsWrapper = getAllPostsHoc(userWrapper);
const createPostWrapper = createPostHoc(allPostsWrapper);
const addMediaWrapper = addMediaHoc(createPostWrapper);

export default addMediaWrapper;
