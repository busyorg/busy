import * as witnessesActions from './witnessesActions';

const initialState = {
  loading: false,
  witnessList: {},
  votes: [],
};

export default function witnessesReducer(state = initialState, action) {
  switch (action.type) {
    case witnessesActions.GET_WITNESS_LIST.START:
      return {
        ...state,
        loading: true,
      };
    case witnessesActions.GET_WITNESS_LIST.SUCCESS:
      return {
        ...state,
        loading: false,
        witnessList: { witnesses: action.payload.witnesses },
      };
    case witnessesActions.GET_WITNESS_LIST.ERROR:
      return {
        ...state,
        loading: false,
      };
    case witnessesActions.GET_ACCOUNT_WITNESS_VOTES.START:
      return {
        ...state,
        loading: true,
      };
    case witnessesActions.GET_ACCOUNT_WITNESS_VOTES.SUCCESS:
      return {
        ...state,
        votes: action.payload,
        loading: false,
      };
    case witnessesActions.GET_ACCOUNT_WITNESS_VOTES.ERROR:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}

export const getLoading = state => state.loading;
export const getWitnessesList = state => state.witnessList;
export const getVotes = state => state.votes;
