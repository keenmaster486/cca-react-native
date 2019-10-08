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
		width: 100,
		backgroundColor: 'lightgrey'
	},
	picker:
	{
		height: 40,
		width: 200,
		borderColor: 'gray',
		borderWidth: 1
	}
});





class ChatBox extends React.Component
{
	constructor()
	{
		super();
		this.state =
		{
			//STUFF
			messages:
			[
				{
					key: '0',
					userdisplayname: 'waiting',
					text: 'waiting',
					image: ''
				}
			],
			currentGroup:
			{
				msgLength: 0,
				id: '',
				name: ''
			},
			msgText: ''
		};
	}


	componentDidMount()
	{
		//set up an interval timer to get new messages:
		const newMsgInterval = setInterval(this.getGroupInfo, 1000);
		this.setState(
		{
			newMsgInterval: newMsgInterval
		});

		this.getUserInfo();
	}
	componentWillUnmount()
	{
		clearInterval(this.state.newMsgInterval);
	}


	getUserInfo = async () =>
	{
		//gets the user info from the Express API and stores it in the state:
		let userInfo = await fetch(this.props.apiURL + '/users/' + this.props.userId);
		userInfo = await userInfo.json();
		this.setState(
		{
			username: await userInfo.username,
			displayname: await userInfo.displayname
		});
		console.log("Got user info: " + this.state.username + " " + this.state.displayname);
	}



	getGroupInfo = async () =>
	{
		//don't do anything if we're in the global chatroom:
		//if (this.props.currentGroup.name == 'global') {return;}

		const oldMsgLength = this.state.currentGroup.msgLength;

		//gets the group info from the Express API and stores it in the state:
		let groupInfo = await fetch(this.props.apiURL + '/groups/' + this.props.currentGroup.id);
		groupInfo = await groupInfo.json();
		this.setState(
		{
			currentGroup:
			{
				name: await groupInfo.name,
				id: await groupInfo.id,
				msgLength: await groupInfo.msgLength
			}
		});
		const msgLength = await groupInfo.msgLength;
		if (oldMsgLength != msgLength)
		{
			await this.getMessages();
		}
	}



	getMessages = async (howMany = 25) =>
	{
		//gets the most recent messages from the Express API!!!!
		//and then stores them in the state's messages array
		
		//we'll have to have re-gotten the group info in order to have the most recent msgLength!

		const msgLength = await this.state.currentGroup.msgLength;

		//let startmsg = await this.state.currentGroup.msgLength - 5;
		//if (startmsg < 0) {startmsg = 0;}
		//let startmsg = 0;
		
		let startmsg = msgLength - howMany;
		if (startmsg < 0) {startmsg = 0;}


		let endmsg = msgLength;

		const submitURL = await this.props.apiURL + '/groups/' + await this.state.currentGroup.id + '/messages/' + await startmsg + '/' + await endmsg;

		let recentMsgs = fetch(await submitURL);
		
		//console.log(await recentMsgs);
		let test = await recentMsgs;
		recentMsgs = await test.json();

		let tempMsgs = [];

		for (let i = 0; i < recentMsgs.length; i++)
		{
			tempMsgs.push(
			{
				key: i.toString(),
				userdisplayname: recentMsgs[i].userdisplayname,
				text: recentMsgs[i].text,
				image: recentMsgs[i].image
			});
		}

		this.setState(
		{
			messages: tempMsgs
		});
	}



	addMsgAPICall = async (newMsg) =>
	{
		const submitURL = this.props.apiURL + '/groups/' + this.state.currentGroup.id + '/messages';

		let msgResponse = await fetch(submitURL, {
			method: 'POST',
			body: JSON.stringify(newMsg),
			headers:
		    {"Content-Type": "application/json",}
		});
		msgResponse = await msgResponse.json();
		console.log(msgResponse);
		return msgResponse.id;
	}


	addMsg = async () =>
	{
		//e.preventDefault();
		if (this.state.msgText == '' || this.state.msgImage == '') {return;}

		const msgText = this.state.msgText;
		let msgImage = null;
		if (this.state.msgImage) {msgImage = this.state.msgImage;}
		
		const newMsg =
		{
			userId: this.props.userId,
			userdisplayname: this.state.displayname,
			text: msgText,
			image: msgImage,
			video: '',
			url: '',
			id: ''
		};

		//Right here is where we should make a POST request to
		//the Express API to add the message to the current
		//group's message array


		//if (this.props.currentGroup.name == 'global')
		//{
			//do something for global
		//}
		//else
		//{
			//Express API call to add message to group!
			newMsg.id = await this.addMsgAPICall(newMsg);
			console.log("newMsg.id: " + newMsg.id);
		//}

		this.setState(
		{
			msgText: '',
			msgImage: '',
			//messages: [...this.state.messages, await newMsg]
		});



		//document.getElementById('msgtextbox').value = '';
		//document.getElementById('imgtextbox').value = '';
	}



	handleChangeText = (input) =>
	{
		this.setState(
		{
			msgText: input
		});
	}

	handleSendButton = () =>
	{
		this.addMsg();
	}

	render()
	{
		return(
			<View style={styles.container}>
				<Text style={styles.h3}>{this.state.currentGroup.name}</Text>
				
				<TextInput style={styles.textbox} onChangeText={this.handleChangeText} value={this.state.msgText}></TextInput>
				<Button style={styles.button} title='Send' onPress={this.handleSendButton}></Button>

				<ScrollView style={styles.scrollbox}>
					<FlatList
						data={this.state.messages}
						renderItem=
						{
							({item}) =>
							<Text style={styles.h3}>{item.userdisplayname}: {item.text}</Text>
						}
					/>
					<Text style={styles.h3}></Text>
					<Text style={styles.h3}></Text>
				</ScrollView>
				
			</View>
		);
	}

}

export default ChatBox;