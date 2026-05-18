const express = require("express")
const connectToDb = require("./config/connecToDb")
require("dotenv").config()
const authRoutes = require("./routes/authRoutes")


const app = express()
app.use(express.json())

app.get("/", (req, res) => {
    res.send("server is running")
})

app.use('/api/auth', authRoutes)

connectToDb()

const PORT = 8000

app.listen(PORT, () => {
    console.log(`Server is Running Babe....~PJ Server on ${PORT}`);
})

module.exports = app