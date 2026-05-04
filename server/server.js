const express = require("express")
const connectToDb = require("./config/connecToDb")
require("dotenv").config()


const app = express()

app.get("/", (req, res) => {
    res.send("server is running")
})

connectToDb()

const PORT = 8000

app.listen(PORT, () => {
    console.log("Server is Running Babe....~PJ Server");
})

module.exports = app