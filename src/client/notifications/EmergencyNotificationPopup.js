import React from 'react';
import { Modal } from 'antd';
import { FormattedMessage } from 'react-intl';

class EmergencyNotificationPopup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: true,
    };

    this.handleModalClose = this.handleModalClose.bind(this);
  }

  handleModalClose() {
    this.setState({
      visible: false,
    });
  }

  render() {
    return (
      <Modal
        title=""
        visible={this.state.visible}
        onCancel={this.handleModalClose}
        onOk={this.handleModalClose}
      >
        <div className="EmergencyNotificationPopup">
          <div
            style={{
              fontSize: 24,
              fontWeight: 'bold',
            }}
          >
            <FormattedMessage id="important_announcement" defaultMessage="Important Announcement" />
          </div>
          <span>
            <FormattedMessage
              id="steem_emergency_maintenance"
              defaultMessage="Steem is experiencing a new fork (HF20), and it went bad somehow, so the blockchain is facing some issues.
we apologize for the interruptions in service that users experienced today. These interruptions were due to an issue that arose out of the process of
transitioning to Hardfork 20 for Steem. This issue is currently being worked on and will be resolved."
            />
          </span>
        </div>
      </Modal>
    );
  }
}

export default EmergencyNotificationPopup;
