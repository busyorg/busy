import React from 'react';
import PropTypes from 'prop-types';
import './Avatar.less';
import { connect } from 'react-redux';
// import {
// 	getAuthenticatedUser,
// 	getUser
// } from '../reducers';

// @connect((state, ownProps) => ({
// 		user: getUser(state, ownProps.username),
// }))

class Avatar extends React.Component {
	
	constructor(props){
		super(props)
		this.getProfilePicture = this.getProfilePicture.bind(this)
		this.state = {
			profilePicture: undefined
		}
	}

	static propTypes = {
		username: PropTypes.any,
		size: PropTypes.number,
		// authenticatedUser: PropTypes.shape(),
	};
	
	static defaultProps = {
		size: 100,
	};

	componentDidMount(){
		this.getProfilePicture();
		var help;
		if(typeof window !== 'undefined' && window.wehelpjs ){
			help = window.wehelpjs
		} else if(typeof global !== 'undefined' && global.wehelpjs ){
			help = global.wehelpjs			
		}		
		help.api.getAccountsAsync([this.props.username])
		.then((res,err)=>{
			if(!err && res){
				let profile = res[0].json ? JSON.parse(res[0].json)['profile'] : undefined
				let profilePicture = profile ? profile['profile_image'] : undefined
				console.log('profilePicture', profilePicture)
				this.setState({
					profilePicture: profilePicture
				})
				this.forceUpdate()
			} else if(err){
				console.error('err', err)
			}
		})
		.catch(err=>{
			console.error('err', err)
		})
	};

	componentDidUpdate(){
		// this.getProfilePicture();
	};

	getProfilePicture = () => {
	};

  render(){
		let { username, size } = this.props;
		let { profilePicture } = this.state
		// let json = JSON.parse()
		let style = {
			minWidth: `${size}px`,
			width: `${size}px`,
			height: `${size}px`,
		};

		const url = getAvatarURL(username, size);
		
		if (username) {
			style = {
				...style,
				backgroundImage: `url(${profilePicture || url})`,
			};
		}
		return (
			<div className="Avatar" style={style} />
		)
	} 
};
	
export default Avatar;

export function getAvatarURL(username, size = 100) {
	return size > 64
		? `https://steemitimages.com/u/${username}/avatar`
		: `https://steemitimages.com/u/${username}/avatar/small`;
}