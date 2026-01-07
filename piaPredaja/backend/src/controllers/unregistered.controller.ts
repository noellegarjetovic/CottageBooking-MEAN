import express from 'express'
import CottageModel from '../models/cottages'
import UserModel from '../models/users'
import ReservationModel from '../models/reservations'

export class UnregisteredController{
    getAllCottages=(req:express.Request, res:express.Response)=>{
        CottageModel.find({status:'aktivna'}).then(cottages=>{
            res.json(cottages)
        }).catch(err=>{
            console.log(err)
            res.json(null)
        })
    }

    getNumberOwners=(req:express.Request,res:express.Response)=>{
        UserModel.find({tip:"vlasnik",status:"odobren"}).then(owners=>{
            res.json(owners.length)
        }).catch(err=>{
            console.log(err)
            res.json(null)
        })
    }
    getNumberTourists=(req:express.Request,res:express.Response)=>{
        UserModel.countDocuments({tip:"turista",status:"odobren"}).then(num=>{
            res.json(num)
        }).catch(err=>{
            console.log(err)
            res.json(null)
        })
    }
    getNumberCottages=(req:express.Request,res:express.Response)=>{
        CottageModel.countDocuments({status:"aktivna"}).then(num=>{
            res.json(num)
        }).catch(err=>{
            console.log(err)
            res.json(null)
        })
    }
    get24h=(req:express.Request,res:express.Response)=>{
        const now = new Date();
        const last24h = new Date(now.getTime() - 24*60*60*1000);
        ReservationModel.countDocuments({$expr: {$gte: [{ $dateFromString: { dateString: "$datum" } },last24h]}}).then(num=>{
            res.json(num)
        }).catch(err=>{
            console.log(err)
            res.json(null)
        })
    }
    get7d=(req:express.Request,res:express.Response)=>{
        const now = new Date();
        const last7d = new Date(now.getTime() - 7*24*60*60*1000);
        ReservationModel.countDocuments({$expr: {$gte: [{ $dateFromString: { dateString: "$datum" } },last7d]}}).then(num=>{
            res.json(num)
        }).catch(err=>{
            console.log(err)
            res.json(null)
        })
    }
    get30d=(req:express.Request,res:express.Response)=>{
        const now = new Date();
        const last30d = new Date(now.getTime() - 30*24*60*60*1000);
        ReservationModel.countDocuments({$expr: {$gte: [{ $dateFromString: { dateString: "$datum" } },last30d]}}).then(num=>{
            res.json(num)
        }).catch(err=>{
            console.log(err)
            res.json(null)
        })
    }

    
}

