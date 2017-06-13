import React, { PureComponent } from 'react';
import Hero from '../components/Hero';

const HeroHeader = ({ auth, style }) => {
  console.log('props HeroHeader', auth);
  return (
    <div style={style}>
      {auth.user.name === undefined ? <Hero /> : null}
    </div>
  );
};

export default HeroHeader;
