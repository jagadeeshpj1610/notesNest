const express = require("express")
const connectToDb = require("./config/connecToDb")
require("dotenv").config()
const authRoutes = require("./routes/authRoutes")
const noteRoutes = require('./routes/noteRoutes')


const app = express()
app.use(express.json())

app.get("/", (req, res) => {
    res.send("server is running")
})

app.use('/api/auth', authRoutes)
app.use('/api/notes', noteRoutes)

connectToDb()

const PORT = 8000

app.listen(PORT, () => {
    console.log(`Server is Running Babe....~PJ Server on ${PORT}`);
})

module.exports = app