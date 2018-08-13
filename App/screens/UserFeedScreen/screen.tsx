import {IWallPostCardProp, SuggestionsCarousel, WallPostCard} from 'components';
import {IWithLoaderProps, withInlineLoader} from 'hoc/InlineLoader';
import React, {Component, RefObject} from 'react';
import {ActivityIndicator, Animated, FlatList, Text, TouchableWithoutFeedback, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {AnimatedValue, NavigationScreenProp} from 'react-navigation';
import {Colors, Sizes} from 'theme';
import {IMediaProps, IUserQuery} from 'types';

import style, {SHARE_SECTION_BORDER_WIDTH, SHARE_SECTION_HEIGHT} from './style';

interface IUserFeedScreenProps extends IWithLoaderProps {
	avatarImage: any;
	wallPosts: IWallPostCardProp[];
	refreshing: boolean;
	loadMorePosts: () => void;
	refreshData: () => void;
	addWallPost: (data: any) => void;
	showNewWallPostPage: () => void;
	onMediaPress: (index: any, medias: IMediaProps[]) => void;
	onCommentPress: (postId: any, owner: any, startComment: boolean, postData: object) => void;
	currentUser: IUserQuery;
	noPosts: boolean;
	shareSectionPlaceholder: string | null;
	onLikePress: (likedByMe: boolean, postId: string) => Promise<any>;
	onPostDeletePress: any;
	onUserPress: any;
	loadingMore: Promise<boolean>;
	hasMore: boolean;
	onAddCommentPress: (scrollRef: any, scrollYOffset: number, cardHeight: number) => void;
	listLoading: boolean;
	navigation: NavigationScreenProp<any>;
}

interface IUserFeedScreenState {
	fetchingMore: boolean;
}

const FeedWithNoPosts: React.SFC = () => (
	<View style={style.noPostsContainer}>
		<Icon name={'md-film'} size={Sizes.smartHorizontalScale(120)} color={Colors.geyser} />
		<Text style={style.noPostsText}>{'Your feed is empty. Start adding your first post!'}</Text>
	</View>
);

const LoadingFooter: React.SFC<any> = ({hasMore}) => {
	if (hasMore) {
		return (
			<View style={style.bottomLoadingContainer}>
				<ActivityIndicator size={'large'} />
			</View>
		);
	}
	return null;
};

const ShareSection: React.SFC<any> = ({
	sharePlaceholder,
	avatarImage,
	showNewWallPostPage,
	height,
	opacity,
	border,
	avatarOpacity,
}) => {
	const containerStyle = [style.shareMessageContainer, {height, opacity, borderBottomWidth: border}];
	const avatarStyle = [style.avatarImage, {opacity: avatarOpacity}];

	return (
		<Animated.View style={containerStyle}>
			<Animated.Image source={avatarImage} resizeMode="cover" style={avatarStyle} />
			<TouchableWithoutFeedback onPress={showNewWallPostPage}>
				<View style={style.shareTextContainer}>
					<Text style={style.shareTextPlaceholder}>{sharePlaceholder}</Text>
				</View>
			</TouchableWithoutFeedback>
		</Animated.View>
	);
};

class UserFeedScreen extends Component<IUserFeedScreenProps, IUserFeedScreenState> {
	public state = {
		fetchingMore: false,
	};

	private readonly scrollRef: RefObject<FlatList<IWallPostCardProp>> = React.createRef();
	private scrollY: AnimatedValue = new Animated.Value(0);

	public render() {
		const {avatarImage, showNewWallPostPage, shareSectionPlaceholder, noPosts} = this.props;

		const shareSectionHeightInterpolation = this.scrollY.interpolate({
			inputRange: [0, SHARE_SECTION_HEIGHT],
			outputRange: [SHARE_SECTION_HEIGHT, 0],
			extrapolate: 'clamp',
		});

		const shareSectionOpacityInterpolation = this.scrollY.interpolate({
			inputRange: [0, SHARE_SECTION_HEIGHT],
			outputRange: [1, 0],
			extrapolate: 'clamp',
		});

		const shareSectionBorderInterpolation = this.scrollY.interpolate({
			inputRange: [0, SHARE_SECTION_HEIGHT],
			outputRange: [SHARE_SECTION_BORDER_WIDTH, 0],
			extrapolate: 'clamp',
		});

		const shareSectionAvatarOpacityInterpolation = this.scrollY.interpolate({
			inputRange: [0, SHARE_SECTION_HEIGHT],
			outputRange: [1, 0],
			extrapolate: 'clamp',
		});

		return (
			<View style={style.container}>
				{shareSectionPlaceholder && (
					<ShareSection
						avatarImage={avatarImage}
						showNewWallPostPage={showNewWallPostPage}
						sharePlaceholder={shareSectionPlaceholder}
						height={shareSectionHeightInterpolation}
						opacity={shareSectionOpacityInterpolation}
						border={shareSectionBorderInterpolation}
						avatarOpacity={shareSectionAvatarOpacityInterpolation}
					/>
				)}
				{noPosts ? (
					<FeedWithNoPosts />
				) : (
					<FlatList
						ref={this.scrollRef}
						windowSize={10}
						refreshing={this.props.refreshing}
						onRefresh={this.props.refreshData}
						data={this.props.wallPosts}
						keyExtractor={this.keyExtractor}
						renderItem={this.renderWallPosts}
						onEndReached={async () => {
							if (!this.props.isLoading && this.props.hasMore && !this.state.fetchingMore) {
								this.setState({fetchingMore: true}, async () => {
									await this.props.loadMorePosts();
									this.setState({fetchingMore: false});
								});
							}
						}}
						onEndReachedThreshold={0.5}
						alwaysBounceVertical={false}
						keyboardShouldPersistTaps={'handled'}
						ListFooterComponent={<LoadingFooter hasMore={this.props.hasMore} />}
						onScrollToIndexFailed={() => {}}
						onScroll={this.onScrollHandler}
						scrollEventThrottle={16}
					/>
				)}
			</View>
		);
	}

	private keyExtractor = (item: IWallPostCardProp, index: number) => item.id;

	private renderWallPosts = (data: {item: IWallPostCardProp; index: number}) => {
		if (data.item.suggested) {
			return <SuggestionsCarousel items={data.item.suggested} />;
		}

		const canDelete = this.props.currentUser.userId === data.item.owner.userId;
		const likedByMe = !!data.item.likes.find((like: IUserQuery) => like.userId === this.props.currentUser.userId);

		return (
			<View style={style.wallPostContainer}>
				<WallPostCard
					{...data.item}
					canDelete={canDelete}
					likedByMe={likedByMe}
					listLoading={this.props.listLoading}
					currentUser={this.props.currentUser}
					onCommentClick={(startComment: boolean) =>
						this.props.onCommentPress(data.item.id, data.item.owner.userId, startComment, data.item)
					}
					onImageClick={(index: number) => this.props.onMediaPress(index, data.item.media)}
					onDeleteClick={() => this.props.onPostDeletePress(data.item.id)}
					onLikeButtonClick={() => this.props.onLikePress(likedByMe, data.item.id)}
					onUserClick={(userId: string) => this.props.onUserPress(userId)}
					onAddComment={(cardHeight: number) => this.onAddCommentPressHandler(data.index, cardHeight)}
				/>
			</View>
		);
	};

	private onAddCommentPressHandler = (index: number, cardHeight: number) => {
		this.props.onAddCommentPress(this.scrollRef, index, cardHeight);
	};

	private onScrollHandler = (event: any) => {
		this.scrollY.setValue(event.nativeEvent.contentOffset.y);
	};
}

export default withInlineLoader(UserFeedScreen);
