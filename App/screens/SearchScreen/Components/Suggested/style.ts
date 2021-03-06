import {StyleSheet} from 'react-native';
import {Colors, Fonts, Sizes} from 'theme/';

const AVATAR_SIZE = Sizes.smartHorizontalScale(50);

const styles: any = {
	container: {
		height: '100%',
		backgroundColor: Colors.white,
		paddingHorizontal: Sizes.smartHorizontalScale(25),
		paddingTop: Sizes.smartVerticalScale(16),
	},
	title: {
		...Fonts.centuryGothicBold,
		fontSize: Sizes.smartHorizontalScale(20),
		paddingBottom: Sizes.smartVerticalScale(16),
	},
	card: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: Sizes.smartVerticalScale(10),
	},
	avatar: {
		width: AVATAR_SIZE,
		height: AVATAR_SIZE,
		borderRadius: AVATAR_SIZE / 2,
	},
	textContainer: {
		paddingLeft: Sizes.smartHorizontalScale(10),
		justifyContent: 'center',
	},
	name: {
		...Fonts.centuryGothic,
		fontSize: Sizes.smartHorizontalScale(18),
	},
	text: {
		...Fonts.centuryGothic,
		fontSize: Sizes.smartHorizontalScale(14),
		color: Colors.grayText,
	},
	iconContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'flex-end',
	},
	icon: {
		fontSize: Sizes.smartHorizontalScale(30),
		color: Colors.pink,
	},
};

export default StyleSheet.create(styles);
