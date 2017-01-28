import React from 'react';
import { FormattedMessage } from 'react-intl';
import Header from '../app/Header';
import './About.scss';

const About = () =>
  <div className="main-panel">
    <Header />
    <div className="text-center">
      <div className="container my-5 pb-4">
        <h1><FormattedMessage id="about" /></h1>
        <h3>
          The Busy project’s mission is to connect everyone to the next-gen
          decentralized social network that gives voice and value back to people
          , by building together a true sharing economy, a more free and trustworthy
          Internet without middleman.
        </h3>
      </div>
      <div>
        <div className="About__2 hero">
          <div className="container">
            <h1>Ensuring compensation for the creators of value</h1>
            <h4>Artists and User-generated content create billions dollars worth of
              value absorbed by the shareholders of these intermediaries and centralized
              services. As a non-profit and decentralized organization, Busy provides
              the power of cryptocurrency and blockchain innovations within a platform
              that returns much of its value to the creators ensuring fair compensation.</h4>
          </div>
        </div>
        <div className="About__3 hero">
          <div className="container">
            <h1>Creating a true sharing economy</h1>
            <h4>Uber or Airbnb are often described as the sharing economy, a nice notion
              that peers create and share in value. But these businesses have little to
              do with sharing, they in fact simply aggregate as middleman through their
              centralized, proprietary platforms and do resell by taking huge commissions.
              Today's big disrupters are about to get disrupted ! Busy aims to create a
              true peer-to-peer sharing economy without middleman and zero transaction
              fee that allows people to transact safely and freely.</h4>
          </div>
        </div>
        <div className="About__4 hero">
          <div className="container">
            <h1>Ending the remittance ripoff</h1>
            <h4>The largest flow of funds into the developing world is not foreign aid
              but remittance money repatriated to poor countries from their families
              living abroad. Using Western Union, Moneygram and other centralized
              services, the process takes time, patience and cost from 5 to 25% commission.
              Selling goods or services using eBay, Paypal, takes 1 to 10% commission. Busy
              goal is to end the remittance ripoff providing a digital wallet that allows
              everyone to send/receive digital money with no transaction fee.</h4>
          </div>
        </div>
      </div>
    </div>
  </div>;

export default About;
