const app = require("./express");
const ChatCache = require("./cache");
const {Message} = require("./youtube");
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
        if (chatId === 'test') {
            setInterval(() => {
                socket.emit('chat messages', [new Message('David Vos', new URL('https://yt3.ggpht.com/ytc/AAUvwniOt8Eugx2_f43r01rKxy5zHKve2QmmEDntXt2J7w=s88-c-k-c0xffffffff-no-rj-mo'),
                    `Dit is een test ${new Date().getSeconds()}`, Date.now())])
            }, 2000)
            return
        }

        const chat = cache.getChat(chatId, (messages => {
            socket.emit('chat messages', messages)
        }))

        chats.push(chat)
    })

})

http.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`)
})