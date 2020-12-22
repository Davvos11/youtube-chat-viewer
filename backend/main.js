const app = require("./express");

const PORT = 8000

app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`)
})