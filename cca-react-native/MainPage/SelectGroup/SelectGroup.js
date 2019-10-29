import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, ScrollView, FlatList, TouchableOpacity} from 'react-native';


import debugFlags from '../../debugFlags.js';


const styles = StyleSheet.create({
	container:
	{
		backgroundColor: '#fff',
		height: '100%',
		width: '100%'
	},
	h1:
	{
		fontSize: 35
	},
	h2:
	{
		fontSize: 25
	},
	h3:
	{
		fontSize: 20
	},

	topTitle: {
		borderStyle: 'solid',
		borderBottomWidth: 1,
		borderBottomColor: 'black',
		padding: 10,
		flexDirection: 'row'
	},
	newChatButton: {
		marginLeft: '50%',
		margin: 5,
		borderStyle: 'solid',
		borderWidth: 1,
		borderColor: 'black',
		borderRadius: 10,
		padding: 5
	},

	groupTypePicker: {
		flexDirection: 'row',
		borderStyle: 'solid',
		borderTopWidth: 1,
		borderTopColor: 'black',
		justifyContent: 'center'
	},
	
	singleGroupType: {
		margin: 10,
		marginLeft: 20,
		marginRight: 20,
		borderStyle: 'solid',
		borderWidth: 1,
		borderColor: 'black',
		borderRadius: 10,
		padding: 10
	},

	scrollbox:
	{
		borderStyle: debugFlags.borderStyle,
		borderColor: 'black',
		borderWidth: debugFlags.borderWidth,
		height: '100%',
		width: '100%'
	},
	button:
	{
		height: 30,
		width: 100
	},
	picker:
	{
		height: 40,
		width: 200,
		borderColor: 'gray',
		borderWidth: 1
	},
	singleGroupItem: {
		borderStyle: 'solid',
		borderWidth: 0,
		borderColor: 'black',
		padding: 20,
		margin: 1,
		borderRadius: 5,
		
		borderBottomWidth: 1,
		borderBottomColor: 'grey'
	}
});





class SelectGroup extends React.Component
{
	constructor()
	{
		super();
		this.state =
		{
			//STUFF
			groups:
			[
				[ //public groups
					{
						key: 'No public groups here',
						id: 'none'
					}
				],
				[ //private groups
					{
						key: 'No private groups here',
						id: 'none'
					}
				],
				[ //DMs
					{
						key: 'No DMs here',
						id: 'none'
					}
				]
			],
			whichGroups: 0
		};
	}

	componentDidMount()
	{
		this.getPrivateGroups();
		this.getPublicGroups();
		this.getContacts();
	}


	getPrivateGroups = async () =>
	{
		//Get the groups from the API
		let response = await fetch(this.props.apiURL + '/groups/foruser/' + this.props.userId, {
			method: 'GET',
			//body: JSON.stringify(data),
			headers:
			{
				"Content-Type": "application/json",
				"Authentication": this.props.sessionId
			}
		});
		response = await response.json();

		//console.log(response);

		let groups = [];

		response.forEach((item, index) =>
		{
			groups.push(
			{
				key: item.name,
				id: item.id
			});
		});

		this.setState(
		{
			groups: [this.state.groups[0], await groups, this.state.groups[2]]
		});
	}

	getPublicGroups = async () =>
	{
		//Get the groups from the API
		let response = await fetch(this.props.apiURL + '/groups', {
			method: 'GET',
			//body: JSON.stringify(data),
			headers:
			{
				"Content-Type": "application/json",
				"Authentication": this.props.sessionId
			}
		});
		response = await response.json();

		//console.log(response);

		let groups = [];

		response.forEach((item, index) =>
		{
			groups.push(
			{
				key: item.name,
				id: item.id
			});
		});

		this.setState(
		{
			groups: [await groups, this.state.groups[1], this.state.groups[2]]
		});
	}


	getContacts = async () =>
	{
		let contacts = await fetch(this.props.apiURL + '/users/' + this.props.userId + '/contacts', {
			method: 'GET',
			//body: JSON.stringify(data),
			headers:
			{
				"Content-Type": "application/json",
				"Authentication": this.props.sessionId
			}
		});
		contacts = await contacts.json();

		contacts = await contacts.map((contact, index)=>
		{
			return(
			{
				key: contact.displayname,
				id: contact._id
			});
		});

		this.setState(
		{
			groups: [this.state.groups[0], this.state.groups[1], contacts]
		});
	}



	handleItemPress = (item) =>
	{
		//console.log(item);
		//this.props.handleJoinGroup(item);

		switch (this.state.whichGroups)
		{
			case 0:
				this.props.handleJoinGroup(item);
				break;
			case 1:
				this.props.handleJoinGroup(item);
				break;
			case 2:
				//something to join a DM here
				break;
		}

	}

	changeGroups = (whichGroups) =>
	{
		this.setState(
		{
			whichGroups: whichGroups
		});
	}

	render()
	{
		return(
			<View style={styles.container}>
				<View style={styles.topTitle}>
					<Text style={styles.h1}>Chats</Text>
					<TouchableOpacity style={styles.newChatButton}>
						<Text style={styles.h3}>New</Text>
					</TouchableOpacity>
				</View>
				<ScrollView style={styles.scrollbox}>
					<FlatList
						data={this.state.groups[this.state.whichGroups]}
						renderItem=
						{
							({item}) => 
							<TouchableOpacity style={styles.singleGroupItem} onPress={this.handleItemPress.bind(null, item)}>
								<Text style={styles.h2}>{item.key}</Text>
							</TouchableOpacity>
						}
					/>
				</ScrollView>
				<View style={styles.groupTypePicker}>
					<TouchableOpacity style={styles.singleGroupType} onPress={this.changeGroups.bind(null, 0)}>
						<Text style={styles.h3}>Public</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.singleGroupType} onPress={this.changeGroups.bind(null, 1)}>
						<Text style={styles.h3}>Private</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.singleGroupType} onPress={this.changeGroups.bind(null, 2)}>
						<Text style={styles.h3}>DMs</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}

}

export default SelectGroup;