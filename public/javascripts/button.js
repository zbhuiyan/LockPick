var Button = React.createClass({
	render: function () {
		return (
			<a className='toolBarButton' onClick={this.props.setTool}>{this.props.tool}</a>
		);
	}
});

window.Button = Button;