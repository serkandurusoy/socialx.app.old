import gql from 'graphql-tag';
import {graphql, QueryProps} from 'react-apollo';

import {IAllPostsDataResponse} from 'types';

const likePost = gql`
	mutation likePost($postId: ID!) {
		likePost(postId: $postId) {
			id
			likes {
				userId
				username
			}
		}
	}
`;

const removeLikePost = gql`
	mutation removelikePost($postId: ID!) {
		removelikePost(postId: $postId) {
			id
			likes {
				userId
				username
			}
		}
	}
`;

const deletePostMut = gql`
	mutation deletePost($postId: ID!) {
		deletePost(postId: $postId) {
			id
		}
	}
`;

const getPublicPostsQ = gql`
	query getPublicPosts($next: String) {
		getPublicPosts(next: $next) {
			Items {
				id
				text
				createdAt
				location
				likes {
					userId
				}
				Media {
					id
					hash
					optimizedHash
					type
				}
				owner {
					userId
					username
					name
					avatar {
						id
						hash
					}
				}
				comments {
					id
					comments {
						id
					}
				}
			}
			nextToken
		}
	}
`;

export const likePostHoc = (comp: any) => graphql(likePost, {name: 'likePost'})(comp);
export const removeLikePostHoc = (comp: any) => graphql(removeLikePost, {name: 'removeLikePost'})(comp);

export const deleteOwnPostHoc = (comp: any) => graphql(deletePostMut, {name: 'deletePost'})(comp);

export const getPublicPostsHoc = (comp: any) =>
	graphql(getPublicPostsQ, {
		name: 'Posts',
		props({Posts: {loading, getPublicPosts, fetchMore, refetch}}) {
			const {nextToken} = getPublicPosts;
			return {
				loading,
				Posts: getPublicPosts,
				refresh: async () => {
					await refetch();
				},
				loadMore: fetchMore({
					variables: {next: nextToken},
					updateQuery: (previousResult, { fetchMoreResult }) => {
						const previousEntry = previousResult.entry;
						const newPosts = fetchMoreResult.moreComments.Items;
						const newNext = fetchMoreResult.moreComments.nextToken;
						return {
							nextToken: newNext,
							entry: {
								Items: [ ...newPosts, ...previousEntry.Items ],
							},
						};
					},
				}),
			};
			//
		},
	});
