import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Checkbox } from 'antd';
import Loading from '../../components/Icon/Loading';
import { reload } from '../../auth/authActions';
import { getDraftPosts, getPendingDrafts, getIsReloading } from '../../reducers';
import Affix from '../../components/Utils/Affix';
import LeftSidebar from '../../app/Sidebar/LeftSidebar';
import DraftRow from './DraftRow';
import DeleteDraftModal from './DeleteDraftModal';
import requiresLogin from '../../auth/requiresLogin';
import './Drafts.less';

@requiresLogin
@injectIntl
@connect(
  state => ({
    reloading: getIsReloading(state),
    draftPosts: getDraftPosts(state),
    pendingDrafts: getPendingDrafts(state),
  }),
  { reload },
)
class Drafts extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    reloading: PropTypes.bool,
    draftPosts: PropTypes.shape().isRequired,
    pendingDrafts: PropTypes.arrayOf(PropTypes.string),
    reload: PropTypes.func,
  };

  static defaultProps = {
    reloading: false,
    pendingDrafts: [],
    reload: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      showModalDelete: false,
      selectedDrafts: [],
    };

    this.handleCheckAll = this.handleCheckAll.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  componentDidMount() {
    this.props.reload();
  }

  handleCheckAll(e) {
    const { draftPosts } = this.props;
    const { checked } = e.target;

    this.setState({
      selectedDrafts: checked ? Object.keys(draftPosts) : [],
    });
  }

  handleCheck(id, checked) {
    const { selectedDrafts } = this.state;

    this.setState({
      selectedDrafts: checked
        ? [...selectedDrafts, id]
        : selectedDrafts.filter(draft => draft !== id),
    });
  }

  showModal() {
    this.setState({ showModalDelete: true });
  }

  hideModal() {
    this.setState({ showModalDelete: false });
  }

  render() {
    const { intl, reloading, draftPosts, pendingDrafts } = this.props;
    const { showModalDelete, selectedDrafts } = this.state;
    const sortedDraftPosts = _.sortBy(
      _.map(draftPosts, (draft, id) => ({ ...draft, id })),
      draft => new Date(draft.lastUpdated),
    ).reverse();
    const noDrafts = !reloading && _.size(draftPosts) === 0;

    return (
      <div className="Drafts shifted">
        <Helmet>
          <title>{intl.formatMessage({ id: 'drafts', defaultMessage: 'Drafts' })} - Busy</title>
        </Helmet>
        <div className="drafts-layout container">
          <Affix className="leftContainer" stickPosition={77}>
            <div className="left">
              <LeftSidebar />
            </div>
          </Affix>
          <div className="center">
            <div>
              <h1>
                <FormattedMessage id="drafts" defaultMessage="Drafts" />
              </h1>
              <h3>
                <FormattedMessage
                  id="drafts_description"
                  defaultMessage="These are posts that were never made public. You can publish them or delete them."
                />
              </h3>
            </div>
            {reloading && <Loading center={false} />}
            {!reloading &&
              _.size(draftPosts) !== 0 && (
                <div className="Drafts__toolbar">
                  <Checkbox
                    checked={_.isEqual(selectedDrafts, Object.keys(draftPosts))}
                    onChange={this.handleCheckAll}
                  />
                  <div>
                    <a
                      role="presentation"
                      className="Drafts__toolbar__delete"
                      onClick={this.showModal}
                    >
                      <i className="iconfont icon-trash Drafts__toolbar__delete__icon" />
                      <FormattedMessage id="delete_selected" defaultMessage="Delete selected" />
                    </a>
                  </div>
                </div>
              )}
            {noDrafts && (
              <h3 className="text-center">
                <FormattedMessage
                  id="drafts_empty"
                  defaultMessage="You don't have any draft saved"
                />
              </h3>
            )}
            {!reloading &&
              _.map(sortedDraftPosts, draft => (
                <DraftRow
                  key={draft.id}
                  data={draft}
                  id={draft.id}
                  selected={selectedDrafts.includes(draft.id)}
                  pending={pendingDrafts.includes(draft.id)}
                  onCheck={this.handleCheck}
                />
              ))}
            {showModalDelete && (
              <DeleteDraftModal
                draftIds={selectedDrafts}
                onCancel={this.hideModal}
                onDelete={this.hideModal}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Drafts;
