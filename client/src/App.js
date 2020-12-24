import './App.css';
import React, { Component } from 'react';
import {Col} from "react-bootstrap";
import {Socket} from "./api/socket";
import {MessageComponent} from "./Message";
import style from "./message.module.css"
import urlParse from 'url-parse'

class App extends Component {
    constructor(props) {
        super(props);

        /**
         * @type {{messages: [Message], socket: Socket, duration: number}}
         */
        this.state = {
            socket: null,
            messages: [],
            duration: 10000,
        }
    }

    /**
     * @param chatIds {[string]}
     */
    loadSocket = (chatIds) => {
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
        return <>
            <div className={style.top} />
            <Col className={style.container}>
                {this.state.messages.map((value, index) => {
                    return <MessageComponent key={index}
                                             authorName={value.author_name}
                                             authorIcon={value.author_icon}
                                             message={value.message}
                                             timestamp={value.timestamp}
                                             duration={this.duration}/>
                })}
            </Col>
            <div className={style.bottom} ref={(el) => {this.bottom = el}}/>
        </>
    }

    componentDidMount() {// IDs can be specified in the url,
        // Parse url
        const parser = new urlParse(window.location.href, true)
        // Get chat IDs
        let chatIds = parser.query['ids'].split(',')
        chatIds = chatIds.filter(value => value !== "")
        // Get display duration
        this.duration = Number(parser.query['duration'])

        this.loadSocket(chatIds)
        this.bottom.scrollIntoView({behavior: "smooth"})
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.bottom.scrollIntoView({behavior: "smooth"})
    }

}

export default App;
