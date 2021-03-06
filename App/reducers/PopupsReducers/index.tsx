import {HIDE_ACTIVITY_INDICATOR, IPopupAction, IPopupStateProps, SHOW_ACTIVITY_INDICATOR, START_APP} from 'types';

const initialState: IPopupStateProps = {
	showActivityIndicator: false,
};

export const PopupsReducers = (state = initialState, action: IPopupAction) => {
	switch (action.type) {
		case START_APP:
			return {
				...initialState,
			};
		case SHOW_ACTIVITY_INDICATOR:
			return {
				...state,
				showActivityIndicator: true,
				...action.payload,
			};
		case HIDE_ACTIVITY_INDICATOR:
			return {
				...state,
				showActivityIndicator: false,
			};
	}
	return state;
};
