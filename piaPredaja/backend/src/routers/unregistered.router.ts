import express from 'express'
import { UnregisteredController } from '../controllers/unregistered.controller'

const unregisteredRouter=express.Router()

unregisteredRouter.route('/getAllCottages').get(
    (req,res)=>new UnregisteredController().getAllCottages(req,res)
)

unregisteredRouter.route('/getNumberOwners').get(
    (req,res)=>new UnregisteredController().getNumberOwners(req,res)
)
unregisteredRouter.route('/getNumberTourists').get(
    (req,res)=>new UnregisteredController().getNumberTourists(req,res)
)
unregisteredRouter.route('/getNumberCottages').get(
    (req,res)=>new UnregisteredController().getNumberCottages(req,res)
)

unregisteredRouter.route('/get24h').get(
    (req,res)=>new UnregisteredController().get24h(req,res)
)
unregisteredRouter.route('/get7d').get(
    (req,res)=>new UnregisteredController().get7d(req,res)
)
unregisteredRouter.route('/get30d').get(
    (req,res)=>new UnregisteredController().get30d(req,res)
)



export default unregisteredRouter