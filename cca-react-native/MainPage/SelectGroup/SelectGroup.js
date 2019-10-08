import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, ScrollView, FlatList, TouchableOpacity} from 'react-native';

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
	h3:
	{
		fontSize: 20
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
		width: 100
	},
	picker:
	{
		height: 40,
		width: 200,
		borderColor: 'gray',
		borderWidth: 1
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
				{
					key: 'No groups to join',
					id: 'none'
				},
			]
		};
	}

	componentDidMount()
	{
		this.getGroups();
	}


	getGroups = async () =>
	{
		//Get the groups from the API
		let response = await fetch(this.props.apiURL + '/groups/foruser/' + this.props.userId);
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
			groups: groups
		});
	}



	handleItemPress = (item) =>
	{
		//console.log(item);
		this.props.handleJoinGroup(item);
	}

	render()
	{
		return(
			<View style={styles.container}>
				<Text style={styles.h3}>Select a group to join</Text>
				<ScrollView style={styles.scrollbox}>
					<FlatList
						data={this.state.groups}
						renderItem=
						{
							({item}) => 
							<TouchableOpacity onPress={this.handleItemPress.bind(null, item)}>
								<Text style={styles.h2}>{item.key}</Text>
							</TouchableOpacity>
						}
					/>
				</ScrollView>
			</View>
		);
	}

}

export default SelectGroup;