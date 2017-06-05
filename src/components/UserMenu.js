import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { Menu } from 'antd';
import './UserMenu.less';

class UserMenu extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    defaultKey: PropTypes.string,
    discussions: PropTypes.number,
    comments: PropTypes.number,
    followers: PropTypes.number,
    following: PropTypes.number,
  }

  static defaultProps = {
    discussions: 0,
    comments: 0,
    followers: 0,
    following: 0,
  }

  constructor(props) {
    super(props);
    this.state = {
      current: (props.defaultKey) ? props.defaultKey : 'discussions',
    };
  }

  handleClick = (e) => {
    this.setState({
      current: e.key,
    }, () => {
      if (this.props.onChange) {
        this.props.onChange(e.key);
      }
    });
  }

  render() {
    return (
      <div className="UserMenu">
        <Menu
          className="UserMenu__menu"
          onClick={this.handleClick}
          selectedKeys={[this.state.current]}
          mode="horizontal"
        >
          <Menu.Item key="discussions" className="UserMenu__item">
            Discussions
            <span className="UserMenu__badge">
              <FormattedMessage
                id="formatted_number"
                defaultMessage="{count, number}"
                values={{ count: this.props.discussions }}
              />
            </span>
          </Menu.Item>
          <Menu.Item key="comments" className="UserMenu__item">
            <strong>
              Comments
              <span className="UserMenu__badge">
                <FormattedMessage
                  id="formatted_number"
                  defaultMessage="{count, number}"
                  values={{ count: this.props.comments }}
                />
              </span>
            </strong>
          </Menu.Item>
          <Menu.Item key="followers" className="UserMenu__item">
            <strong>
              Followers
              <span className="UserMenu__badge">
                <FormattedMessage
                  id="formatted_number"
                  defaultMessage="{count, number}"
                  values={{ count: this.props.followers }}
                />
              </span>
            </strong>
          </Menu.Item>
          <Menu.Item key="following" className="UserMenu__item">
            <strong>
              Following
              <span className="UserMenu__badge">
                <FormattedMessage
                  id="formatted_number"
                  defaultMessage="{count, number}"
                  values={{ count: this.props.following }}
                />
              </span>
            </strong>
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}

export default UserMenu;
