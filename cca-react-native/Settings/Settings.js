import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, ScrollView, TouchableOpacity} from 'react-native';

import debugFlags from '../debugFlags.js';

const styles = StyleSheet.create({
	h1: {
		fontSize: 35
	},
	h2: {
		fontSize: 25
	},
	h3: {
		fontSize: 20
	},
	container: {
		padding: 20,
		alignItems: 'center'
	},
	singleItem: {
		borderStyle: 'solid',
		borderWidth: 1,
		borderColor: 'black',
		borderRadius: 10,
		padding: 10,
		margin: 10
	}
});


class Settings extends React.Component
{
	constructor()
	{
		super();
		this.state =
		{
			//STUFF
			username: '',
			displayname: ''
		};
	}


	componentDidMount()
	{
		this.getUserInfo();
	}


	getUserInfo = async () =>
	{
		//gets the user info from the Express API and stores it in the state:
		let userInfo = await fetch(this.props.apiURL + '/users/' + this.props.userId, {
			method: 'GET',
			//body: JSON.stringify(data),
			headers:
			{
				"Content-Type": "application/json",
				"Authentication": this.props.sessionId
			}
		});
		userInfo = await userInfo.json();
		this.setState(
		{
			username: await userInfo.username,
			displayname: await userInfo.displayname
		});
		console.log("Got user info: " + this.state.username + " " + this.state.displayname);
	}


	render()
	{
		return(
			<View style={styles.container}>
				<Text style={styles.h3}>Your username:</Text>
				<Text style={styles.h3}>{this.state.username}</Text>
				<Text style={styles.h3}>Your display name:</Text>
				<Text style={styles.h3}>{this.state.displayname}</Text>
				<TouchableOpacity style={styles.singleItem} onPress={this.props.logOut}>
					<Text>Logout</Text>
				</TouchableOpacity>
			</View>
		);
	}

}

export default Settings;