import React, {SFC} from 'react';
import {FlatList, Text, TouchableWithoutFeedback, View} from 'react-native';
import Spinner from 'react-native-spinkit';
import {AvatarImage} from '../../components/Avatar';
import {IWallPostCardProp, WallPostCard} from '../../components/Displayers';
import {Colors, Sizes} from '../../theme';
import {IUserQuery} from '../../types/gql';
import style from './style';

interface IUserFeedScreenProps {
	avatarImage: any;
	wallPosts: IWallPostCardProp[];
	fullName: string;
	refreshing: boolean;
	loadMorePosts: () => void;
	refreshData: () => void;
	addWallPost: (data: any) => void;
	showNewWallPostPage: () => void;
	onCommentsButtonClick: (wallPostData: IWallPostCardProp) => void;
	currentUser: IUserQuery;
	isLoading: boolean;
}

const UserFeedScreen: SFC<IUserFeedScreenProps> = (props: IUserFeedScreenProps) => {
	const keyExtractor = (item: any, index: string) => index.toString(); // TODO: use an ID here

	const renderWallPosts = (data: { item: IWallPostCardProp }) => {
		const canDelete = props.currentUser.userId === data.item.user.userId;
		return (
			<View style={style.wallPostContainer}>
				{/* <WallPostCard {...data.item} onCommentsButtonClick={() => props.onCommentsButtonClick(data.item)} /> */}
				<WallPostCard
					{...data.item}
					canDelete={canDelete}
					onCommentsButtonClick={() => props.onCommentsButtonClick(data.item)}
				/>
			</View>
		);
	};

	const renderWithLoading = () => {
		if (props.isLoading) {
			return (
				<View style={style.spinnerContainer}>
					<Spinner
						isVisible={true}
						size={Sizes.smartHorizontalScale(30)}
						type={'ChasingDots'}
						color={Colors.pink}
					/>
				</View>
			);
		} else {
			return (
				<FlatList
					refreshing={props.refreshing}
					onRefresh={props.refreshData}
					data={props.wallPosts}
					keyExtractor={keyExtractor}
					renderItem={renderWallPosts}
					onEndReached={props.loadMorePosts}
					onEndReachedThreshold={0.2}
					alwaysBounceVertical={false}
					keyboardShouldPersistTaps={'handled'}
				/>
			);
		}
	};

	return (
		<View style={style.container}>
			<View style={style.shareMessageContainer}>
				<AvatarImage image={props.avatarImage} style={style.avatarImage}/>
				<TouchableWithoutFeedback onPress={props.showNewWallPostPage}>
					<View style={style.shareTextContainer}>
						<Text style={style.shareTextPlaceholder}>{'Share with your friends what you think'}</Text>
					</View>
				</TouchableWithoutFeedback>
			</View>
			{renderWithLoading()}
		</View>
	);

};

export default UserFeedScreen;
