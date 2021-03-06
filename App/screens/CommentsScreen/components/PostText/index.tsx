import React from 'react';
import {Text, View} from 'react-native';

import styles from './style';

interface IPostTextProps {
	text: string;
}

export const PostText: React.SFC<IPostTextProps> = ({text}) => (
	<View style={styles.container}>
		<Text style={styles.text}>{text}</Text>
	</View>
);
