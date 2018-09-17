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
        title="Important Announcement"
        visible={this.state.visible}
        onCancel={this.handleModalClose}
        onOk={this.handleModalClose}
      >
        <div className="EmergencyNotificationPopup">
          <FormattedMessage
            id="steem_emergency_maintenance"
            defaultMessage="Steem is experiencing a new fork (HF20). We apologize for the interruptions in services that users are currently experiencing. The Steem team is working hard to bring all services back online."
          />
        </div>
      </Modal>
    );
  }
}

export default EmergencyNotificationPopup;
