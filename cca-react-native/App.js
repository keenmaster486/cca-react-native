import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, ScrollView} from 'react-native';

import Login from './Login/Login';
import MainPage from './MainPage/MainPage';


const styles = StyleSheet.create({
	container: {
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
		height: 500,
		padding: 30
	},
	textbox:
	{
		height: 40,
		width: 200,
		borderColor: 'gray',
		borderWidth: 1
	},
	scrollbox:
	{
		borderColor: 'black',
		borderWidth: 1,
		width: 300,
		height: 300,
		padding: 20
	}
});


class App extends React.Component
{
	
	constructor()
	{
		super();
		this.state =
		{
			status: 'waiting',
			apiURL: 'http://clean-chat-app.herokuapp.com',
			loggedIn: false,
			userId: ''
		}
	}

	componentDidMount()
	{
		this.getStatus();
	}

	getStatus = async() =>
	{
		let response = await fetch(this.state.apiURL + '/status');
		response = await response.json();

		this.setState(
		{
			status: response.text
		});

		//return response;
	}

	loginHappened = (response) =>
	{
		//do something
		this.setState(
		{
			status: 'login attempt success: ' + response.success,
			loggedIn: response.success,
			userId: response.userId
		});
	}


	render()
	{
		return (
				<View>
					{this.state.loggedIn ?
						(
							<MainPage apiURL={this.state.apiURL} userId={this.state.userId}></MainPage>
						)
						:
						(
							<Login loginHappened={this.loginHappened} apiURL={this.state.apiURL}></Login>
						)
					}
					<Text>Status: {this.state.status}</Text>
				</View>
		);
	}
}

export default App;