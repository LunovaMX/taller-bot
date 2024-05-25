'use strict';

require('dotenv').config()
const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const cors = require("cors")
const PORT = process.env.PORT || 3000;

// create our express app
const app = express()
// database
const uri = process.env.MONGODB_CONNECTIONSTRING;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('MongoDB Connected…')
  })
  .catch(err => console.log(err))

// middleware
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// routes
app.get("/all", (req, res) => {
  res.send("SUCCESSFULL ")
})

app.get("/", (req, res) => {
  res.send("hello world")
})


// clients
const ClientsRoute = require('./routes/Clients')
app.use('/clients', ClientsRoute)

// start server ( Este siempre va al final.)
app.listen(PORT, () => {
  console.log(`listening at port: http://localhost:${PORT}`)
})