import React from 'react';
import {Animated, Easing, Keyboard, StyleProp, View} from 'react-native';
import Spinner from 'react-native-spinkit';
import {Colors, Sizes} from '../../theme';
import style from './style';

const FADE_ANIMATION_DURATION = 700;

export enum SpinnerTypes {
	NineCubeGrid = '9CubeGrid',
	ChasingDots = 'ChasingDots',
	CircleFlip = 'CircleFlip',
	Bounce = 'Bounce',
	Wave = 'Wave',
	WanderingCubes = 'WanderingCubes',
	ThreeBounce = 'ThreeBounce',
	Circle = 'Circle',
	FadingCircle = 'FadingCircle',
	FadingCircleAlt = 'FadingCircleAlt',
}

interface IInlineLoaderProps {
	isLoading: boolean;
	animatedStyle?: any;
	spinnerType?: SpinnerTypes;
	spinnerSize?: number;
	spinnerColor?: string;
}

export interface IWithLoaderProps extends IInlineLoaderProps {
	renderWithLoader: (node: any) => any;
	isLoading: boolean;
}

export const withInlineLoader = (BaseComponent: React.ComponentType<IWithLoaderProps>, useRef = false) => {
	return class extends React.Component<IInlineLoaderProps> {
		private static defaultProps: Partial<IInlineLoaderProps> = {
			animatedStyle: style.animatedView,
			spinnerType: SpinnerTypes.NineCubeGrid,
			spinnerSize: Sizes.smartHorizontalScale(30),
			spinnerColor: Colors.pink,
		};

		public state = {
			fadeAnimation: new Animated.Value(0), // Initial value for opacity: 0
		};

		private originalRef: any = null;

		public render() {
			const updatedProps: any = {...this.props, renderWithLoader: this.renderWithLoaderHandler};
			if (useRef) {
				updatedProps.ref = (ref) => (this.originalRef = ref);
			}
			return <BaseComponent {...updatedProps} />;
		}

		public getOriginalRef = () => {
			return this.originalRef;
		}

		private renderWithLoaderHandler = (WrappedComponent: React.ComponentType) => {
			if (this.props.isLoading) {
				return (
					<View style={style.spinnerContainer}>
						<Spinner
							isVisible={true}
							size={this.props.spinnerSize}
							type={this.props.spinnerType}
							color={this.props.spinnerColor}
						/>
					</View>
				);
			} else {
				const {fadeAnimation} = this.state;
				return (
					<Animated.View
						style={[this.props.animatedStyle, {opacity: fadeAnimation}]}
						onLayout={this.animatedViewOnLayoutHandler}
					>
						{WrappedComponent}
					</Animated.View>
				);
			}
		}

		private animatedViewOnLayoutHandler = () => {
			// TODO: not sure how safe is to start the animation with onLayout? best would be with componentDidMount
			Animated.timing(this.state.fadeAnimation, {
				toValue: 1,
				easing: Easing.ease,
				duration: FADE_ANIMATION_DURATION,
			}).start();
		}
	};
};
