import './App.css';
import React, { Component } from 'react';
import {Col} from "react-bootstrap";
import {Socket} from "./api/socket";
import {MessageComponent} from "./Message";
import style from "./message.module.css"

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
            const newList = [...this.state.messages, message]
            newList.sort(((a, b) => (a.timestamp > b.timestamp) ? 1 : -1))
            this.setState({messages: newList})
        })
    }

    render() {
        return <Col className={style.container}>
            {this.state.messages.map((value, index) => {
                return <MessageComponent key={index}
                                         authorName={value.author_name}
                                         authorIcon={value.author_icon}
                                         message={value.message}/>
            })}
        </Col>
    }

    componentDidMount() {
        this.loadSocket()
    }
}

export default App;
