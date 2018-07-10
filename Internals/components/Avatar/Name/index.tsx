import React from 'react';
import {Text, View} from 'react-native';

import {Colors} from 'theme';
import style from './style';

export interface IAvatarNameProps {
	fullName: string;
	username?: string;
	fullNameColor?: string;
	userNameColor?: string;
}

export const AvatarName: React.SFC<IAvatarNameProps> = ({fullName, username, fullNameColor, userNameColor}) => (
	<View>
		<Text style={[style.fullName, {color: fullNameColor}]}>{fullName}</Text>
		{username && username !== '' && <Text style={[style.username, {color: userNameColor}]}>{'@' + username}</Text>}
	</View>
);

AvatarName.defaultProps = {
	fullNameColor: Colors.userAvatarFullName,
	userNameColor: Colors.postText,
};
