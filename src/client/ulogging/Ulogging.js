import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Layout, Card, Icon, Avatar, Row, Col } from 'antd';
import { injectIntl, FormattedMessage } from 'react-intl';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import DiscoverContent from './DiscoverContent';
import Affix from '../components/Utils/Affix';
import './Discover.less';

const Ulogging = ({ intl }) => (
  <div className="shifted">
    <Helmet>
      <title>
        {intl.formatMessage({ id: 'discover_more_people', defaultMessage: 'discover_more_people' })}{' '}
        - Busy
      </title>
    </Helmet>
    <Layout.Content style={{ padding: '0 50px' }}>
      <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
        <b>#ulogging to create a better world of "true celebrity-hood" for "Everyone", once and for all.</b>
        <p>
          The art of ULOGGING is a conscious effort to "mine the human" into its **"awesomest version", while reshaping the entire INTERNET and creating legends, icons, great men and women, brothers and "True Celebrities". <br/>
          Together ULOGGING, we will remove "all barriers to entry" for content-creation, content-curation and steem-promotion, "making steeming as difficult as 1, 2, 3". <br/>
          We will own our very cookies; we will re-tap into our shine and recover lost shine. We will fly. ("True Celebrity-hood" for "everyone" once and for all") <br/>
          In due time, we will celebrate breakthrough with the @teardrops Smart Media Token; "@surpassinggoogle". <br/>
          Special Note: Everytime you make use of ulogs.org to post, comment etc, you are supporting steemians, projects, ULOGGERS etc by being their "true fans". Too, you "mine the human" some more, becoming "true celebrities". You will also give back to steem/steemit in gratitude as we contribute a "negligible sum" from our rewards with Steemit INC as beneficiary.
        </p>
      </div>
      <div style={{ background: '#ECECEC', padding: '30px' }}>
        <div>
          <h2 id="knowledgebank">ULOG-Knowledge-Bank</h2>
          <p>
            We like to reward #ulogging contributions born solely out of "your experience" per day. We seek to incentivize you to learn something new per day, for the sake of #ulogging. This way, "not a day slips emptily by" and not a day aren't you capable of reshaping the INTERNET; touching your "true fans" and attaining "true celebrity-hood" etc
            Deposit to our Knowledge-bank by trying one of our #ulogging editors from the dropdown below. Withdraw knowledge by using the search box above.
          </p>
        </div>
        <Row gutter={16}>
          <Col span={8}>
              <Card
                style={{ width: 300 }}
                cover={<img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />}
                actions={[<Icon type="setting" />, <Icon type="edit" />, <Icon type="ellipsis" />]}
              >
                <Card.Meta
                  avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                  title="Card title"
                  description="This is the description"
                />
              </Card>
          </Col>
        </Row>
      </div>
      <div style={{ background: '#ECECEC', padding: '30px' }}>
        <div>
          <h2 id="beliketerry">ULOG-fanlove (BeLikeTerry)</h2>
          <p>
            To become like me, you will need to stubbornly become the "awesomest version of YOU". @surpassinggoogle
            Choose an editor from the dropdown below to be "true fans" of a project, community, ULOGGER, steemian etc by using your #ulogging to emulate, show gratitude, learn about, write about, share moments with etc (per day for freshness).
            e.g you can learn about Ned for the sake of #ulogging under #ulog-ned etc You will also be able to do likewise for projects, communities etc
          </p>
        </div>
        <Row gutter={16}>
          <Col span={8}>
              <Card
                style={{ width: 300 }}
                cover={<img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />}
                actions={[<Icon type="setting" />, <Icon type="edit" />, <Icon type="ellipsis" />]}
              >
                <Card.Meta
                  avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                  title="Card title"
                  description="This is the description"
                />
              </Card>
          </Col>
        </Row>
      </div>
      <div style={{ background: '#ECECEC', padding: '30px' }}>
        <div>
          <h2 id="surpassinggoogle">SurpassingGoogle</h2>
          <p>
            Note that ulogs.org integrates 4 websites into one. Thus, we are integrating all the paradigms from SurpassingGoogle, Teardrops, Un(dis)Talented into ulogs.org, so that instead of 4 standalone steem-based websites, we can have one grand website that "mines the human" into its awesomest version.
            When you see a great man/woman, a legend, an icon, a "true celebrity" etc you know it. You feel something. It is different. One reason is; "great men", "legends", "icons", "true celebrities" are still a rarity on Mama Earth. When we remove this rarity, we Surpass Google. @surpassinggoogle
          </p>
        </div>
        <Row gutter={16}>
          <Col span={8}>
              <Card
                style={{ width: 300 }}
                cover={<img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />}
                actions={[<Icon type="setting" />, <Icon type="edit" />, <Icon type="ellipsis" />]}
              >
                <Card.Meta
                  avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                  title="Card title"
                  description="This is the description"
                />
              </Card>
          </Col>
        </Row>
      </div>
    </Layout.Content>
  </div>
);

Ulogging.propTypes = {
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(Ulogging);
