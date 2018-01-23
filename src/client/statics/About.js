import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { injectIntl, FormattedMessage } from 'react-intl';
import './About.less';

const About = ({ intl }) => (
  <div className="main-panel">
    <Helmet>
      <title>{intl.formatMessage({ id: 'about', defaultMessage: 'About' })} - Busy</title>
    </Helmet>
    <div className="mt-5 text-center">
      <h1>
        <FormattedMessage id="about" defaultMessage="About" />
      </h1>
      <p className="container pb-5">
        <FormattedMessage
          id="@statics/busy_mission"
          defaultMessage="The Busy project’s mission is to connect everyone to the next-gen decentralized social network that gives voice and value back to people, by building together a true sharing economy, a more free and trustworthy Internet without middleman."
        />
      </p>
      <div className="About__1 hero">
        <div className="container">
          <h1>
            <FormattedMessage
              id="@statics/ensure_compensation"
              defaultMessage="DLearn | Learning Decentralized and Incentivized"
            />
          </h1>
          <p>
            <FormattedMessage
              id="@statics/busy_mission_2"
              defaultMessage="Artists and User-generated content create billions dollars worth of value absorbed by the shareholders of these intermediaries and centralized services."
            />{' '}
            <FormattedMessage
              id="@statics/busy_mission3"
              defaultMessage="As a non-profit and decentralized organization, Busy provides the power of cryptocurrency and blockchain innovations within a platform that returns much of its value to the creators ensuring fair compensation."
            />
          </p>
        </div>
      </div>
      <div className="About__2 hero">
        <div className="container">
          <h1>
            <FormattedMessage
              id="@statics/sharing_economy"
              defaultMessage="Creating a true sharing economy"
            />
          </h1>
          <p>
            <FormattedMessage
              id="@statics/sharing_economy_2"
              defaultMessage="Uber or Airbnb are often described as the sharing economy, a nice notion that peers create and share in value. But these businesses have little to do with sharing, they in fact simply aggregate as middleman through their centralized, proprietary platforms and do resell by taking huge commissions."
            />{' '}
            <FormattedMessage
              id="@statics/sharing_economy_3"
              defaultMessage="Today's big disrupters are about to get disrupted!"
            />{' '}
            <FormattedMessage
              id="@statics/sharing_economy_4"
              defaultMessage="Busy aims to create a true peer-to-peer sharing economy without middleman and zero transaction fee that allows people to transact safely and freely."
            />
          </p>
        </div>
      </div>
      <div className="About__3 hero">
        <div className="container">
          <h1>
            <FormattedMessage
              id="@statics/money_transfer"
              defaultMessage="Ending the remittance ripoff"
            />
          </h1>
          <p>
            <FormattedMessage
              id="@statics/money_transfer_2"
              defaultMessage="The largest flow of funds into the developing world is not foreign aid but remittance money repatriated to poor countries from their families living abroad."
            />{' '}
            <FormattedMessage
              id="@statics/money_transfer_3"
              defaultMessage="Using Western Union, Moneygram and other centralized services, the process takes time, patience and cost from 5 to 25% commission."
            />
            <FormattedMessage
              id="@statics/money_transfer_4"
              defaultMessage="Busy's goal is to end the remittance ripoff providing a digital wallet that allows everyone to send/receive digital money with no transaction fee."
            />
          </p>
        </div>
      </div>
    </div>
  </div>
);

About.propTypes = {
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(About);
