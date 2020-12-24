const util = require("util")
const fs = require('fs')
const path = require("path")

const {google} = require('googleapis');

const readFile = util.promisify(fs.readFile);

const SECRET_FILE = path.join(path.dirname('.'), 'api.txt');
const POLLING_INTERVAL = 6000

/**
 * @returns {Promise<google.youtube>}
 */
async function createYoutube() {
    try {
        const secret = await readFile(SECRET_FILE, 'utf-8')

        return google.youtube({
            version: 'v3',
            auth: secret
        });
    } catch (e) {
        console.error(e)
        throw Error(`Failed to read ${SECRET_FILE}`)
    }


}

class Chat {
    /**
     * @param chatId {string}
     * @param onMessages {function([Message]): void}
     */
    constructor(chatId, onMessages) {
        this.chatId = chatId
        this.pageToken = undefined
        this.onMessagesFunctions = [onMessages]
        this.disabled = false
        this.youtube = undefined
        /** @type {[Message]} */
        this.messages = []
    }

    async getYoutube() {
        if (!this.youtube) {
            this.youtube = await createYoutube()
        }
        return this.youtube
    }

    disable() {
        this.disabled = true
    }

    /**
     * @param onMessages {function([Message]): void}
     */
    addOnMessages(onMessages) {
        this.onMessagesFunctions.push(onMessages)
    }

    start() {
        this.disabled = false
        this.requestMessages().then()
    }

    requestMessages = async () => {
        if (this.disabled) {
            return
        }

        const params = {
            "liveChatId": this.chatId,
            "part": [
                "snippet",
                "authorDetails"
            ],
            "pageToken": this.pageToken
        };

        // get the chat messages
        (await this.getYoutube()).liveChatMessages.list(params)
            .then(res => {
                console.log('youtube')
                // Save the "next page token" so next time we will only get new messages
                this.pageToken = res.data.nextPageToken

                // Set a timer to get new messages (according to the time specified by the api, or user set time)
                const nextRequest = Math.max(res.data.pollingIntervalMillis, POLLING_INTERVAL)
                setTimeout(this.requestMessages, nextRequest)

                const messages = []
                // Extract information of each new message
                res.data.items.forEach(item => {
                    messages.push(new Message(
                        item.authorDetails.displayName,
                        new URL(item.authorDetails.profileImageUrl),
                        item.snippet.displayMessage, //TODO check if is correct,
                        new Date(item.snippet.publishedAt).getTime()
                    ))
                })

                // Call callback for new messages
                this.onMessagesFunctions.forEach(fun => {
                    fun(messages)
                })
                // Save messages
                this.messages = [...this.messages, ...messages]
            })
            .catch(error => {
                console.error("Could not connect to chat");
                this.disable()
            });
    }
}

class Message {
    /**
     * @param author_name {string}
     * @param author_icon {URL}
     * @param message {string}
     * @param timestamp {number}
     */
    constructor(author_name, author_icon, message, timestamp) {
        this.author_name = author_name
        this.author_icon = author_icon
        this.message = message
        this.timestamp = timestamp
    }
}

module.exports.Chat = Chat
module.exports.Message = Message