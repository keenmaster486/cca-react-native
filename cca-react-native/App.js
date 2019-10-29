import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, ScrollView} from 'react-native';

import Login from './Login/Login';
import MainPage from './MainPage/MainPage';

import BottomMenu from './BottomMenu/BottomMenu';

import debugFlags from './debugFlags.js';

const styles = StyleSheet.create({
	globalContainer: {
		backgroundColor: '#fff',
		
		
		height: '97%',
		width: '100%',
		// margin: '5%',
		marginTop: '6%',
		borderStyle: debugFlags.borderStyle,
		borderWidth: debugFlags.borderWidth,
		borderColor: 'red'
	},
	mainContainer: {
		minHeight: '92%',
		maxHeight: '92%',
		minWidth: '100%',
		borderStyle: debugFlags.borderStyle,
		borderColor: 'cyan',
		borderWidth: debugFlags.borderWidth

	},
	bottomMenuContainer: {
		height: 50,
		width: '100%',
		borderTopWidth: 1,
		borderTopColor: 'black'
	},
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
			apiURL: 'http://192.168.0.175:9000',
			loggedIn: false,
			userId: '',
			sessionId: '',
			bottomMenuStatus: 'chats'
		}
	}

	componentDidMount()
	{
		this.getStatus();


		//TODO:

		//Here it should get the sessionId from the local storage,
		//and check it vs the api to see if it's still valid.
		//If it's valid, it should get the current session information,
		//and flip the loggedIn information to true!


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
			userId: response.userId,
			sessionId: response.sessionId
		});
	}

	whatToDisplay = () =>
	{
		switch (this.state.bottomMenuStatus)
		{
			case 'chats':
				return(
					<MainPage apiURL={this.state.apiURL} userId={this.state.userId} sessionId={this.state.sessionId}></MainPage>
				)
				break;
			case 'settings':
				return(
					<Text>Settings</Text>
				)
				break;
			default:
				return(
					<Text>Nothing here</Text>
				)
		}
	}


	render()
	{
		return (
				<View style={styles.globalContainer}>
					{this.state.loggedIn ?
						<View>
							<View style={styles.mainContainer}>
								{this.whatToDisplay()}
							</View>
							<View style={styles.bottomMenuContainer}>
								<BottomMenu></BottomMenu>
							</View>
						</View>
						:
						(
							<View style={styles.mainContainer}>
								<Login loginHappened={this.loginHappened} apiURL={this.state.apiURL} sessionId={this.state.sessionId}></Login>
							</View>
						)
					}
					
				</View>
		);
	}
}

export default App;


//<Text>Status: {this.state.status}</Text>