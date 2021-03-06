import * as _ from 'lodash';
import React, {Component} from 'react';
import {findNodeHandle, Image, InteractionManager, Text, View} from 'react-native';
import {NavigationEventSubscription, NavigationScreenProp, NavigationStackScreenOptions} from 'react-navigation';

import {ModalCloseButton} from 'components';
import {ISimpleMediaObject, IUserQuery} from 'types';
import {IMediaLicenceData} from './data.hoc';
import MediaLicenceScreenComponent from './screen';

interface IMediaLicenceScreenNavParams {
	params: {
		mediaLicence: IMediaLicenceData;
	};
}

export interface IMediaLicenceScreenProps {
	navigation: NavigationScreenProp<IMediaLicenceScreenNavParams>;
}

interface IMediaLicenceScreenState {
	videoPaused: boolean;
}

export default class MediaLicenceScreen extends Component<IMediaLicenceScreenProps, IMediaLicenceScreenState> {
	private static navigationOptions = (props: IMediaLicenceScreenProps) => {
		const isSimilarMediaScreen = _.get(props, 'navigation.state.params.mediaLicence', undefined) !== undefined;
		const ret: Partial<NavigationStackScreenOptions> = {
			title: 'MEDIA LICENCE',
			headerRight: (
				<ModalCloseButton onClose={_.get(props, 'navigation.state.params.closeAllMediaScreens', undefined)} />
			),
		};
		if (!isSimilarMediaScreen) {
			ret.headerLeft = <View />;
		}
		return ret;
	};

	public state = {
		videoPaused: false,
	};

	private didFocusSubscription: NavigationEventSubscription | null = null;
	private didBlurSubscription: NavigationEventSubscription | null = null;

	public componentDidMount() {
		InteractionManager.runAfterInteractions(() => {
			this.props.navigation.setParams({closeAllMediaScreens: this.onCloseAllMediaScreensHandler});
			this.didFocusSubscription = this.props.navigation.addListener('didFocus', this.screenDidFocusHandler);
			this.didBlurSubscription = this.props.navigation.addListener('didBlur', this.screenDidBlurHandler);
		});
	}

	public componentWillUnmount(): void {
		if (this.didFocusSubscription) {
			this.didFocusSubscription.remove();
		}
		if (this.didBlurSubscription) {
			this.didBlurSubscription.remove();
		}
	}

	public render() {
		const navMediaData = _.get(this.props, 'navigation.state.params.mediaLicence', undefined);
		return (
			<MediaLicenceScreenComponent
				onShowPreviewFullScreen={this.onShowPreviewFullScreenHandler}
				onNavigateToUserProfileScreen={this.onNavigateToUserProfileScreenHandler}
				onNavigateToPhotoIDScreen={this.onNavigateToMediaIDScreenHandler}
				onSimilarMediaSelect={this.onSimilarMediaSelectHandler}
				onNavigateToFAQScreen={this.onNavigateToFAQScreenHandler}
				mediaData={navMediaData}
				videoPaused={this.state.videoPaused}
			/>
		);
	}

	private onShowPreviewFullScreenHandler = (newMediaObject: ISimpleMediaObject) => {
		this.props.navigation.navigate('MediaViewerScreen', {
			mediaObjects: [newMediaObject],
			startIndex: 0,
		});
	};

	private onNavigateToUserProfileScreenHandler = (mediaOwner: Partial<IUserQuery>) => {
		this.props.navigation.navigate('UserProfileScreen', {user: mediaOwner});
	};

	private onNavigateToMediaIDScreenHandler = () => {
		alert('Decide later what screen will this link');
	};

	private onCloseAllMediaScreensHandler = () => {
		this.props.navigation.popToTop();
		this.props.navigation.goBack(null);
	};

	private onSimilarMediaSelectHandler = (similarMedia: IMediaLicenceData) => {
		this.props.navigation.navigate('MediaLicenceScreen', {mediaLicence: similarMedia});
	};

	private onNavigateToFAQScreenHandler = () => {
		this.props.navigation.navigate('MediaLicenceFAQScreen');
	};

	private screenDidFocusHandler = () => {
		this.setState({
			videoPaused: false,
		});
	};

	private screenDidBlurHandler = () => {
		this.setState({
			videoPaused: true,
		});
	};
}
