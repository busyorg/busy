import React, { PropTypes } from 'react';
import ReduxInfiniteScroll from 'redux-infinite-scroll';
import { Link } from 'react-router-dom';
import { FormattedRelative } from 'react-intl';

import Avatar from '../components/Avatar';

const defaultPageItems = 10;

// Functions Borrowed from Steemit.com sourcecode for integrity
const numberWithCommas = x => x.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const renameToSd = txt => (txt ? numberWithCommas(txt.replace('SBD', 'SD')) : txt);

// Logic is copied from : https://github.com/steemit/steemit.com/blob/5e930d61781716e875d527ea89e625a38bea0436/app/components/cards/TransferHistoryRow.jsx#L8
// changed slightly to fit within our coding style
const renderReportFromOp = (op, username) => {
  const type = op[1].op[0];
  const data = op[1].op[1];

  const curationReward = data.reward;
  const authorReward = data.vesting_payout;

  /*  all transfers involve up to 2 accounts, context and 1 other. */
  let descriptionStart = '';
  let otherAccount = null;
  let descriptionEnd = '';

  if (type === 'transfer_to_vesting') {
    if (data.from === username) {
      if (data.to === '') {
        descriptionStart += `Transfer ${data.amount.split(' ')[0]} to STEEM POWER`;
      } else {
        descriptionStart += `Transfer ${data.amount.split(' ')[0]} STEEM POWER to `;
        otherAccount = data.to;
      }
    } else if (data.to === username) {
      descriptionStart += `Receive ${data.amount.split(' ')[0]} STEEM POWER from `;
      otherAccount = data.from;
    } else {
      descriptionStart += `Transfer ${data.amount.split(' ')[0]} STEEM POWER from ${data.from} to `;
      otherAccount = data.to;
    }
  } else if (/^transfer$|^transfer_to_savings$|^transfer_from_savings$/.test(type)) {
    // transfer_to_savings

    let fromWhere;

    switch (type) {
      case 'transfer_to_savings':
        fromWhere = 'to savings';
        break;
      case 'transfer_from_savings':
        fromWhere = 'from savings';
        break;
      default:
        return '';
    }

    if (data.from === username) {
      descriptionStart += `Transfer ${fromWhere}${data.amount} to `;
      otherAccount = data.to;
    } else if (data.to === username) {
      descriptionStart += `Receive ${fromWhere}${data.amount} from `;
      otherAccount = data.from;
    } else {
      descriptionStart += `Transfer ${fromWhere}${data.amount} from `;
      otherAccount = data.from;
      descriptionEnd += ` to ${data.to}`;
    }
    if (data.request_id) {
      descriptionEnd += ` (request ${data.request_id})`;
    }
  } else if (type === 'cancel_transfer_from_savings') {
    descriptionStart += `Cancel transfer from savings (request ${data.request_id})`;
  } else if (type === 'withdraw_vesting') {
    if (data.vesting_shares === '0.000000 VESTS') {
      descriptionStart += 'Stop power down';
    } else {
      descriptionStart += `Start power down of ${data.vesting_shares}`;
    }
  } else if (type === 'curation_reward') {
    descriptionStart += `${curationReward} STEEM POWER for `;
    otherAccount = `${data.comment_author}/${data.comment_permlink}`;
  } else if (type === 'author_reward') {
    let steemPayout = '';
    if (data.steem_payout !== '0.000 STEEM') steemPayout = `, ${data.steem_payout}`;
    descriptionStart += `${renameToSd(
      data.sbd_payout,
    )}${steemPayout}, and ${authorReward} STEEM POWER for ${data.author}/${data.permlink}`;

    descriptionEnd = '';
  } else if (type === 'interest') {
    descriptionStart += `Receive interest of ${data.interest}`;
  } else if (type === 'fill_convert_request') {
    descriptionStart += `Fill convert request: ${data.amount_in} for ${data.amount_out}`;
  } else if (type === 'fill_order') {
    if (data.open_owner === username) {
      // my order was filled by data.current_owner
      descriptionStart += `Paid ${data.open_pays} for ${data.current_pays}`;
    } else {
      // data.open_owner filled my order
      descriptionStart += `Paid ${data.current_pays} for ${data.open_pays}`;
    }
  } else if (type === 'claim_reward_balance') {
    descriptionStart += `Claim rewards: ${renameToSd(
      data.reward_sbd,
    )}, ${data.reward_steem}, and ${data.reward_vests}`;
    descriptionEnd = '';
  } else {
    descriptionStart += JSON.stringify({ type, ...data }, null, 2);
  }
  return (
    <span>
      {descriptionStart}
      {otherAccount &&
        <Link to={`/@${otherAccount}`}>
          <Avatar username={otherAccount} /> {otherAccount}
        </Link>}
      {descriptionEnd}
    </span>
  );
};

const getOnlyViableTransfers = list =>
  list.filter((op) => {
    // filtering out some types of transactions to integrate it with Steemit results
    const type = op[1].op[0];
    const data = op[1].op[1];

    if (type === 'curation_reward' || type === 'author_reward') {
      return false;
    }

    if (data.sbd_payout === '0.000 SBD' && data.vesting_payout === '0.000000 VESTS') {
      return false;
    }
    return true;
  });

export default class TransferHistory extends React.Component {
  static propTypes = {
    list: PropTypes.arrayOf(PropTypes.array),
    username: PropTypes.string,
  };

  static defaultProps = {
    list: [],
    username: undefined,
  };

  state = {
    visibleItems: defaultPageItems,
  };

  handleNextPage() {
    this.setState({ visibleItems: this.state.visibleItems + defaultPageItems });
  }

  render() {
    const { visibleItems } = this.state;
    const { list, username } = this.props;

    return (
      <div>
        <ReduxInfiniteScroll
          loadMore={() => this.handleNextPage()}
          elementIsScrollable={false}
          hasMore={list.length > visibleItems}
        >
          {getOnlyViableTransfers(list).reverse().slice(0, visibleItems).map(op =>
            (<div key={list.indexOf(op)} className="my-4">
              <hr />
              <h5>
                <b>{renderReportFromOp(op, username)}</b>{' '}
                <span className="pull-right">
                  <FormattedRelative value={`${op[1].timestamp}Z`} />
                </span>
              </h5>
              {op[1].op[1].memo &&
                <blockquote>
                  {op[1].op[1].memo}
                </blockquote>}
            </div>),
          )}
        </ReduxInfiniteScroll>
      </div>
    );
  }
}
