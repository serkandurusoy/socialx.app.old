import {boolean, text, withKnobs} from '@storybook/addon-knobs/react';
import {storiesOf} from '@storybook/react-native';
import {FriendRequest} from 'components';
import React from 'react';
import {Colors} from 'theme';
import CenterView from '../CenterView';

const containerStyle = {
	backgroundColor: Colors.white,
	paddingHorizontal: 0,
};

const friendRequestConfirmedHandler = () => {
	alert('friendRequestConfirmedHandler');
};

storiesOf('FriendRequest', module)
	.addDecorator((getStory: any) => <CenterView style={containerStyle}>{getStory()}</CenterView>)
	.addDecorator(withKnobs)
	.add('with editable props', () => {
		const avatarURL = text(
			'User avatar URL',
			'https://www.exclutips.com/wp-content/uploads/2015/08/wordpress-custom-user-avatar.png',
		);
		const fullName = text('User full name', 'Teresa Lamb');
		const username = text('Username', 'terlamb');
		return (
			<FriendRequest
				avatarURL={avatarURL}
				fullName={fullName}
				username={username}
				onRequestConfirmed={friendRequestConfirmedHandler}
			/>
		);
	});
