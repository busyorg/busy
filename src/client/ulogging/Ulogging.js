import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import { Layout, Card, Icon, Avatar, Row, Col, Collapse, Menu, Dropdown, Button } from 'antd';
import { injectIntl, FormattedMessage } from 'react-intl';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import DiscoverContent from './DiscoverContent';
import Affix from '../components/Utils/Affix';
import './Discover.less';
import LastDraftsContainer from '../post/Write/LastDraftsContainer';
import Editor from '../components/Editor/Editor';

const menu = (
  <Menu>
    <Menu.Item key="0">
      <Link to={'/ulogging#knowledge-bank'}>ULOG-KnowledgeBank</Link>
    </Menu.Item>
    <Menu.Item key="1">
      <Link to={'/ulogging#surpassing-google'}>SurpassingGoogle</Link>
    </Menu.Item>
    <Menu.Item key="2">
      <Link to={'/ulogging#be-like-terry'}>BeLikeTerry (Fan Love)</Link>
    </Menu.Item>
  </Menu>
);

const knowledgeBankMenu = (
  <Menu>
    <Menu.Item key="0">
      <Link to={'/ulog-diy'}>#ulog-diy (Fresh DIY per day)</Link>
    </Menu.Item>
  </Menu>
);

const funLoveMenu = (
  <Menu>
    <Menu.Item key="0">
      <Link to={'/ulog-ned'}>#ulog-ned (Emulate, Learn, Gratitude, Celebrate etc @ned)</Link>
    </Menu.Item>
  </Menu>
);

const surpassingGoogleMenu = (
  <Menu>
    <Menu.Item key="0">
      <Link to={'/teardrops'}>#teardrops (Share your teardrops moments, happy/sad/un-fell etc)</Link>
    </Menu.Item>
    <Menu.Item key="1">
      <Link to={'/untalented'}>#untalented (Share all levels of talent/attempts/out-of-the-boxness)</Link>
    </Menu.Item>
  </Menu>
);


const customPanelStyle = {
  marginBottom: 5,
  overflow: 'hidden',
};

const Ulogging = ({ intl }) => (
  <div className="shifted">
    <div className="post-layout container">
      <Affix className="rightContainer" stickPosition={77}>
        <div className="right">
          <LastDraftsContainer />
        </div>
      </Affix>
      <div className="center">
        <h3 style={{ background: '#fff' }}>
          <a href="#">#ulogging to create a better world of "true celebrity-hood" for "Everyone", once and for all.</a>
        </h3>
        <Collapse accordion defaultActiveKey={['1', '2', '3', '4']}>
          <Collapse.Panel
            header="The art of ULOGGING"
            key="1"
            style={customPanelStyle}>
            <p>
              The art of ULOGGING is a conscious effort to "mine the human" into its **"awesomest version", while reshaping the entire INTERNET and creating legends, icons, great men and women, brothers and "True Celebrities". <br/>
              Together ULOGGING, we will remove "all barriers to entry" for content-creation, content-curation and steem-promotion, "making steeming as difficult as 1, 2, 3". <br/>
              We will own our very cookies; we will re-tap into our shine and recover lost shine. We will fly. ("True Celebrity-hood" for "everyone" once and for all") <br/>
              In due time, we will celebrate breakthrough with the @teardrops Smart Media Token; "@surpassinggoogle". <br/><br/>
              <u>Special Note:</u> Everytime you make use of ulogs.org to post, comment etc, you are supporting steemians, projects, ULOGGERS etc by being their "true fans". Too, you "mine the human" some more, becoming "true celebrities". You will also give back to steem/steemit in gratitude as we contribute a "negligible sum" from our rewards with Steemit INC as beneficiary. <br/>
            </p>
          </Collapse.Panel>

          <Collapse.Panel
            header="ULOG-Knowledge-Bank"
            key="2"
            style={customPanelStyle}>
            <p>
              We like to reward #ulogging contributions born solely out of <i>"your experience"</i> per day. We seek to incentivize you to learn something new per day, for the sake of #ulogging. This way, <i>"not a day slips emptily by"</i> and not a day aren't you capable of reshaping the INTERNET; touching your <i>"true fans"</i> and attaining <i>"true celebrity-hood"</i> etc <br/>
              Deposit to our Knowledge-bank by trying one of our #ulogging editors from the dropdown below. Withdraw knowledge by using the search box above. <br/>
            </p>
            <Dropdown overlay={knowledgeBankMenu} trigger={['click']}>
              <Button>
                Select An Editor <Icon type="down" />
              </Button>
            </Dropdown>
          </Collapse.Panel>

          <Collapse.Panel
            header="ULOG-fanlove (BeLikeTerry)"
            key="3"
            style={customPanelStyle}>
            <p>
              To become like me, you will need to stubbornly become the <i>"awesomest version of YOU"</i>. @surpassinggoogle <br/>
              Choose an editor from the dropdown below to be <i>"true fans"</i> of a project, community, ULOGGER, steemian etc by using your #ulogging to emulate, show gratitude, learn about, write about, share moments with etc (per day for freshness). <br/>
              e.g you can learn about Ned for the sake of <i>#ulogging under #ulog-ned</i> etc You will also be able to do likewise for projects, communities etc <br/>
            </p>
            <Dropdown overlay={funLoveMenu} trigger={['click']}>
              <Button>
                Select An Editor <Icon type="down" />
              </Button>
            </Dropdown>
          </Collapse.Panel>

          <Collapse.Panel
            header="SurpassingGoogle"
            key="4"
            style={customPanelStyle}>
            <p>
              Note that ulogs.org integrates 4 websites into one. Thus, we are integrating all the paradigms from SurpassingGoogle, Teardrops, Un(dis)Talented into ulogs.org, so that instead of 4 standalone steem-based websites, we can have one grand website that "mines the human" into its awesomest version. <br/>
              <i>When you see a great man/woman, a legend, an icon, a "true celebrity" etc you know it. You feel something. It is different. One reason is; "great men", "legends", "icons", "true celebrities" are still a rarity on Mama Earth. When we remove this rarity, we Surpass Google.</i> @surpassinggoogle <br/><br/>
              Use this segment to "mine the human" some more. <br/>
            </p>
            <Dropdown overlay={surpassingGoogleMenu} trigger={['click']}>
              <Button>
                Select An Editor <Icon type="down" />
              </Button>
            </Dropdown>
          </Collapse.Panel>

        </Collapse>

      </div>
    </div>
  </div>
);

Ulogging.propTypes = {
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(Ulogging);
