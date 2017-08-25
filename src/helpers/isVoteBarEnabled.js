import { formatter } from 'steem';
import config from '../../config';

const isVoteBarEnabled = ({ app, auth }) => {
  const totalVestingShares = app.props ? app.props.total_vesting_shares : 0;
  const totalVestingFundSteem = app.props ? app.props.total_vesting_fund_steem : 0;

  const power = formatter.vestToSteem(auth.user.vesting_shares, totalVestingShares,
    totalVestingFundSteem);

  return power > config.constants.LIKE_BAR_MIN_POWER;
};

export default isVoteBarEnabled;
