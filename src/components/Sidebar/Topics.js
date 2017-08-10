import React from 'react';
import PropTypes from 'prop-types';
import Topic from '../Button/Topic';
import './Topics.less';

class Topics extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    favorite: PropTypes.bool,
    topics: PropTypes.arrayOf(PropTypes.string),
    maxItems: PropTypes.number,
  };

  static defaultProps = {
    favorite: false,
    topics: [],
    maxItems: 5,
  };

  constructor(props) {
    super(props);
    this.state = {
      showMore: false,
    };
  }

  changeVisibility(showMore) {
    this.setState({ showMore });
  }

  render() {
    const { title, topics, favorite, maxItems } = this.props;

    const displayedTopics = this.state.showMore ? topics : topics.slice(0, maxItems);

    return (
      <div className="Topics">
        <h4>
          {title}
        </h4>
        <ul className="Topics__list">
          {displayedTopics.map(topic =>
            (<li key={topic}>
              <Topic name={topic} favorite={favorite} />
            </li>),
          )}
        </ul>
        {topics.length > maxItems && !this.state.showMore
          ? <h5 role="presentation" onClick={() => this.changeVisibility(true)}>
              View more
          </h5>
          : null}
        {topics.length > maxItems && this.state.showMore
          ? <h5 role="presentation" onClick={() => this.changeVisibility(false)}>
              View less
          </h5>
          : null}
      </div>
    );
  }
}

export default Topics;
