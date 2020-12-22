import io from "socket.io-client/dist/socket.io"

export class Socket {
    /**
     * @param chatIds {[string]}
     */
    constructor(chatIds) {
        // Connect to the websocket
        this.socket = io()

        // Send chat ids to listen to
        this.chatIds = chatIds
        this.chatIds.forEach((value => this.subscribeToChat(value)))

        // Listen for messages
        this.socket.on('chat message', (message) => {
            console.log(message)
        })
    }

    /**
     * @param chatId {string}
     */
    subscribeToChat = (chatId) => {
        this.socket.emit('subscribe', chatId)
    }
}