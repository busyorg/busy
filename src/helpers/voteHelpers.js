import _ from 'lodash';

export const getUpvotes = activeVotes =>
  activeVotes.filter(vote => vote.percent > 0);

export const getDownvotes = activeVotes =>
  activeVotes.filter(vote => vote.percent < 0);

export const getFollowingUpvotes = (activeVotes, following) =>
  this.getUpvotes(activeVotes)
    .filter(vote => _.includes(following, vote.voter));

export const getFollowingDownvotes = (activeVotes, following) =>
  this.getDownvotes(activeVotes)
    .filter(vote => _.includes(following, vote.voter));

export const sortVotes = (votes, sortBy) =>
  votes.sort((a, b) => a[sortBy] - b[sortBy]);
