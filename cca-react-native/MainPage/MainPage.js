import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, ScrollView} from 'react-native';


import SelectGroup from './SelectGroup/SelectGroup'
import ChatBox from './ChatBox/ChatBox'

import debugFlags from '../debugFlags.js';

const styles = StyleSheet.create({
	container:
	{
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 30
	},
	h1:
	{
		fontSize: 35
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
		borderWidth: 1
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


class MainPage extends React.Component
{
	constructor()
	{
		super();
		this.state =
		{
			//STUFF
			currentGroup:
			{
				msgLength: 0,
				name: '',
				id: '',
				otherUserDisplayName: ''
			}
		};
	}

	handleJoinGroup = (item) =>
	{
		//do something
		console.log("Attempting to enter group with id of " + item.id);
		if (item.id == 'none') {return;}
		this.setState(
		{
			status: 'group join id: ' + item.id,
			currentGroup:
			{
				msgLength: 0,
				name: item.key,
				id: item.id
			}
		});
	}

	handleJoinDM = async (item) =>
	{
		
		if (item.id == 'none') {return;}
		//Get the group id:
		
		console.log(`Joining a DM group between two users: ${this.props.userId} and ${item.id}`);
		
		let response = await fetch(this.props.apiURL + '/groups/dms/' + this.props.userId + '/' + item.id, {
			method: 'GET',
			//body: JSON.stringify(data),
			headers:
			{
				"Content-Type": "application/json",
				"Authentication": this.props.sessionId
			}
		});

		response = await response.json();

		//get the other user's display name:

		let response2 = await fetch(this.props.apiURL + '/users/' + item.id, {
			method: 'GET',
			//body: JSON.stringify(data),
			headers:
			{
				"Content-Type": "application/json",
				"Authentication": this.props.sessionId
			}
		});

		response2 = await response2.json();

		//console.log(await response2);

		this.setState(
		{
			status: 'group join id: ' + response._id,
			currentGroup:
			{
				msgLength: 0,
				name: response.name,
				id: response._id,
				otherUserDisplayName: response2.displayname
			}
		});
		//console.log(this.state);
	}

	exitChat = () =>
	{
		this.setState(
		{
			currentGroup:
			{
				msgLength: 0,
				name: '',
				id: '',
				otherUserDisplayName: ''
			}
		})
	}

	render()
	{
		return(
			<View>
				{this.state.currentGroup.id == '' ?
					(
						<SelectGroup handleJoinGroup={this.handleJoinGroup} handleJoinDM={this.handleJoinDM} apiURL={this.props.apiURL} userId={this.props.userId} sessionId={this.props.sessionId}></SelectGroup>
					)
					:
					(
						<ChatBox exitChat={this.exitChat} apiURL={this.props.apiURL} currentGroup={this.state.currentGroup} userId={this.props.userId} sessionId={this.props.sessionId}></ChatBox>
					)
				}
			</View>
		);
	}

}

export default MainPage;