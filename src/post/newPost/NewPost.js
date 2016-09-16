import React from 'react';
import Header from './../../app/header';

export default function NewPost() {
  return (
    <div
      className="main-panel"
    >
      <Header menu="messages" />

      <div className="container">
        <div>
          <fieldset className="form-group">
            <label>Title</label>
            <input
              autoFocus
              type="text"
              className="form-control form-control-lg"
              ref="title" />
          </fieldset>

          <fieldset className="form-group">
            <label>Body</label>
            <textarea
              className="form-control form-control-lg"
              ref="body"
            />
          </fieldset>

          <fieldset className="form-group">
            <label>Category</label>
            <input
              type="text"
              className="form-control form-control-lg"
              ref="category"
            />
          </fieldset>
        </div>

        <div>
          <a href="#">
            Cancel
          </a>

          <button type="submit" className="btn btn-primary btn-lg">
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
