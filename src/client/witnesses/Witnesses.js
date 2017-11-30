import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Table, Input } from 'antd';
import Affix from '../components/Utils/Affix';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import Loading from '../components/Icon/Loading';
import requiresLogin from '../auth/requiresLogin';
import SteemAPI from '../steemConnectAPI';
import { sortWitnesses } from '../helpers/sortHelpers';
import {
  getWitnessList,
  getAccountsWitnessVotes,
} from './witnessesActions';
import {
  getWitnessesList,
  getLoading,
  getVotes,
  getAuthenticatedUserName,
} from '../reducers';
import './Witnesses.less';

@connect(
  state => ({
    username: getAuthenticatedUserName(state),
    witnessList: getWitnessesList(state),
    loading: getLoading(state),
    votes: getVotes(state),
  }),
  {
    getWitnessList,
    getAccountsWitnessVotes,
  },
)
class Witnesses extends React.Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
    witnessList: PropTypes.shape().isRequired,
    loading: PropTypes.bool.isRequired,
    votes: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    getWitnessList: PropTypes.func.isRequired,
    getAccountsWitnessVotes: PropTypes.func.isRequired,
  };

  static defaultProps = {
    username: '',
    witnessList: {},
    loading: false,
    votes: [],
    getWitnessList: () => {},
    getAccountsWitnessVotes: () => {},
  };

  state = {
    vote: '',
    proxy: '',
  }

  componentWillMount = () => {
    this.props.getWitnessList();
    this.props.getAccountsWitnessVotes(this.props.username);
  };

  render() {
    const { witnessList, votes, username } = this.props;
    const sortedWitnessList = sortWitnesses(witnessList);
    const renderActive = (bool, record) => {
      if (bool) {
        return (
          <a
            className="Witnesses__link active"
            href={
              SteemAPI.sign('account_witness_vote', {
                account: username,
                witness: record.owner,
                approve: !bool,
              }, 'https://busy.org/~witnesses')}
          >
            <i className="iconfont icon-praise_fill" />
          </a>
        );
      }
      return (
        <a
          className="Witnesses__link"
          href={
            SteemAPI.sign('account_witness_vote', {
              account: username,
              witness: record.owner,
              approve: !bool,
            }, 'https://busy.org/~witnesses')}
        >
          <i className="iconfont icon-praise_fill" />
        </a>
      );
    };
    const columns = [{
      title: 'Vote',
      dataIndex: 'id',
      render: (text, record) =>
        renderActive(votes[0].witness_votes.includes(record.owner), record),
    },
    {
      title: 'Name',
      dataIndex: 'owner',
      key: 'owner',
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
      render: text => <a href={text} target="_blank">Witness Page</a>,
    }];
    return (
      <div className="shifted Witnesses">
        <div className="feed-layout container">
          <Affix className="leftContainer" stickPosition={77}>
            <div className="left">
              <LeftSidebar />
            </div>
          </Affix>
          <Affix className="rightContainer" stickPosition={77}>
            <div className="right" />
          </Affix>
          <div className="center">
            {this.props.loading && <Loading />}
            <Table className="Witnesses__input" dataSource={sortedWitnessList} rowKey={record => record.id} pagination={false} columns={columns} />
            <Input
              className="Witnesses__input"
              onChange={e => this.setState({ vote: e.target.value })}
              placeholder="Vote For Someone Not On The List"
              addonBefore="@"
              addonAfter={<a href={
                SteemAPI.sign('account_witness_vote', {
                  account: this.props.username,
                  witness: this.state.vote,
                  approve: true,
                }, 'https://busy.org/~witnesses')}
              >Vote</a>}
            />
            <Input
              className="Witnesses__input"
              onChange={e => this.setState({ vote: e.target.value })}
              placeholder="Devote For Someone Not On The List"
              addonBefore="@"
              addonAfter={<a href={
                SteemAPI.sign('account_witness_vote', {
                  account: this.props.username,
                  witness: this.state.vote,
                  approve: false,
                }, 'https://busy.org/~witnesses')}
              >Devote</a>}
            />
            <Input
              className="Witnesses__input"
              onChange={e => this.setState({ proxy: e.target.value })}
              placeholder="Set Proxy"
              addonBefore="@"
              addonAfter={
                <a href={
                  SteemAPI.sign('account_witness_proxy', {
                    account: this.props.username,
                    proxy: this.state.proxy,
                  }, 'https://busy.org/~witnesses')}
                >Set Proxy</a>
              }
            />
          </div>
        </div>
      </div>
    );
  }
}

export default requiresLogin(Witnesses);
