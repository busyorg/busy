import PropTypes from 'prop-types';

export const draftType = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  lastUpdated: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  title: PropTypes.string,
  body: PropTypes.string,
});

export const draftArrayType = PropTypes.arrayOf(draftType);
