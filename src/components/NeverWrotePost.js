import React from 'react';

const styles = {
  main: {
    backgroundColor: '#485AAF',
    color: '#fff',
    maxWidth: 200,
    minHeight: 100,
    borderRadius: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1.4,
    flexDirection: 'column',
    fontFamily: '"Helvetica Neue", Helvetica, "Segoe UI", Arial, freesans, sans-serif',
  },

  button: {
    padding: '10px 15px',
    margin: '10px',
    backgroundColor: 'transparent',
    color: '#fff',
    outline: 'none',
    borderRadius: 5,
    borderStyle: 'solid',
    borderColor: '#fff'
  },
};

const NeverWrotePost = () =>
  <div style={styles.main}>
    Never wrote a post?
    <button
      style={styles.button}
      onClick={() => {
        console.log('onClick button TODO link to write page');
      }}
    >Start Now</button>
  </div>;

NeverWrotePost.propTypes = {};

export default NeverWrotePost;
