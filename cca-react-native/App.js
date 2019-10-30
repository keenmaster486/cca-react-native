import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, ScrollView, AsyncStorage} from 'react-native';





import Login from './Login/Login';
import MainPage from './MainPage/MainPage';

import BottomMenu from './BottomMenu/BottomMenu';

import Settings from './Settings/Settings';

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
			apiURL: 'https://clean-chat-app.herokuapp.com',
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


		//Get the sessionId from local storage:

		this.getLocalSessionId();

	}

	getLocalSessionId = async () =>
	{
		try
		{
			const localSessionId = await AsyncStorage.getItem('sessionId');
			if (localSessionId)
			{
				console.log("Attempting to auto-login using localSessionId: " + localSessionId)
				//we got it!
				//automatically log back in by getting the session info from backend:
				let response = await fetch(this.state.apiURL + '/auth/sessionInfo', {
					method: 'GET',
					//body: JSON.stringify(data),
					headers:
					{
						"Content-Type": "application/json",
						"Authentication": localSessionId
					}
				});

				response = await response.json();

				if (await response.success)
				{
					console.log("Success! Autologged in");
					this.setState(
					{
						status: 'logged in from local sessionId',
						loggedIn: true,
						userId: response.userId,
						sessionId: localSessionId
					});
				}
			}
		}
		catch (err)
		{
			console.log(err);
		}
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

		//Set the sessionId in local storage:

		AsyncStorage.setItem('sessionId', response.sessionId);
	}

	logOut = () =>
	{
		console.log("LOGOUT");

		//destroy the locally stored session:
		AsyncStorage.removeItem('sessionId');	

		this.setState(
		{
			loggedIn: false,
			userId: '',
			sessionId: ''
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
					<Settings apiURL={this.state.apiURL} userId={this.state.userId} sessionId={this.state.sessionId} logOut={this.logOut}></Settings>
				)
				break;
			default:
				return(
					<Text>Nothing here</Text>
				)
		}
	}

	changeBottomMenuSetting = (setting) =>
	{
		switch (setting)
		{
			case 0:
				//go to settings page
				this.setState(
				{
					bottomMenuStatus: 'settings'
				})
				break;
			case 1:
				//go to chats page
				this.setState(
				{
					bottomMenuStatus: 'chats'
				});
				break;
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
								<BottomMenu changeBottomMenuSetting={this.changeBottomMenuSetting}></BottomMenu>
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