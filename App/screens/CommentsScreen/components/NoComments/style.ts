import {StyleSheet} from 'react-native';
import {Colors, Fonts, Sizes} from 'theme';

const style: any = {
	noCommentsContainer: {
		paddingTop: Sizes.smartVerticalScale(30),
		alignItems: 'center',
	},
	noCommentsText: {
		...Fonts.centuryGothic,
		fontSize: Sizes.smartHorizontalScale(16),
		color: Colors.postText,
		paddingTop: Sizes.smartVerticalScale(20),
		textAlign: 'center',
		paddingHorizontal: Sizes.smartHorizontalScale(20),
	},
};

export default StyleSheet.create(style);
