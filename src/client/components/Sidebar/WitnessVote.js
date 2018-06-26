import React from 'react';
import { FormattedMessage } from 'react-intl';
import './SidebarBlock.less';

const WitnessVote = () => (
  <div className="SidebarBlock__witness-block">
    <h2 className="SidebarBlock__witness-title">
      <FormattedMessage id="witness_vote" defaultMessage="Ulogs.org is free to use by everyone." />
    </h2>
    <h3 className="SidebarBlock__witness-title">You can inspire us!</h3>
    <a
      target="_blank"
      rel="noopener noreferrer"
      href="https://steemconnect.com/sign/account-witness-vote?witness=steemgigs&approve=true"
    >
      <button className="SidebarBlock__witness-vote">
        <FormattedMessage id="vote_for_witness" defaultMessage="Vote @steemgigs" />
      </button>
    </a>
  </div>
);

export default WitnessVote;