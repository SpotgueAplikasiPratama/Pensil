import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import SocketIOClient from 'socket.io-client';
// import { environment } from '../config/environment';

export default class SocketTestScreen extends React.Component {
	
	constructor(props) {
		super(props);

        const socket = SocketIOClient("ws://localhost:3000");

        socket.on("connect", () => {
          // either with send()
          socket.send("Hello!");
        
          // or with emit() and custom event names
          socket.emit("salutations", "Hello!", { "mr": "john" }, Uint8Array.from([1, 2, 3, 4]));
        });
        
        // handle the event sent with socket.send()
        socket.on("message", data => {
          console.log(data);
        });
        
        // handle the event sent with socket.emit()
        socket.on("greetings", (elem1, elem2, elem3) => {
          console.log(elem1, elem2, elem3);
        });

        // 	this.socket = SocketIOClient(environment.serverUrl); // replace 'environment.serverUrl' with your server url
	// 	this.socket.emit('channel1', 'Hi server'); // emits 'hi server' to your server
		
	// 	// Listens to channel2 and display the data recieved
    // this.socket.on('channel2', (data) => {
    //     console.log('Data recieved from server', data); //this will console 'channel 2'
    //   });
    }
	
	clicked = () => {
		
		const dataObj = {
			action: 'click'
		};
		
		this.socket.emit('channel2', dataObj);
	}

    render() {
        return(
            <View>
    					<Text style={styles.text}> Socket.io with react native </Text>
              <TouchableOpacity onPress={() => this.clicked}> Click </TouchableOpacity>
					</View>
        );
    }
}