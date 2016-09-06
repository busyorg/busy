var React = require('react');

module.exports = React.createClass({
	render: function(){
		return (
			<div>
				<div>
					<fieldset className="form-group">
						<label for="formGroupExampleInput">Title</label>
						<input autoFocus type="text" className="form-control form-control-lg" ref="title" />
					</fieldset>
					<fieldset className="form-group">
						<label for="formGroupExampleInput">Body</label>
						<textarea className="form-control form-control-lg" ref="body"></textarea>
					</fieldset>
					<fieldset className="form-group">
						<label for="formGroupExampleInput">Category</label>
						<input type="text" className="form-control form-control-lg" ref="category" />
					</fieldset>
				</div>
				<div>
					<a href="#">Cancel</a> <button type="submit" className="btn btn-primary btn-lg">Post</button>
				</div>
			</div>);
	}
});