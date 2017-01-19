import React from 'react';
import Header from '../app/Header';

const About = () =>
  <div className="main-panel">
    <Header />
    <div className="my-5">
      <div className="container text-center">
        <h1>About</h1>
        <p>
          The Busy project’s mission is to connect everyone to the next-gen
          decentralized social network that gives voice and value back to people
          , by building together a true sharing economy, a more free and trustworthy
          Internet without middleman.
        </p>
      </div>
      <div className="py-5 container">
        <h2>All in one platform</h2>
        <p>Not only an open-source social network and communication platform
          that rewards users for their contribution ! Busy also extends itself
          to a variety of rich features and functionality including free digital
          payments and marketplace for goods and services.</p>
        <h2>Ensuring compensation for the creators of value</h2>
        <p>Artists and User-generated content create billions dollars worth of
          value absorbed by the shareholders of these intermediaries and centralized
          services. As a non-profit and decentralized organization, Busy provides
          the power of cryptocurrency and blockchain innovations within a platform
          that return much of its value to the creators ensuring fair compensation.</p>
        <h2>Creating a true sharing economy</h2>
        <p>Uber or Airbnb are often described as the sharing economy, a nice notion
          that peers create and share in value. But these businesses have little to
          do with sharing, they in fact simply aggregate as middleman through their
          centralized, proprietary platforms and do resell by taking huge commissions.
          Today's big disrupters are about to get disrupted ! Busy aims to create a
          true peer-to-peer sharing economy without middleman and zero transaction
          fee that allows people to transact safely and freely.</p>
        <h2>Ending the remittance ripoff</h2>
        <p>The largest flow of funds into the developing world is not foreign aid
          but remittance money repatriated to poor countries from their families
          living abroad. Using Western Union, Moneygram and other centralized
          services, the process takes time, patience and cost from 5 to 25% commission.
          Selling goods or services using eBay, Paypal, takes 1 to 10% commission. Busy
          goal is to end the remittance ripoff providing a digital wallet that allows
          everyone to send/receive digital money with no transaction fee.</p>
      </div>
    </div>
  </div>;

export default About;
