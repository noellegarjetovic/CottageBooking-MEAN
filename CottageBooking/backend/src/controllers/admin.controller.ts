import express from 'express'
import UserModel from '../models/users'
import bcrypt from 'bcryptjs';
import AdminModel from '../models/admins'
import CottageModel from '../models/cottages'


export class AdminController{
    

    loginAdmin=(req:express.Request,res:express.Response)=>{
        let username=req.body.korime
        let password=req.body.lozinka

        
       AdminModel.findOne({korime:username, lozinka:password}).then((user)=>{
            res.json(user)
        }).catch((err)=>{
            console.log(err)
            res.json(null)
        })
    }

    passwordChangeAdmin=(req:express.Request, res:express.Response)=>{
        let user=req.body.korime;
        let oldPass=req.body.staraL;
        let newPass=req.body.novaL

        let messagePass=""

        if(oldPass==newPass) messagePass+="Uneta je ista lozinka kao i ranije "
        if (!(/^[A-Za-z]/.test(newPass))) messagePass += "Lozinka mora poceti slovom\n";
        if (!(/^.{6,10}$/.test(newPass))) messagePass += "Lozinka mora imati izmedju 6 i 10 karaktera\n";
        if (!(/[A-Z]/.test(newPass))) messagePass += "Lozinka mora imati bar jedno veliko slovo\n";
        if (!(/([^a-z]*[a-z][^a-z]*){3}/.test(newPass))) messagePass += "Lozinka mora imati bar 3 mala slova\n";
        if (!(/[0-9]/.test(newPass))) messagePass += "Lozinka mora imati bar jedan broj\n";
        if (!(/[!@#$%^&*]/.test(newPass))) messagePass += "Lozinka mora imati bar jedan specijalni karakter\n";
        
        if(messagePass==""){
            AdminModel.findOne({korime:user,lozinka:oldPass}).then(u=>{
                if(u){
                    AdminModel.updateOne({korime:user},{$set:{lozinka:newPass}}).then(ok=>{
                        res.json({message:"Uspesno ste promenili lozinku"})
                    }).catch(err=>{
                        console.log(err)
                        res.json({message:"Neuspesna promena lozinke"})
                    })
                }else{
                    res.json({message:"Niste uneli ispravno korisnicko ime ili lozinku"})
                }
            }).catch(err=>{
                        console.log(err)
                        res.json({message:"Neuspesna promena lozinke"})
                    })
        }else{
            res.json({message:messagePass})
        }

    }

    getAllUsers=(req:express.Request,res:express.Response)=>{
       UserModel.find().then((user)=>{
            res.json(user)
        }).catch((err)=>{
            console.log(err)
            res.json(null)
        })
    }

    updateUserStatus=(req:express.Request,res:express.Response)=>{
        let user=req.body.korime
        let status=req.body.status
       UserModel.updateOne({korime:user},{status:status}).then((user)=>{
            res.json("uspesno")
        }).catch((err)=>{
            console.log(err)
            res.json("neuspesno")
        })
    }

    deleteUser=(req:express.Request,res:express.Response)=>{
        let user=req.body.korime
       UserModel.deleteOne({korime:user}).then((user)=>{
            res.json("uspesno")
        }).catch((err)=>{
            console.log(err)
            res.json("neuspesno")
        })
    }

    getAllCottages=(req:express.Request,res:express.Response)=>{
       CottageModel.find().then((cot)=>{
            res.json(cot)
        }).catch((err)=>{
            console.log(err)
            res.json(null)
        })
    }


    updateUser = (req: express.Request, res: express.Response) => {
        const userData = req.body.user;
        UserModel.findOne({ korime: userData.korime }).then(existingUser => {
            if (!existingUser) {
                return res.json({ message: "Korisnik nije pronađen" });
            }
            console.log(userData)
            if (userData.email && userData.email !== existingUser.email) {
                UserModel.findOne({ email: userData.email}).then(emailExists => {
                    if (emailExists) {
                        return res.json("Email je već u upotrebi kod drugog korisnika" );
                    }
                    const updateData = {
                        lozinka: userData.lozinka,
                        ime: userData.ime,
                        prezime: userData.prezime,
                        pol: userData.pol,
                        adresa: userData.adresa,
                        telefon: userData.telefon,
                        email: userData.email,
                        slika: userData.slika,
                        kartica: userData.kartica,
                        tip: userData.tip,
                        status: userData.status
                    };

                    UserModel.updateOne({ korime: userData.korime }, { $set: updateData }).then(result => {
                        res.json("Uspesno promenjeno")
                    });
                });
            }
            else{
                const updateData = {
                    lozinka: userData.lozinka,
                    ime: userData.ime,
                    prezime: userData.prezime,
                    pol: userData.pol,
                    adresa: userData.adresa,
                    telefon: userData.telefon,
                    email: userData.email,
                    slika: userData.slika,
                    kartica: userData.kartica,
                    tip: userData.tip,
                    status: userData.status
                };

                UserModel.updateOne({ korime: userData.korime }, { $set: updateData }).then(result => {
                    res.json("Uspesno promenjeno")
                });
            }
        })}


    blockCottage = (req: express.Request, res: express.Response) => {
        const cot = req.body.vikendica;
        const blockUntil = new Date();
        blockUntil.setHours(blockUntil.getHours() + 48); 
        CottageModel.updateOne({ naziv: cot }, {status: "blokirana",blokiranaDo: blockUntil.toISOString().slice(0,16)} ).then(result => {
            res.json("uspesno")
        }).catch(err => {
            console.log(err);
            res.json("neuspesno");
        });
    }
    unBlockCottage = (req: express.Request, res: express.Response) => {
        const cot = req.body.vikendica;
        CottageModel.updateOne({ naziv: cot }, {status: "aktivna",blokiranaDo: "" }).then(result => {
            res.json("uspesno")
        }).catch(err => {
            console.log(err);
            res.json("neuspesno");
        });
    }
}

