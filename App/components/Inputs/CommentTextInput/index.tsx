import React, {Component} from 'react';
import {Platform, Switch, Text, TextInput, TouchableOpacity, View} from 'react-native';
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust';
import Icon from 'react-native-vector-icons/Ionicons';
import {OS_TYPES} from '../../../constants';
import {Colors, Sizes} from '../../../theme';
import style from './style';

export interface ICommentTextInputProps {
	placeholder: string;
	onCommentSend: (commentText: string) => void;
}

export class CommentTextInput extends Component<ICommentTextInputProps> {
	public state = {
		showSendButton: false,
		commentText: '',
	};

	private textInput: TextInput;

	public componentDidMount(): void {
		if (Platform.OS === OS_TYPES.Android) {
			AndroidKeyboardAdjust.setAdjustResize();
		}
	}

	public componentWillUnmount(): void {
		if (Platform.OS === OS_TYPES.Android) {
			AndroidKeyboardAdjust.setAdjustPan();
		}
	}

	public render() {
		return (
			<View style={style.inputContainer}>
				<TextInput
					ref={(ref: TextInput) => (this.textInput = ref)}
					onChangeText={this.commentTextChangedHandler}
					style={style.textInput}
					placeholder={this.props.placeholder}
					autoFocus={true}
					multiline={true}
					autoCorrect={false}
					underlineColorAndroid={Colors.transparent}
					autoCapitalize='none'
				/>
				{this.renderSendButton()}
			</View>
		);
	}

	private renderSendButton = () => {
		if (this.state.showSendButton) {
			return (
				<View style={style.sendButtonContainer}>
					<TouchableOpacity onPress={this.sendCommentHandler} style={style.sendButton}>
						<Icon name={'md-send'} size={Sizes.smartHorizontalScale(30)} color={Colors.fuchsiaBlue} />
					</TouchableOpacity>
				</View>
			);
		}
		return null;
	}

	private commentTextChangedHandler = (value: string) => {
		this.setState({
			commentText: value,
			showSendButton: value !== '',
		});
	}

	private sendCommentHandler = () => {
		this.props.onCommentSend(this.state.commentText);
		this.setState({
			commentText: '',
			showSendButton: false,
		});
		this.textInput.blur();
		this.textInput.clear(); // not working on iOS?! ..very strange
	}
}