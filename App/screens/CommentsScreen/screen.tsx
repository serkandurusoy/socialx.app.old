import React, {Component} from 'react';
import {Platform, SafeAreaView, ScrollView, TextInput, TouchableOpacity, View} from 'react-native';
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust';
import Icon from 'react-native-vector-icons/Ionicons';
import {CommentCard} from '../../components/Displayers/WallPostCard/CommentCard';
import {OS_TYPES} from '../../constants';
import {withResizeOnKeyboardShow} from '../../hoc/ResizeOnKeyboardShow';
import {Colors, Sizes} from '../../theme';
import {IWallPostComment} from './index';
import style from './style';

interface ICommentsScreenComponentProps {
	marginBottom: number;
	comments: IWallPostComment[];
	onCommentLike: (comment: IWallPostComment) => void;
	onCommentReply: (comment: IWallPostComment, startReply: boolean) => void;
	onCommentSend: (commentText: string) => void;
}

interface ICommentsScreenComponentState {
	showSendButton: boolean;
	commentText: string;
}

class CommentsScreenComponent extends Component<ICommentsScreenComponentProps, ICommentsScreenComponentState> {
	public state = {
		showSendButton: false,
		commentText: '',
	};

	private scrollRef: ScrollView;
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
		const containerStyles = [style.container];
		if (Platform.OS === OS_TYPES.iOS) {
			containerStyles.push({marginBottom: this.props.marginBottom});
		}
		return (
			<SafeAreaView style={containerStyles}>
				<ScrollView
					style={style.commentsList}
					keyboardShouldPersistTaps={'handled'}
					ref={(ref: ScrollView) => (this.scrollRef = ref)}
					onLayout={() => this.scrollRef.scrollToEnd()}
				>
					{this.renderComments()}
				</ScrollView>
				<View style={style.inputContainer}>
					<TextInput
						ref={(ref: TextInput) => (this.textInput = ref)}
						onChangeText={this.commentTextChangedHandler}
						style={style.textInput}
						placeholder={'Write a comment...'}
						autoFocus={true}
						multiline={true}
						autoCorrect={false}
						underlineColorAndroid={Colors.transparent}
						autoCapitalize='none'
					/>
					{this.renderSendButton()}
				</View>
			</SafeAreaView>
		);
	}

	private renderSendButton = () => {
		if (this.state.showSendButton) {
			return (
				<TouchableOpacity onPress={this.sendCommentHandler} style={style.sendButton}>
					<Icon name={'md-send'} size={Sizes.smartHorizontalScale(30)} color={Colors.fuchsiaBlue} />
				</TouchableOpacity>
			);
		}
		return null;
	}

	private renderComments = () => {
		const ret: any = [];
		this.props.comments.forEach((comment, index) => {
			ret.push(
				<CommentCard
					key={index}
					comment={comment}
					onCommentLike={() => this.props.onCommentLike(comment)}
					onCommentReply={(startReply: boolean) => this.props.onCommentReply(comment, startReply)}
				/>,
			);
		});
		return ret;
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

	private commentTextChangedHandler = (value: string) => {
		this.setState({
			commentText: value,
			showSendButton: value !== '',
		});
	}
}

export default withResizeOnKeyboardShow(CommentsScreenComponent);