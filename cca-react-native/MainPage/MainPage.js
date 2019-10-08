import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, ScrollView} from 'react-native';


import SelectGroup from './SelectGroup/SelectGroup'
import ChatBox from './ChatBox/ChatBox'


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
				id: ''
			}
		};
	}

	handleJoinGroup = (item) =>
	{
		//do something
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


	render()
	{
		return(
			<View>
				{this.state.currentGroup.id == '' ?
					(
						<SelectGroup handleJoinGroup={this.handleJoinGroup} apiURL={this.props.apiURL} userId={this.props.userId}></SelectGroup>
					)
					:
					(
						<ChatBox apiURL={this.props.apiURL} currentGroup={this.state.currentGroup} userId={this.props.userId}></ChatBox>
					)
				}
			</View>
		);
	}

}

export default MainPage;