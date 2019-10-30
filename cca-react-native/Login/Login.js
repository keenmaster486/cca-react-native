import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, ScrollView} from 'react-native';

import debugFlags from '../debugFlags.js';

const styles = StyleSheet.create({
	container:
	{
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
		borderStyle: debugFlags.borderStyle,
		borderWidth: debugFlags.borderWidth,
		borderColor: 'green',

	},
	h1:
	{
		fontSize: 30
	},
	h2:
	{
		fontSize: 25
	},
	textbox:
	{
		height: 40,
		width: 200,
		borderColor: 'gray',
		borderWidth: 1,
		borderRadius: 10
	},
	scrollbox:
	{
		borderColor: 'black',
		borderWidth: 1,
		width: 300,
		height: 300,
		padding: 20
	},
	button:
	{
		height: 30,
		width: 100,
		backgroundColor: 'lightgrey'
	}
});


class Login extends React.Component
{
	constructor()
	{
		super();
		this.state =
		{
			//STUFF
			username: '',
			password: ''
		};
	}

	handleChangeUsername = (input) =>
	{
		this.setState(
		{
			username: input
		});
	}

	handleChangePassword = (input) =>
	{
		this.setState(
		{
			password: input
		});
	}

	handleLogin = async () =>
	{
		
		//Attempt a login:

		const submitURL = this.props.apiURL + '/auth/login';

		//console.log("trying on " + submitURL);

		//console.log("with " + this.state.username + " and " + this.state.password)

		let response = await fetch(submitURL,
		{
			method: 'POST',
			body: JSON.stringify(
			{
				username: this.state.username,
				password: this.state.password
			}),
			headers: {"Content-Type": "application/json"}
		});
		response = await response.json();
		console.log("Attempted login, got success: " + response.success);
		//console.log(response);
		this.props.loginHappened(response);
	}


	render()
	{
		return(
			<View style={styles.container}>
				<Text style={styles.h1}>CleanChat</Text>
				<Text style={styles.h2}>Log In</Text>
				<Text>Username:</Text>
				<TextInput style={styles.textbox} onChangeText={this.handleChangeUsername} value={this.state.username}></TextInput>
				<Text>Password:</Text>
				<TextInput style={styles.textbox} onChangeText={this.handleChangePassword} value={this.state.password} secureTextEntry={true}></TextInput>
				<Button style={styles.button} onPress={this.handleLogin} title='Submit'></Button>
			</View>
		);
	}

}

export default Login;