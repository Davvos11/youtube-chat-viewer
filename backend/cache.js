const {Chat} = require("./youtube");

class ChatCache {
    constructor() {
        /** @type {Object.<string, Chat>} */
        this.chats = {}
        /** @type {Object.<string, number>} */
        this.chatUsageCount = {}
    }

    getChat(chatId, onMessages) {
        if (chatId in this.chats) {
            const chat = this.chats[chatId]
            // Add onMessages function to existing Chat object
            chat.addOnMessages(onMessages)
            // Call onMessages on the already cached messages
            onMessages(chat.messages)
            // If disabled, enable again
            if (chat.disabled) {
                chat.start()
            }
            // Increase counter
            this.chatUsageCount[chatId]++
            return chat
        } else {
            // Create new Chat object
            const newChat = new Chat(chatId, onMessages)
            // Start listening
            newChat.start()
            this.chats[chatId] = newChat
            // Create counter
            this.chatUsageCount[chatId] = 1
            return newChat
        }
    }

    unsubscribeChat(chatId) {
        if (chatId in this.chatUsageCount) {
            this.chatUsageCount[chatId]--
            if (this.chatUsageCount[chatId] <= 0) {
                this.chats[chatId].disable()
            }
        }
    }
}

module.exports = ChatCache