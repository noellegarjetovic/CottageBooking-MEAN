import express from 'express'
import { UserController } from '../controllers/user.controller'
import { AdminController } from '../controllers/admin.controller'
import multer from 'multer'


const userRouter=express.Router()
const upload=multer()

userRouter.route('/login').post(
    (req,res)=>new UserController().login(req,res)
)

userRouter.route('/register').post(
    upload.single("slika"), 
    (req,res)=>new UserController().register(req,res) as any
)

userRouter.route('/loginAdmin').post(
    (req,res)=>new AdminController().loginAdmin(req,res)
)

userRouter.route('/passwordChange').post(
    (req,res)=>new UserController().passwordChange(req,res)
)
userRouter.route('/passwordChangeAdmin').post(
    (req,res)=>new AdminController().passwordChangeAdmin(req,res)
)





export default userRouter