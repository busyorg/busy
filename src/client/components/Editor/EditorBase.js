import React from 'react';
import PropTypes from 'prop-types';
import { isValidImage } from '../../helpers/image';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default function editorBase(WrappedComponent) {
  class editorBaseComponent extends React.Component {
    static propTypes = {
      onImageInserted: PropTypes.func,
      onImageInvalid: PropTypes.func,
    };

    static defaultProps = {
      onImageInserted: () => {},
      onImageInvalid: () => {},
    };

    state = {
      isDisabledSubmit: false,
      imageUploading: false,
      dropzoneActive: false,
    };

    updateIsDisabledSubmit(isDisabledSubmit) {
      this.setState({ isDisabledSubmit });
    }

    updateImageUploading(imageUploading) {
      this.setState({ imageUploading });
    }

    updateDropzoneActive(dropzoneActive) {
      this.setState({ dropzoneActive });
    }
    handleDrop(callback, files) {
      if (files.length === 0) {
        this.setState({
          dropzoneActive: false,
        });
        return;
      }

      this.setState({
        dropzoneActive: false,
        imageUploading: true,
      });
      let callbacksCount = 0;
      Array.from(files).forEach((item) => {
        this.props.onImageInserted(
          item,
          (image, imageName) => {
            callbacksCount += 1;
            callback(image, imageName);
            if (callbacksCount === files.length) {
              this.setState({
                imageUploading: false,
              });
            }
          },
          () => {
            this.setState({
              imageUploading: false,
            });
          },
        );
      });
    }

    handleDragEnter() { this.updateDropzoneActive(true); }

    handleDragLeave() { this.updateDropzoneActive(false); }

    handleImageChange(callback, e) {
      if (e.target.files && e.target.files[0]) {
        if (!isValidImage(e.target.files[0])) {
          this.props.onImageInvalid();
          return;
        }

        this.setState({
          imageUploading: true,
        });
        this.props.onImageInserted(e.target.files[0], callback, () =>
          this.setState({
            imageUploading: false,
          }),
        );
        // Input reacts on value change, so if user selects the same file nothing will happen.
        // We have to reset its value, so if same image is selected it will emit onChange event.
        e.target.value = '';
      }
    }

    handlePastedImage(callback, e) {
      if (e.clipboardData && e.clipboardData.items) {
        const items = e.clipboardData.items;
        Array.from(items).forEach((item) => {
          if (item.kind === 'file') {
            e.preventDefault();
            const blob = item.getAsFile();
            if (!isValidImage(blob)) {
              this.props.onImageInvalid();
              return;
            }
            this.setState({
              imageUploading: true,
            });
            this.props.onImageInserted(blob, callback, () =>
              this.setState({
                imageUploading: false,
              }),
            );
          }
        });
      }
    }

    newProps = {
      handlePastedImage: this.handlePastedImage.bind(this),
      handleImageChange: this.handleImageChange.bind(this),
      handleDrop: this.handleDrop.bind(this),
      updateIsDisabledSubmit: this.updateIsDisabledSubmit.bind(this),
      updateImageUploading: this.updateImageUploading.bind(this),
      updateDropzoneActive: this.updateDropzoneActive.bind(this),
      handleDragLeave: this.handleDragLeave.bind(this),
      handleDragEnter: this.handleDragEnter.bind(this),
    };

    render() {
      return <WrappedComponent {...this.props} {...this.newProps} {...this.state} />;
    }
  }

  editorBaseComponent.displayName = `EditorBase(${getDisplayName(WrappedComponent)})`;

  return editorBaseComponent;
}
