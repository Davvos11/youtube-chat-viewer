const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const bodyParser = require("body-parser")
const path = require("path")

const app = express()
app.use(morgan('dev'))
app.use(cors())
app.use(bodyParser.json())

// Serve the static files from the React app
app.use(express.static(path.join(path.dirname('..'), 'client/build')));

module.exports = app
