import React from 'react';
import { useRef, StyleSheet, Text, View, Button, TextInput, ScrollView, FlatList, RefreshControl, TouchableOpacity, KeyboardAvoidingView, Image} from 'react-native';
import CameraRoll from "@react-native-community/cameraroll";

import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';

import * as ImagePicker from 'expo-image-picker';

import * as MediaLibrary from 'expo-media-library';


const styles = StyleSheet.create({
	container:
	{
		backgroundColor: '#fff',
		alignItems: 'center',
		// justifyContent: 'center',
		padding: 20
	},
	topContainer: {
		flexDirection: 'row',
		padding: 0,
		color: 'blue'
	},
	backButton: {
		marginRight: 25
	},
	backButtonText: {
		color: 'blue',
		fontSize: 28
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
		maxHeight: 200,
		width: '90%',
		marginBottom: 5,
		borderColor: 'gray',
		borderWidth: 1,
		borderRadius: 10,
		fontSize: 16,
		padding: 10
	},
	
	scrollbox:
	{
		borderColor: 'black',
		borderWidth: 1,
		// width: 300,
		// height: 300,
		height: '84%',
		minWidth: '125%',
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
	},
	textInputContainer: {
		flexDirection: 'row',
		margin: 5,
		marginBottom: 0
	},
	singleMsgContainer: {

	},
	yourMsgContainer: {
		alignItems: 'flex-end'
	},
	otherMsgContainer: {
		alignItems: 'flex-start'
	},

	singleMsgText: {
		borderStyle: 'solid',
		borderWidth: 0,
		borderRadius: 10,
		padding: 10,
		margin: 7,
		overflow: 'hidden',
		maxWidth: '85%'
	},
	yourMsgText: {
		backgroundColor: '#77bbFF',
		borderBottomRightRadius: 0
	},
	otherMsgText: {
		backgroundColor: '#CFCFCF',
		borderBottomLeftRadius: 0
	},

	msgTextName: {
		fontSize: 16,
		fontWeight: 'bold'
	},

	msgTextBody: {
		fontSize: 16
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
				// {
				// 	key: '0',
				// 	userdisplayname: 'waiting',
				// 	text: 'waiting',
				// 	image: ''
				// }
			],
			currentGroup:
			{
				msgLength: 0,
				id: '',
				name: '',
				type: ''
			},
			msgText: '',
			uploadingImage: false,
			imgPreview: false,
			imgPreviewUri: '',
			firstLoad: true,
			messagesBelow: false
		};
		this.refreshing = false;
		//this.flatListRef = useRef;
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
		this.refs.scrollBoxRef.scrollToEnd();
	}
	componentWillUnmount()
	{
		clearInterval(this.state.newMsgInterval);
	}


	getUserInfo = async () =>
	{
		//gets the user info from the Express API and stores it in the state:
		let userInfo = await fetch(this.props.apiURL + '/users/' + this.props.userId, {
			method: 'GET',
			//body: JSON.stringify(data),
			headers:
			{
				"Content-Type": "application/json",
				"Authentication": this.props.sessionId
			}
		});
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
		let groupInfo = await fetch(this.props.apiURL + '/groups/' + this.props.currentGroup.id, {
			method: 'GET',
			//body: JSON.stringify(data),
			headers:
			{
				"Content-Type": "application/json",
				"Authentication": this.props.sessionId
			}
		});
		groupInfo = await groupInfo.json();
		this.setState(
		{
			currentGroup:
			{
				name: await groupInfo.name,
				id: await groupInfo.id,
				type: await groupInfo.type,
				msgLength: await groupInfo.msgLength,
				otherUserDisplayName: this.props.currentGroup.otherUserDisplayName
			}
		});
		const msgLength = await groupInfo.msgLength;
		if (oldMsgLength != msgLength || groupInfo.userMetaData.whetherChanged)
		{
			await this.getMessages();
		}
		//this.refs.flatListRef.scrollToIndex({animated: false, index: 0});
		//this.refs.scrollBoxRef.scrollToEnd();
		//this.flatListRef.scrollToOffset({offset: 500})
		//setTimeout(() => this.flatListRef.scrollToEnd(), 200)

		//this.refs.scrollBoxRef.scrollToEnd();
	}



	getMessages = async (howMany = 25, patchInPrevious = false) =>
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

		if (patchInPrevious)
		{
			endmsg = msgLength - this.state.messages.length;
			if (endmsg < 0)
			{
				//something is horribly wrong
				console.log("WHAT");
				return;
			}
		}

		const submitURL = await this.props.apiURL + '/groups/' + await this.state.currentGroup.id + '/messages/' + await startmsg + '/' + await endmsg;

		let recentMsgs = fetch(await submitURL, {
			method: 'GET',
			//body: JSON.stringify(data),
			headers:
			{
				"Content-Type": "application/json",
				"Authentication": this.props.sessionId
			}
		});
		
		//console.log(await recentMsgs);
		let test = await recentMsgs;
		recentMsgs = await test.json();

		let tempMsgs = [];

		for (let i = 0; i < recentMsgs.length; i++)
		{
			tempMsgs.push(
			{
				key: (i + (msgLength - howMany)).toString(),
				userdisplayname: recentMsgs[i].userdisplayname,
				text: recentMsgs[i].text,
				image: recentMsgs[i].image,
				userId: recentMsgs[i].userId
			});
		}
		
		if (patchInPrevious)
		{
			this.setState(
			{
				messages: [...tempMsgs, ...this.state.messages]
			});
		}
		else
		{
			this.setState(
			{
				messages: tempMsgs,
				uploadingImage: false
			});
		}

		//on first load, scroll to bottom:
		if (this.state.firstLoad == true)
		{
			setTimeout(()=>this.refs.scrollBoxRef.scrollToEnd(),500)
			this.setState(
			{
				firstLoad: false
			});
		}
		else
		{
			// this.setState(
			// {
			// 	messagesBelow: true
			// });
		}
		this.refreshing = false;
		//onContentSizeChange={()=>this.refs.scrollBoxRef.scrollToEnd()}
	}


	uploadImgAPICall = async (newMsg) =>
	{
		const submitURL = this.props.apiURL + '/groups/' + this.state.currentGroup.id + '/messages/uploadImage';

		let msgResponse = await fetch(submitURL, {
			method: 'POST',
			body: JSON.stringify(newMsg),
			headers:
		    {
		    	"Content-Type": "application/json",
		    	"Authentication": this.props.sessionId
		    }
		});
		msgResponse = await msgResponse.json();
		console.log(msgResponse);
		return msgResponse.id;
	}


	addMsgAPICall = async (newMsg) =>
	{
		console.log("Doing an API call for newMsg " + newMsg.text);

		const submitURL = this.props.apiURL + '/groups/' + this.state.currentGroup.id + '/messages';

		let msgResponse = await fetch(submitURL, {
			method: 'POST',
			body: JSON.stringify(newMsg),
			headers:
		    {
		    	"Content-Type": "application/json",
		    	"Authentication": this.props.sessionId
		    }
		});
		msgResponse = await msgResponse.json();
		console.log(msgResponse);
		return msgResponse.id;
	}


	addMsg = async () =>
	{
		//e.preventDefault();
		
		console.log("Attempting to add new message with text of " + this.state.msgText);

		if (this.state.msgText == '')
		{
			console.log("Message is empty; aborting...");
			return;
		}

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

		console.log("Constructed newMsg object; text is now " + newMsg.text);

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
		if (this.state.msgText != '') {this.addMsg();}
	}

	handleSelectImages = async () =>
	{
		const response = await ImagePicker.launchImageLibraryAsync(
		{
			allowsMultipleSelection: true,
			base64: true
		});
		console.log(await response);
		if (await response.cancelled)
		{
			//console.log('cancelled');
			return;
		}
		else
		{
			//console.log("NOT CANCELLED");
			//return;
			this.setState(
			{
				uploadingImage: true
			});
			this.refs.scrollBoxRef.scrollToEnd()
			this.uploadImgAPICall(
			{
				userId: this.props.userId,
				userdisplayname: this.state.displayname,
				text: '',
				image: 'data:image/jpeg;base64,' + await response.base64,
				video: '',
				url: '',
				id: ''
			});
		}
	}

	turnOffImgPreview = () =>
	{
		this.setState(
		{
			imgPreview: false,
			imgPreviewUri: ''
		});
	}

	turnOnImgPreview = (imgURI) =>
	{
		this.setState(
		{
			imgPreview: true,
			imgPreviewUri: imgURI
		});
	}

	scrollDown = () =>
	{
		this.setState(
		{
			messagesBelow: false
		});
		this.refs.scrollBoxRef.scrollToEnd()
	}

	getMoreMsgs = () =>
	{
		this.refreshing = true;
		console.log("getMoreMsgs");
		this.getMessages(this.state.messages.length + 5, true);
	}

	saveImgPreview = () =>
	{
		MediaLibrary.saveToLibraryAsync(this.state.imgPreviewUri);
	}

	msgTextToDisplay = (item) =>
	{
		switch (this.state.currentGroup.type)
		{
			case 'dm':
				return (
					<Text style={styles.msgTextBody}>{item.text}</Text>
				);
				break;
			default:
				return (
					<View>
						<Text style={styles.msgTextName}>{item.userdisplayname}:</Text>
						<Text style={styles.msgTextBody}>{item.text}</Text>
					</View>
				);
		}
	}

	render()
	{
		return(
			<View>
				<KeyboardAvoidingView style={styles.container} behavior="height">
					<View style={styles.topContainer}>
						<TouchableOpacity style={styles.backButton} onPress={this.props.exitChat}><Text style={styles.backButtonText}>{"<"}</Text></TouchableOpacity>
						{this.state.currentGroup.type == 'dm' ?
							<Text style={styles.h2} numberOfLines={1}>{this.state.currentGroup.otherUserDisplayName}</Text>
						:
							<Text style={styles.h2} numberOfLines={1}>{this.state.currentGroup.name}</Text>
						}
					</View>
					{this.state.imgPreview ?
						<View style={{width: '100%', height: '100%', padding: 0, alignItems: 'center'}}>
							<Image style={{width: 300, height: 400, margin: -10, resizeMode: 'contain'}} source={{uri: this.state.imgPreviewUri}}/>
							<View style={{flexDirection: 'row', alignItems: 'center', marginTop: 15}}>
								<Button title="Done" style={{margin: 15, color: 'blue', fontSize: 14}} onPress={this.turnOffImgPreview}></Button>
								<Button title="Save Image" style={{margin: 15, color: 'blue', fontSize: 14}} onPress={this.saveImgPreview}></Button>
							</View>
						</View> : null
					}
					<ScrollView
					refreshControl = {
						<RefreshControl refreshing={this.refreshing} onRefresh={this.getMoreMsgs}></RefreshControl>
					}
					ref='scrollBoxRef' style={styles.scrollbox}>
						{this.state.currentGroup.id != '' ?
							(
							this.state.messages.length != 0 ?
								<FlatList
									
									data={this.state.messages}
									renderItem=
									{
										({item}) =>
										{
											if (item.userId == this.props.userId)
											{
												return(
													<View style={[styles.singleMsgContainer, styles.yourMsgContainer]}>
														<View style={[styles.singleMsgText, styles.yourMsgText]}>
															{this.msgTextToDisplay(item)}
															{item.image && item.image != '' ?
																item.image == 'loading' ?
																	<Image style={{width: 150, height: 150, resizeMode: 'cover'}} source={{uri: this.props.apiURL + '/images/loading.gif'}}/>
																	:
																	<TouchableOpacity onPress={this.turnOnImgPreview.bind(null, item.image)}>
																		<Image style={{width: 150, height: 150, resizeMode: 'cover'}} source={{uri: item.image}}/>
																	</TouchableOpacity>
																:
																null
															}
														</View>
													</View>
												);
											}
											else
											{
												return(
													<View style={[styles.singleMsgContainer, styles.otherMsgContainer]}>
														<View style={[styles.singleMsgText, styles.otherMsgText]}>
															{this.msgTextToDisplay(item)}
															{item.image && item.image != '' ?
																item.image == 'loading' ?
																	<Image style={{width: 150, height: 150, resizeMode: 'cover'}} source={{uri: this.props.apiURL + '/images/loading.gif'}}/>
																	:
																	<TouchableOpacity onPress={this.turnOnImgPreview.bind(null, item.image)}>
																		<Image style={{width: 150, height: 150, resizeMode: 'cover'}} source={{uri: item.image}}/>
																	</TouchableOpacity>
																:
																null
															}
														</View>
														
													</View>
												);
											}
										}
									}
								/>
							:
								<Text>No messages yet</Text>
							)
						:
							<Text>Getting messages...</Text>
						}
						{this.state.uploadingImage ?
							<View style={[styles.singleMsgContainer, styles.yourMsgContainer]}>
								<View style={[styles.singleMsgText, styles.yourMsgText]}>
									<Image style={{width: 150, height: 150, resizeMode: 'cover'}} source={{uri: this.props.apiURL + '/images/loading.gif'}}/>
								</View>
							</View> : null
						}
						<Text style={styles.h3}></Text>
						<Text style={styles.h3}></Text>
					</ScrollView>
					{this.state.messagesBelow ?
						<TouchableOpacity onPress={this.scrollDown}>
							<Text>NEW MSGS BELOW</Text>
						</TouchableOpacity> : null
					}
					<View style={styles.textInputContainer}>
						<AutoGrowingTextInput style={styles.textbox} onChangeText={this.handleChangeText} value={this.state.msgText}></AutoGrowingTextInput>
						<Button style={styles.button} title='=>' onPress={this.handleSendButton}></Button>
						<Button style={styles.button} title='+' onPress={this.handleSelectImages}></Button>
					</View>
				</KeyboardAvoidingView>
			</View>
		);
	}

}

export default ChatBox;