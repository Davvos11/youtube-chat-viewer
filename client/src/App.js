import './App.css';
import React, { Component } from 'react';
import {Button, Container} from "react-bootstrap";
import {Socket} from "./api/socket";
import {MessageComponent} from "./Message";

class App extends Component {
    constructor(props) {
        super(props);

        /**
         * @type {{messages: [Message], socket: Socket}}
         */
        this.state = {
            socket: null,
            messages: []
        }
    }

    loadSocket = () => {
        // IDs can be specified in the url, separated by /
        let chatIds = window.location.pathname.split('/')
        chatIds = chatIds.filter(value => value !== "")
        this.setState({socket: new Socket(chatIds, this.onMessages)})
    }

    /**
     * @param messages {[Message]}
     */
    onMessages = (messages) => {
        messages.forEach(message => {
            this.setState({messages: [...this.state.messages, message]})
        })
    }

    render() {
        return <div>
            {this.state.messages.map((value, index) => {
                return <MessageComponent key={index}
                                         authorName={value.author_name}
                                         authorIcon={value.author_icon}
                                         message={value.message}/>
            })}
        </div>
    }

    componentDidMount() {
        this.loadSocket()
    }
}

export default App;
