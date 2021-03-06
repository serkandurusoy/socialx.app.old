import React, {RefObject} from 'react';
import {findNodeHandle, View} from 'react-native';

import {ModalTagFriends} from 'components';
import {FriendsSearchResult} from 'types';
import {SEARCH_RESULTS_TAG_FRIENDS} from 'utilities';

interface IModalForAddFriendsProps {
	addedFriends: FriendsSearchResult[];
	showAddFriendsModal: () => void;
}

interface IWithModalForAddFriendsState {
	modalVisible: boolean;
	blurViewRef: any;
	friendsSearchResults: FriendsSearchResult[];
	taggedFriendsInModal: FriendsSearchResult[];
	taggedFriends: FriendsSearchResult[];
}

interface IWithModalForAddFriendsProps {
	children(props: IModalForAddFriendsProps): JSX.Element;
}

export class WithModalForAddFriends extends React.Component<
	IWithModalForAddFriendsProps,
	IWithModalForAddFriendsState
> {
	public state = {
		modalVisible: false,
		blurViewRef: null,
		friendsSearchResults: [],
		taggedFriendsInModal: [],
		taggedFriends: [],
	};

	private baseScreen: RefObject<any> = React.createRef();

	public componentDidMount() {
		const blurViewHandle = findNodeHandle(this.baseScreen.current);
		this.setState({blurViewRef: blurViewHandle});
	}

	public render() {
		const {modalVisible, blurViewRef, friendsSearchResults, taggedFriends, taggedFriendsInModal} = this.state;
		return (
			<View style={{flex: 1}}>
				<ModalTagFriends
					visible={modalVisible}
					doneHandler={this.handleTagFriendsEditFinished}
					cancelHandler={this.closeTagFriendsModal}
					blurViewRef={blurViewRef}
					onSearchUpdated={this.friendsSearchUpdatedHandler}
					searchResults={friendsSearchResults}
					selectTagUserInModal={this.tagFriendHandler}
					selectedUsers={taggedFriendsInModal}
				/>
				<View ref={this.baseScreen} style={{flex: 1}}>
					{this.props.children({
						addedFriends: taggedFriends,
						showAddFriendsModal: this.showTagFriendsModal,
					})}
				</View>
			</View>
		);
	}

	private handleTagFriendsEditFinished = () => {
		this.setState({
			taggedFriends: this.state.taggedFriendsInModal,
			modalVisible: false,
		});
	};

	private showTagFriendsModal = () => {
		this.setState({
			taggedFriendsInModal: this.state.taggedFriends,
			modalVisible: true,
		});
	};

	private closeTagFriendsModal = () => {
		this.setState({
			modalVisible: false,
		});
	};

	private tagFriendHandler = (friend: FriendsSearchResult) => {
		this.setState({taggedFriendsInModal: [...this.state.taggedFriendsInModal, friend]});
	};

	private friendsSearchUpdatedHandler = (term: string) => {
		// TODO: make real search here
		let friendsSearchResults: FriendsSearchResult[] = [];
		if (term.length > 3 && term.length < 8) {
			friendsSearchResults = SEARCH_RESULTS_TAG_FRIENDS;
		}
		this.setState({friendsSearchResults});
	};
}
