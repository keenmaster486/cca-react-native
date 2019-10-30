import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, ScrollView, TouchableOpacity} from 'react-native';


const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'center',
		padding: 10
	},
	singleItem: {
		borderStyle: 'solid',
		borderWidth: 1,
		borderColor: 'black',
		borderRadius: 10,
		padding: 5,
		marginLeft: 25,
		marginRight: 25
	}
});


class BottomMenu extends React.Component
{
	constructor()
	{
		super();
		this.state =
		{
			//STUFF
			
		};
	}

	

	render()
	{
		return(
			<View style={styles.container}>
				<TouchableOpacity style={styles.singleItem} onPress={this.props.changeBottomMenuSetting.bind(null, 0)}>
					<Text>Settings</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.singleItem} onPress={this.props.changeBottomMenuSetting.bind(null, 1)}>
					<Text>Chats</Text>
				</TouchableOpacity>
			</View>
		);
	}

}

export default BottomMenu;