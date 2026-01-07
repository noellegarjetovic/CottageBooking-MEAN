import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import userRouter from './routers/users.router'
import unregisteredRouter from './routers/unregistered.router'
import touristRouter from './routers/tourists.router'
import ownerRouter from './routers/owner.router'
import adminRouter from './routers/admin.router'


const app = express()
app.use(cors())
app.use(express.json())
mongoose.connect('mongodb://localhost:27017/projekat')
const conn=mongoose.connection
conn.once('open',()=>{
    console.log("DB ok")
})

const router=express.Router()

app.use('/users', userRouter); 
app.use('/unregistered',unregisteredRouter)
app.use('/tourist',touristRouter)
app.use('/owner',ownerRouter)
app.use('/admin',adminRouter)


app.listen(4000, ()=>console.log('Express running on port 4000'))


