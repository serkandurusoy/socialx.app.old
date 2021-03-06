import {StyleSheet} from 'react-native';
import {Colors, Fonts, Sizes} from 'theme';

const style: any = {
	container: {
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		backgroundColor: Colors.pink,
		borderWidth: 1,
	},
	containerNormal: {
		height: Sizes.smartVerticalScale(50),
		borderRadius: Sizes.smartVerticalScale(50) / 2,
		paddingHorizontal: Sizes.smartHorizontalScale(20),
	},
	containerSmall: {
		height: Sizes.smartVerticalScale(36),
		borderRadius: Sizes.smartVerticalScale(36) / 2,
		paddingHorizontal: Sizes.smartHorizontalScale(13),
	},
	containerLarge: {
		height: Sizes.smartVerticalScale(60),
		borderRadius: Sizes.smartVerticalScale(60) / 2,
		paddingHorizontal: Sizes.smartHorizontalScale(25),
	},
	text: {
		...Fonts.centuryGothic,
		color: Colors.white,
		textAlign: 'center',
	},
	textNormal: {
		fontSize: Sizes.smartHorizontalScale(14),
		letterSpacing: Sizes.smartHorizontalScale(2),
	},
	textSmall: {
		fontSize: Sizes.smartHorizontalScale(14),
	},
	textLarge: {
		fontSize: Sizes.smartHorizontalScale(16),
		letterSpacing: Sizes.smartHorizontalScale(2.5),
	},
	disabledButton: {
		opacity: 0.5,
	},
	loadingIndicator: {
		paddingLeft: Sizes.smartHorizontalScale(10),
	},
};

export default StyleSheet.create(style);
