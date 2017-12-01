import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';
import { Icon } from 'antd';
import Action from '../Button/Action';

const QuickPostEditorFooter = ({
  currentImages,
  imageUploading,
  postCreationLoading,
  handleCreatePost,
  handleImageChange,
  postText,
  submittingPostText,
  onRemoveImage,
}) => (
  <div className="QuickPostEditor__footer">
    <div className="QuickPostEditor__imagebox">
      {_.map(currentImages, image => (
        <div className="QuickPostEditor__imagebox__preview__image" key={image.id}>
          <div
            className="QuickPostEditor__imagebox__remove"
            onClick={() => onRemoveImage(image)}
            role="presentation"
          >
            <i className="iconfont icon-delete_fill QuickPostEditor__imagebox__remove__icon" />
          </div>
          <img src={image.src} width="38" height="38" alt={image.src} />
        </div>
      ))}
      <input type="file" id="inputfile" accept="image/*" onChange={handleImageChange} />
      <label htmlFor="inputfile">
        {imageUploading
          ? <div className="QuickPostEditor__imagebox__loading"><Icon type="loading" /></div>
          : <div
            className={classNames({
              QuickPostEditor__imagebox__upload: !_.isEmpty(currentImages),
            })}
          >
            <i
              className={classNames('iconfont QuickPostEditor__imagebox__upload__icon', {
                'icon-picture': _.isEmpty(currentImages),
                'icon-add': !_.isEmpty(currentImages),
              })}
            />
          </div>}
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
  currentImages: PropTypes.arrayOf(PropTypes.shape()),
  imageUploading: PropTypes.bool,
  postCreationLoading: PropTypes.bool,
  handleCreatePost: PropTypes.func,
  handleImageChange: PropTypes.func,
  onRemoveImage: PropTypes.func,
  postText: PropTypes.string,
  submittingPostText: PropTypes.string,
};

QuickPostEditorFooter.defaultProps = {
  currentImages: [],
  imageUploading: false,
  postCreationLoading: false,
  handleCreatePost: () => {},
  handleImageChange: () => {},
  onRemoveImage: () => {},
  postText: 'Post',
  submittingPostText: 'Submitting',
};

export default QuickPostEditorFooter;
