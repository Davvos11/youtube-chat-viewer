const app = require("./express");
const Chat = require("./youtube");
const http = require("http").createServer(app)
const io = require("socket.io")(http)

const PORT = 8000

io.on('connection', /**@param socket {Socket}*/(socket) => {
    console.log('Client connected')
    /** @type {[Chat]} */
    const chats = []

    socket.on('disconnect', () => {
        console.log('Client disconnected')
        chats.forEach((chat) => {
            chat.disable()
        })
    })

    socket.on('subscribe', (chatId) => {
        console.log(`Subscribing to ${chatId}`)
        const chat = new Chat(chatId, (messages => {
            messages.forEach(message => {
                socket.emit('chat message', message)
            })
        }))

        chat.start()
        chats.push(chat)
    })
})

http.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`)
})