import React from 'react';
import { PropTypes } from 'prop-types';
import { FormattedNumber } from 'react-intl';
import { Tabs, Modal } from 'antd';
import ReactionsList from './ReactionsList';

class ReactionsModal extends React.Component {
  static propTypes = {
    visible: PropTypes.bool,
    upVotes: PropTypes.arrayOf(PropTypes.shape()),
    downVotes: PropTypes.arrayOf(PropTypes.shape()),
    ratio: PropTypes.number,
    onClose: PropTypes.func,
  };

  static defaultProps = {
    visible: false,
    upVotes: [],
    downVotes: [],
    ratio: 0,
    onOpen: () => {},
    onClose: () => {},
  };

  state = {
    visible: false,
  };

  render() {
    const { upVotes, downVotes, ratio } = this.props;

    const tabs = [];

    if (upVotes.length > 0) {
      tabs.push(
        <Tabs.TabPane
          tab={
            <span>
              <i className="iconfont icon-praise_fill" />
              <span className="StoryFooter__icon-text">
                <FormattedNumber value={upVotes.length} />
              </span>
            </span>
          }
          key="1"
        >
          <ReactionsList votes={upVotes} ratio={ratio} />
        </Tabs.TabPane>,
      );
    }

    if (downVotes.length > 0) {
      tabs.push(
        <Tabs.TabPane
          tab={
            <span>
              <i className="iconfont icon-praise_fill StoryFooter__dislike" />
              <span className="StoryFooter__icon-text StoryFooter__icon-text-dislike">
                <FormattedNumber value={downVotes.length} />
              </span>
            </span>
          }
          key="2"
        >
          <ReactionsList votes={downVotes} />
        </Tabs.TabPane>,
      );
    }

    return (
      <Modal
        visible={this.props.visible && (upVotes.length > 0 || downVotes.length > 0)}
        footer={null}
        onCancel={this.props.onClose}
      >
        <Tabs>{tabs}</Tabs>
      </Modal>
    );
  }
}

export default ReactionsModal;
