import {StyleSheet} from 'react-native';
import {Colors, Fonts, Sizes} from 'theme';

const styles: any = {
	container: {
		flex: 1,
		backgroundColor: Colors.white,
	},
	footer: {
		flex: 1,
		backgroundColor: Colors.wildSand,
		alignItems: 'center',
		justifyContent: 'center',
	},
	iconContainer: {
		paddingTop: Sizes.smartVerticalScale(15),
	},
	text: {
		...Fonts.centuryGothic,
		fontSize: Sizes.smartHorizontalScale(14),
		color: Colors.postFullName,
		letterSpacing: Sizes.smartHorizontalScale(2),
	},
	icon: {
		width: Sizes.smartHorizontalScale(60),
		height: Sizes.smartHorizontalScale(60),
	},
};

export default StyleSheet.create(styles);
