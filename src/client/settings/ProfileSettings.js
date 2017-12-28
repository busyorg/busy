import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Input } from 'antd';
import Affix from '../components/Utils/Affix';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import requiresLogin from '../auth/requiresLogin';
import './Settings.less';

@injectIntl
@requiresLogin
export default class ProfileSettings extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
  };

  socialProfiles = [
    { id: 'website', icon: 'link', color: 'black', name: 'Website' },
    { id: 'facebook', icon: 'facebook', color: '#3b5998', name: 'Facebook' },
    { id: 'twitter', icon: 'twitter', color: '#00aced', name: 'Twitter' },
    { id: 'instagram', icon: 'instagram', color: '#8a3ab9', name: 'Instagram' },
    { id: 'github', icon: 'github', color: 'black', name: 'GitHub' },
    { id: 'bitcoin', icon: 'bitcoin', color: '#ff9900', name: 'Bitcoin' },
    { id: 'ethereum', icon: 'ethereum', color: '#3c3c3d', name: 'Ethereum' },
  ];

  render() {
    const { intl } = this.props;

    const socialInputs = this.socialProfiles.map(profile => (
      <Input
        key={profile.id}
        size="large"
        prefix={
          <i
            className={`Settings__prefix-icon iconfont icon-${profile.icon}`}
            style={{
              color: profile.color,
            }}
          />
        }
        placeholder={profile.name}
      />
    ));

    return (
      <div className="shifted">
        <div className="settings-layout container">
          <Affix className="leftContainer" stickPosition={77}>
            <div className="left">
              <LeftSidebar />
            </div>
          </Affix>
          <div className="center">
            <h1>
              <FormattedMessage id="edit_profile" defaultMessage="Edit Profile" />
            </h1>
            <div className="Settings">
              <div className="Settings__section">
                <h3>
                  <FormattedMessage id="profile_name" defaultMessage="Name" />
                </h3>
                <div className="Settings__section__inputs">
                  <Input
                    size="large"
                    placeholder={intl.formatMessage({
                      id: 'profile_name_placeholder',
                      defaultMessage: 'Name to display on your profile',
                    })}
                  />
                </div>
              </div>
              <div className="Settings__section">
                <h3>
                  <FormattedMessage id="profile_about" defaultMessage="About me" />
                </h3>
                <div className="Settings__section__inputs">
                  <Input.TextArea
                    autosize={{ minRows: 2, maxRows: 6 }}
                    placeholder={intl.formatMessage({
                      id: 'profile_about_placeholder',
                      defaultMessage: 'Few words about you',
                    })}
                  />
                </div>
              </div>
              <div className="Settings__section">
                <h3>
                  <FormattedMessage id="profile_location" defaultMessage="Location" />
                </h3>
                <div className="Settings__section__inputs">
                  <Input
                    size="large"
                    placeholder={intl.formatMessage({
                      id: 'profile_location',
                      defaultMessage: 'Location',
                    })}
                  />
                </div>
              </div>
              <div className="Settings__section">
                <h3>
                  <FormattedMessage id="profile_picture" defaultMessage="Profile picture" />
                </h3>
                <div className="Settings__section__inputs">
                  <Input
                    size="large"
                    placeholder={intl.formatMessage({
                      id: 'profile_picture',
                      defaultMessage: 'Profile picture',
                    })}
                  />
                </div>
              </div>
              <div className="Settings__section">
                <h3>
                  <FormattedMessage id="profile_cover" defaultMessage="Cover picture" />
                </h3>
                <div className="Settings__section__inputs">
                  <Input
                    size="large"
                    placeholder={intl.formatMessage({
                      id: 'profile_cover',
                      defaultMessage: 'Cover picture',
                    })}
                  />
                </div>
              </div>
              <div className="Settings__section">
                <h3>
                  <FormattedMessage id="profile_social_links" defaultMessage="Social links" />
                </h3>
                <div className="Settings__section__inputs">{socialInputs}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
