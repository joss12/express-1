import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv'
dotenv.config()
import {router as products} from './routes/index'
const mongoose = require ('mongoose')


const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.get('/', express.static('server/public'));
app.use("/products", products)



mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log('Connected to database')
    app.listen(process.env.PORT, ()=>{
        console.log(`Server running on port  ${process.env.PORT}`)
    })
}).catch((error)=>{
    console.log(error)
})