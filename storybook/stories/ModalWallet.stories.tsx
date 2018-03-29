import {boolean, text, withKnobs} from '@storybook/addon-knobs/react';
import {storiesOf} from '@storybook/react-native';
import React from 'react';
import {ModalWallet} from '../../App/components/ModalWallet';
import {Colors} from '../../App/theme';
import SXBlurView from '../SXBlurView';

const containerStyle = {
	backgroundColor: Colors.white,
};

storiesOf('ModalWallet')
	.addDecorator((getStory: any) => <SXBlurView style={containerStyle}>{getStory()}</SXBlurView>)
	.addDecorator(withKnobs)
	.add('with editable props', () => {
		const visible = boolean('Visible', true);
		const value = text('Value', 'ceva');

		return <ModalWallet visible={visible} value={value} />;
	});