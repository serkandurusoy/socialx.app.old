import {SearchFilterButton, SearchResultEntry} from 'components';
import React, {Component} from 'react';
import {Image, Keyboard, Text, TouchableOpacity, View} from 'react-native';
import {connect} from 'react-redux';
import {Icons} from 'theme/';
import {IAppUIStateProps, SearchResultData} from 'types';
import {SearchFilterValues} from './index';
import style from './style';

interface ISearchScreenComponentProps extends IAppUIStateProps {
	searchTerm: string;
	searchResults: SearchResultData[];
	selectedFilter: SearchFilterValues;
	setNewFilter: (value: SearchFilterValues) => void;
	addFriendHandler: (value: string) => void;
	createGroupHandler: () => void;
	onSearchResultSelect: (result: SearchResultData) => void;
	addFriendsRequestsInProgress: any;
}

interface ISearchScreenComponentState {
	paddingBottom: number;
}

class SearchScreenComponent extends Component<ISearchScreenComponentProps, ISearchScreenComponentState> {
	public state = {
		paddingBottom: 0,
	};

	private keyboardDidShowListener: any;
	private keyboardDidHideListener: any;

	public componentDidMount() {
		this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
		this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
	}

	public componentWillUnmount() {
		this.keyboardDidShowListener.remove();
		this.keyboardDidHideListener.remove();
	}

	public render() {
		return <View style={[style.container, {marginBottom: this.state.paddingBottom}]}>{this.conditionalRender()}</View>;
	}

	private keyboardDidShow = (event: any) => {
		this.setState({
			paddingBottom: event.endCoordinates.height - this.props.tabBarBottomHeight,
		});
	}

	private keyboardDidHide = () => {
		this.setState({
			paddingBottom: 0,
		});
	}

	private conditionalRender = () => {
		let ret = null;
		if (this.props.searchTerm === '') {
			ret = this.renderEmptyState();
		} else {
			if (this.props.searchResults.length === 0) {
				ret = this.renderNoResults();
			} else {
				ret = this.renderSearchResults();
			}
		}
		return ret;
	}

	private renderEmptyState = () => {
		return (
			<View style={style.emptyContainer}>
				<Image source={Icons.searchTabStartSearch} resizeMode={'contain'} style={style.startSearchIcon} />
				<Text style={style.startSearchText}>{'Start searching now'}</Text>
			</View>
		);
	}

	private renderNoResults = () => {
		return (
			<View style={style.noResultsContainer}>
				{this.renderFilterButtons()}
				{this.renderPeopleNoResults()}
				{this.renderCreateNewGroup()}
			</View>
		);
	}

	private renderPeopleNoResults = () => {
		if (this.props.selectedFilter === SearchFilterValues.People) {
			return (
				<View style={style.noResultsCenterAlign}>
					<Text>{'No results found!'}</Text>
				</View>
			);
		}
		return null;
	}

	private renderSearchResults = () => {
		return (
			<View style={style.resultsContainer}>
				{this.renderFilterButtons()}
				{this.renderPeopleResults()}
				{this.renderCreateNewGroup()}
			</View>
		);
	}

	private renderPeopleResults = () => {
		const ret = [];
		for (let i = 0; i < this.props.searchResults.length; i++) {
			const searchResult = this.props.searchResults[i];
			const isLoading = this.props.addFriendsRequestsInProgress.hasOwnProperty(searchResult.id);
			ret.push(
				<SearchResultEntry
					key={i}
					{...searchResult}
					loading={isLoading}
					addFriendHandler={() => this.props.addFriendHandler(searchResult.id)}
					onEntrySelect={() => this.props.onSearchResultSelect(searchResult)}
				/>,
			);
		}
		return ret;
	}

	private renderFilterButtons = () => {
		return (
			<View style={style.filterButtonsContainer}>
				<SearchFilterButton
					text={'People'}
					selected={this.props.selectedFilter === SearchFilterValues.People}
					onPress={() => this.props.setNewFilter(SearchFilterValues.People)}
				/>
				{/*<SearchFilterButton*/}
				{/*text={'Groups'}*/}
				{/*selected={this.props.selectedFilter === SearchFilterValues.Groups}*/}
				{/*onPress={() => this.props.setNewFilter(SearchFilterValues.Groups)}*/}
				{/*/>*/}
			</View>
		);
	}

	private renderCreateNewGroup = () => {
		if (this.props.selectedFilter === SearchFilterValues.Groups) {
			return (
				<View style={style.createGroupContainer}>
					<Image source={Icons.searchTabCreateGroup} resizeMode={'contain'} style={style.createGroupIcon} />
					<TouchableOpacity onPress={this.props.createGroupHandler}>
						<Text style={style.createGroupText}>{'Create a group'}</Text>
					</TouchableOpacity>
				</View>
			);
		}
		return null;
	}
}

const mapStateToProps: any = (state: any): IAppUIStateProps => ({
	...state.appUI,
});

export default connect<any>(mapStateToProps)(SearchScreenComponent);
