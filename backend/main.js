const app = require("./express");
const Chat = require("./youtube");
const ChatCache = require("./cache");
const http = require("http").createServer(app)
const io = require("socket.io")(http)

const PORT = 8000

const cache = new ChatCache()

io.on('connection', /**@param socket {Socket}*/(socket) => {
    console.log('Client connected')
    /** @type {[Chat]} */
    const chats = []

    socket.on('disconnect', () => {
        console.log('Client disconnected')
        chats.forEach((chat) => {
            cache.unsubscribeChat(chat.chatId)
        })
    })

    socket.on('subscribe', (chatId) => {
        console.log(`Subscribing to ${chatId}`)
        const chat = cache.getChat(chatId, (messages => {
            socket.emit('chat messages', messages)
        }))

        chats.push(chat)
    })
})

http.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`)
})