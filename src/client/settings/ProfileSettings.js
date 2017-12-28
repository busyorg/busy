import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Form, Input } from 'antd';
import SteemConnect from '../steemConnectAPI';
import Action from '../components/Button/Action';
import Affix from '../components/Utils/Affix';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import requiresLogin from '../auth/requiresLogin';
import './Settings.less';

const FormItem = Form.Item;

@requiresLogin
@injectIntl
@Form.create()
export default class ProfileSettings extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    form: PropTypes.shape().isRequired,
  };

  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  socialProfiles = [
    { id: 'website', icon: 'link', color: 'black', name: 'Website' },
    { id: 'facebook', icon: 'facebook', color: '#3b5998', name: 'Facebook' },
    { id: 'twitter', icon: 'twitter', color: '#00aced', name: 'Twitter' },
    { id: 'instagram', icon: 'instagram', color: '#8a3ab9', name: 'Instagram' },
    { id: 'github', icon: 'github', color: 'black', name: 'GitHub' },
    { id: 'bitcoin', icon: 'bitcoin', color: '#ff9900', name: 'Bitcoin' },
    { id: 'ethereum', icon: 'ethereum', color: '#3c3c3d', name: 'Ethereum' },
  ];

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const cleanValues = Object.keys(values).reduce(
          (a, b) => ({
            ...a,
            [b]: values[b] || '',
          }),
          {},
        );
        const win = window.open(SteemConnect.sign('profile-update', cleanValues), '_blank');
        win.focus();
      }
    });
  }

  render() {
    const { intl, form } = this.props;
    const { getFieldDecorator } = form;

    const socialInputs = this.socialProfiles.map(profile => (
      <FormItem key={profile.id}>
        {getFieldDecorator(profile.id)(
          <Input
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
          />,
        )}
      </FormItem>
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
            <Form onSubmit={this.handleSubmit}>
              <div className="Settings">
                <div className="Settings__section">
                  <h3>
                    <FormattedMessage id="profile_name" defaultMessage="Name" />
                  </h3>
                  <div className="Settings__section__inputs">
                    <FormItem>
                      {getFieldDecorator('name')(
                        <Input
                          size="large"
                          placeholder={intl.formatMessage({
                            id: 'profile_name_placeholder',
                            defaultMessage: 'Name to display on your profile',
                          })}
                        />,
                      )}
                    </FormItem>
                  </div>
                </div>
                <div className="Settings__section">
                  <h3>
                    <FormattedMessage id="profile_about" defaultMessage="About me" />
                  </h3>
                  <div className="Settings__section__inputs">
                    <FormItem>
                      {getFieldDecorator('about')(
                        <Input.TextArea
                          autosize={{ minRows: 2, maxRows: 6 }}
                          placeholder={intl.formatMessage({
                            id: 'profile_about_placeholder',
                            defaultMessage: 'Few words about you',
                          })}
                        />,
                      )}
                    </FormItem>
                  </div>
                </div>
                <div className="Settings__section">
                  <h3>
                    <FormattedMessage id="profile_location" defaultMessage="Location" />
                  </h3>
                  <div className="Settings__section__inputs">
                    <FormItem>
                      {getFieldDecorator('location')(
                        <Input
                          size="large"
                          placeholder={intl.formatMessage({
                            id: 'profile_location',
                            defaultMessage: 'Location',
                          })}
                        />,
                      )}
                    </FormItem>
                  </div>
                </div>
                <div className="Settings__section">
                  <h3>
                    <FormattedMessage id="profile_picture" defaultMessage="Profile picture" />
                  </h3>
                  <div className="Settings__section__inputs">
                    <FormItem>
                      {getFieldDecorator('profile_image')(
                        <Input
                          size="large"
                          placeholder={intl.formatMessage({
                            id: 'profile_picture',
                            defaultMessage: 'Profile picture',
                          })}
                        />,
                      )}
                    </FormItem>
                  </div>
                </div>
                <div className="Settings__section">
                  <h3>
                    <FormattedMessage id="profile_cover" defaultMessage="Cover picture" />
                  </h3>
                  <div className="Settings__section__inputs">
                    <FormItem>
                      {getFieldDecorator('cover_image')(
                        <Input
                          size="large"
                          placeholder={intl.formatMessage({
                            id: 'profile_cover',
                            defaultMessage: 'Cover picture',
                          })}
                        />,
                      )}
                    </FormItem>
                  </div>
                </div>
                <div className="Settings__section">
                  <h3>
                    <FormattedMessage id="profile_social_links" defaultMessage="Social links" />
                  </h3>
                  <div className="Settings__section__inputs">{socialInputs}</div>
                </div>
              </div>
              <Action
                primary
                type="submit"
                text={this.props.intl.formatMessage({ id: 'save', defaultMessage: 'Save' })}
              />
            </Form>
          </div>
        </div>
      </div>
    );
  }
}
