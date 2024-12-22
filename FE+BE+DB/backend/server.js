import express from 'express';
import dotenv from 'dotenv';
const port = process.env.PORT || 5174 || 5175
const app = express()
import connectdb from './database.js';

connectdb()

app.get('/', (req, res) => {
    res.send('API is running...')
})

app.listen(port, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`)
})









// app.use('/api/goals', require('./routes/goalsExpress'))
// const colors = require('colors')
// //for accepting body data:-
// app.use(express.json())
// app.use(express.urlencoded({extended: false}))
