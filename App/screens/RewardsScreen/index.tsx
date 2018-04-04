import moment from 'moment';
import React, {Component} from 'react';
import {NavigationScreenProp} from 'react-navigation';
import {RewardsScreenComponent} from './screen';

export enum PieChartSections {
	REFERRALS = 'RFLS',
	POSTS = 'PST',
	BOUNTIES = 'BNTS',
}

interface StaticListDataItem {
	title: string;
	badge: PieChartSections;
}

export interface ChartListDataItem extends StaticListDataItem {
	percentValue: number;
}

export interface IDailyBarChartData {
	value: number;
	date: Date;
}

export interface IMonthlyBarChartData {
	value: number;
	monthShort: string;
}

const ChartListData: StaticListDataItem[] = [
	{
		title: 'Referrals',
		badge: PieChartSections.REFERRALS,
	},
	{
		title: 'Posts',
		badge: PieChartSections.POSTS,
	},
	{
		title: 'Bounties',
		badge: PieChartSections.BOUNTIES,
	},
];

// this should come from the outside as props!
// keys here are associated with 'badge' key in ChartListData
const PIE_CHART_VALUES: any = {};
PIE_CHART_VALUES[PieChartSections.REFERRALS] = 22;
PIE_CHART_VALUES[PieChartSections.POSTS] = 35;
PIE_CHART_VALUES[PieChartSections.BOUNTIES] = 43;

const getRandomValuesForCurrentYear = () => {
	const ret: IDailyBarChartData[] = [];
	const indexDate = moment().startOf('year');
	const today = moment();
	while (indexDate < today) {
		const randomValue = Math.round(Math.random() * 100);
		ret.push({
			value: randomValue,
			date: indexDate.toDate(),
		});
		indexDate.add(1, 'days');
	}
	return ret;
};

const getRandomMonthlyValuesForLastTwelveMonths = () => {
	const ret: IMonthlyBarChartData[] = [];
	const indexDate = moment().add(-11, 'months');
	const today = moment();
	while (indexDate < today) {
		const randomValue = Math.round(Math.random() * 100);
		ret.push({
			value: randomValue,
			monthShort: indexDate.format('MMM'),
		});
		indexDate.add(1, 'month');
	}
	return ret;
};

interface RewardsScreenProps {
	navigation: NavigationScreenProp<any>;
}

interface IRewardsScreenState {
	pieChartData: ChartListDataItem[];
	totalAmount: number;
}

export class RewardsScreen extends Component<RewardsScreenProps, IRewardsScreenState> {
	private static navigationOptions = {
		title: 'REWARDS',
	};

	constructor(props: RewardsScreenProps) {
		super(props);
		this.state = {
			pieChartData: this.getPieChartData(),
			totalAmount: 8.239,
		};
	}

	public render() {
		return (
			<RewardsScreenComponent
				pieChartData={this.state.pieChartData}
				backToWallet={this.backToWalletHandler}
				totalAmount={this.state.totalAmount}
				dailySeries={getRandomValuesForCurrentYear()}
				monthlySeries={getRandomMonthlyValuesForLastTwelveMonths()}
			/>
		);
	}

	private getPieChartData = () => {
		const ret: ChartListDataItem[] = [];
		ChartListData.forEach((listItem) => {
			ret.push({
				...listItem,
				percentValue: PIE_CHART_VALUES[listItem.badge],
			});
		});
		return ret;
	}

	private backToWalletHandler = () => {
		alert('backToWalletHandler');
	}
}