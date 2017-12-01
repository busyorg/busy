import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import { FormattedMessage } from 'react-intl';
import Action from '../Button/Action';

const QuickPostEditorFooter = ({
  imageUploading,
  postCreationLoading,
  handleCreatePost,
  handleImageChange,
  postText,
  submittingPostText,
}) => (
  <div className="QuickPostEditor__footer">
    <div className="QuickPostEditor__imagebox">
      <input type="file" id="inputfile" accept="image/*" onChange={handleImageChange} />
      <label htmlFor="inputfile">
        {imageUploading ? <Icon type="loading" /> : <i className="iconfont icon-picture" />}
        {imageUploading &&
          <FormattedMessage id="image_uploading" defaultMessage="Uploading your image..." />}
      </label>
    </div>
    <Action
      primary
      small
      loading={postCreationLoading}
      disabled={postCreationLoading}
      text={postCreationLoading ? submittingPostText : postText}
      onClick={handleCreatePost}
    />
  </div>
);

QuickPostEditorFooter.propTypes = {
  imageUploading: PropTypes.bool,
  postCreationLoading: PropTypes.bool,
  handleCreatePost: PropTypes.func,
  handleImageChange: PropTypes.func,
  postText: PropTypes.string,
  submittingPostText: PropTypes.string,
};

QuickPostEditorFooter.defaultProps = {
  imageUploading: false,
  postCreationLoading: false,
  handleCreatePost: () => {},
  handleImageChange: () => {},
  postText: 'Post',
  submittingPostText: 'Submitting',
};

export default QuickPostEditorFooter;
