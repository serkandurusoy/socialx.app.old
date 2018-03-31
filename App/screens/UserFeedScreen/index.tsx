import React, {Component} from 'react';
import {NavigationScreenProp, NavigationStackScreenOptions} from 'react-navigation';
import {Images} from '../../theme';
import {NewWallPostData} from '../NewWallPostScreen';
import UserFeedScreenComponent from './screen';

import {graphql} from 'react-apollo';
import {addMediaHoc, createPostHoc, getAllPostsHoc, getUserPostsHoc, userHoc} from '../../graphql';
import {IUserDataResponse} from '../../types/gql';

import {IBlobData} from '../../lib/ipfs';
import {addBlob} from '../../utils/ipfs';

export interface IWallPostData {
	text: string;
	imageSource?: string;
	smallAvatar: string;
	fullName: string;
	timestamp: Date;
	numberOfLikes: number;
	numberOfSuperLikes: number;
	numberOfComments: number;
	numberOfWalletCoins: number;
}

interface IUserFeedScreenProps {
	navigation: NavigationScreenProp<any>;
	data: IUserDataResponse;
	// TODO: create interface
	Posts: any;
	User: any;
	createPost: any;
	addMedia: any;
}

interface IUserFeedScreenState {
	wallPosts: IWallPostData[];
	refreshing: boolean;
}

const INITIAL_USER_POSTS: IWallPostData[] = [
	{
		text: 'text',
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
		const {data, Posts} = this.props;
		if (data.loading || Posts.loading) {
			// TODO: Loading..
			return (
				<UserFeedScreenComponent
					refreshing={this.state.refreshing}
					refreshData={this.refreshWallPosts}
					fullName={''}
					avatarImage={Images.user_avatar_placeholder}
					wallPosts={this.state.wallPosts}
					loadMorePosts={this.loadMorePostsHandler}
					addWallPost={this.addWallPostHandler}
					showNewWallPostPage={this.showNewWallPostPage}
				/>
			);
		}
		return (
			<UserFeedScreenComponent
				refreshing={this.state.refreshing}
				refreshData={this.refreshWallPosts}
				fullName={this.props.data.user.name}
				avatarImage={{uri: this.props.data.user.avatar}}
				wallPosts={this.state.wallPosts}
				loadMorePosts={this.loadMorePostsHandler}
				addWallPost={this.addWallPostHandler}
				showNewWallPostPage={this.showNewWallPostPage}
			/>
		);
	}

	private getWallPosts = () => {
		const {Posts, data} = this.props;
		const arty: any[] = [];

		if (!Posts.allPosts) {
			// TODO: replace with an empty handler
			return arty;
		}

		for (let i = 0; i < Posts.allPosts.length; i++) {
			const post = Posts.allPosts[i];
			const res = {
				text: post.text,
				smallAvatar: data.user.avatar,
				imageSource: post.Media ? 'http://10.0.2.2:8080/ipfs/' + post.Media[0].hash : undefined,
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
		this.props.navigation.navigate('NewWallPostScreen', {
			fullName: this.props.data.user.name,
			avatarImage: {uri: this.props.data.user.avatar},
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

		data.mediaObjects.forEach((media) => {
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
				console.log(ipfsResp.data);
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
			}
			// create the actual post
			await createPost({
				variables: {
					text: data.text,
					Media: mediaIds,
				},
			});

			console.log(mediaIds);

			// refresh the wall posts to append the new post
			this.refreshWallPosts();
		} catch (ex) {
			// TODO: err handle
			console.log(ex);
			console.log(mediaIds);
		}
	}

	private refreshWallPosts = async () => {
		this.setState({refreshing: true});

		await this.props.Posts.refetch();

		this.setState({refreshing: false, wallPosts: this.getWallPosts()});
	}
}

const userWrapper = userHoc(UserFeedScreen);
const allPostsWrapper = getAllPostsHoc(userWrapper);
const createPostWrapper = createPostHoc(allPostsWrapper);
const allUserPostsWrapper = getUserPostsHoc(createPostWrapper);
const addMediaWrapper = addMediaHoc(allUserPostsWrapper);

export default addMediaWrapper;
