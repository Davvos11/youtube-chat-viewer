const util = require("util")
const fs = require('fs')
const path = require("path")

const {google} = require('googleapis');

const readFile = util.promisify(fs.readFile);

const SECRET_FILE = path.join(path.dirname('.'), 'api.txt');


(async () => {
    try {
        const secret = await readFile(SECRET_FILE, 'utf-8')
    } catch (e) {
        console.error(e)
        throw Error(`Failed to read ${SECRET_FILE}`)
    }

    const youtube = google.youtube({
        version: 'v3',
        auth: secret
    });

    const params = {
        "liveChatId": 'Cg0KC1NuZUpTRkRMaXJVKicKGFVDWE5JWEhUVXA3NkJQNmVONXVtUl9DdxILU25lSlNGRExpclU',
        "part": [
            "snippet",
            "authorDetails"
        ]
    };

// get the blog details
    youtube.liveChatMessages.list(params)
        .then(res => {
            console.log(`The blog url is ${res.data}`);
        })
        .catch(error => {
            console.error(error);
        });
})()