import {StyleSheet} from 'react-native';
import {Colors, Fonts, Sizes} from 'theme';

const styles: any = {
	container: {
		backgroundColor: Colors.wildSand,
		padding: Sizes.smartHorizontalScale(20),
	},
	heading: {
		...Fonts.centuryGothic,
		fontSize: Sizes.smartHorizontalScale(15),
		color: Colors.postFullName,
		paddingBottom: Sizes.smartVerticalScale(5),
	},
	text: {
		...Fonts.centuryGothic,
		fontSize: Sizes.smartHorizontalScale(14),
		lineHeight: Sizes.smartHorizontalScale(24),
		color: Colors.postText,
	},
};

export default StyleSheet.create(styles);
