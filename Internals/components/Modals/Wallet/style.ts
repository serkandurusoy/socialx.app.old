import {StyleSheet} from 'react-native';
import {Colors, Fonts, Sizes} from 'theme';

const SOCX_ICON_SIZE = Sizes.smartHorizontalScale(60);

const style: any = {
	container: {
		flex: 1,
		margin: 0,
	},
	blurView: {
		position: 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
	},
	keyboardView: {
		flex: 1,
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
	},
	boxContainer: {
		justifyContent: 'space-around',
		width: Sizes.smartHorizontalScale(350),
		marginHorizontal: Sizes.smartHorizontalScale(12),
		marginVertical: Sizes.smartHorizontalScale(10),
		backgroundColor: Colors.white,
		borderRadius: Sizes.smartVerticalScale(8),
	},
	closeModalButtonContainer: {
		position: 'absolute',
		right: 0,
		zIndex: 1,
		paddingVertical: Sizes.smartHorizontalScale(10),
		paddingHorizontal: Sizes.smartHorizontalScale(10),
	},
	topContainer: {
		alignItems: 'center',
	},
	topText: {
		...Fonts.centuryGothic,
		fontSize: Sizes.smartHorizontalScale(24),
		color: Colors.postFullName,
		paddingBottom: Sizes.smartVerticalScale(36),
	},
	socialXIconContainer: {
		paddingVertical: Sizes.smartVerticalScale(10),
	},
	socialXIcon: {
		height: SOCX_ICON_SIZE,
		width: SOCX_ICON_SIZE,
	},
	containerSelected: {
		backgroundColor: Colors.catskillWhite,
	},
	isSent: {
		width: Sizes.smartHorizontalScale(23),
		height: Sizes.smartHorizontalScale(23),
		alignSelf: 'center',
	},
	sendButtonContainer: {
		marginHorizontal: Sizes.smartHorizontalScale(15),
		marginBottom: Sizes.smartHorizontalScale(10),
		marginTop: Sizes.smartHorizontalScale(10),
	},
};

export default StyleSheet.create(style);
