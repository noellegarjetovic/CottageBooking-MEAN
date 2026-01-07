import express, { Request, Response } from 'express';
import UserModel from '../models/users';
import AdminModel from '../models/admins';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import sizeOf from 'image-size';
import fs from 'fs';


const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });

export class UserController {

    login = (req: express.Request, res: express.Response) => {
        const username = req.body.korime;
        const password = req.body.lozinka;

        UserModel.findOne({ korime: username }).then(user => {
            if (!user) {
                res.json("Greška neispravno korisničko ime");
            } else {
                bcrypt.compare(password, user.lozinka, (err, isMatch) => {
                    if (err) {
                        console.log(err);
                        res.json("Greška došlo je do greške");
                        return;
                    }
                    if (!isMatch) {
                        res.json("Greška neispravna lozinka");
                    } else {
                        if(user.status=="cekanje")
                            res.json("Greška čeka se admin da odobri");
                        else if(user.status=="odbijen")
                            res.json("Greška korisnik je odbijen");
                        else
                            res.json(user.tip+" "+user.korime);
                    }
                });
            }
        }).catch(err => {
            console.log(err);
            res.json("Greška došlo je do greške");
        });
    }

    loginAdmin = (req: express.Request, res: express.Response) => {
        const username = req.body.korime;
        const password = req.body.lozinka;

        AdminModel.findOne({ korime: username, lozinka: password }).then(admin => {
            res.json(admin);
        }).catch(err => {
            console.log(err);
            res.json(null);
        });
    }

    
    register = (req: express.Request, res: express.Response) => {
        const {
            korime, lozinka, ime, prezime, pol, adresa, 
            telefon, email, kartica, tip, slika
        } = req.body;

     
        const salt = bcrypt.genSaltSync(11);
        const hashPass = bcrypt.hashSync(lozinka, salt);

        let finalImage;

        

        if (slika && slika !== '') {
            finalImage = slika;
        } else {
            try {
                const defaultImageBuffer = fs.readFileSync("src/uploads/default.jpg");
                finalImage = `data:image/png;base64,${defaultImageBuffer.toString('base64')}`;
            } catch (error) {
                console.error('Greška pri učitavanju default slike:', error);
                finalImage = '';
            }
        }

        const user = new UserModel({
            korime: korime,
            lozinka: hashPass,
            ime: ime,
            prezime: prezime,
            pol: pol,
            adresa: adresa,
            telefon: telefon,
            email: email,
            slika: finalImage, 
            kartica: kartica,
            tip: tip,
            status: 'cekanje'
        });

        
        user.save().then(ok => {
            res.json({ message: "Uspesna registracija" });
        }).catch(err => {
            console.log(err);
            if (err.code === 11000) {
                if (err.keyPattern && err.keyPattern.email) {
                    res.json({ message: "Email vec u upotrebi" });
                } else if (err.keyPattern && err.keyPattern.korime) {
                    res.json({ message: "Korisničko ime je već u upotrebi" });
                } else {
                    res.json({ message: "Korisničko ime ili email su već u upotrebi" });
                }
            } else {
                res.json({ message: "Neuspela registracija" });
            }
        });
    }

    passwordChange=(req:express.Request, res:express.Response)=>{
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
            const hashPass = bcrypt.hashSync(newPass, 11);
            UserModel.findOne({ korime: user }).then(u => {
            if (!u) {
                res.json({message:"Niste uneli ispravno korisnicko ime"});
            } else {
                bcrypt.compare(oldPass, u.lozinka, (err, isMatch) => {
                    if (err) {
                        console.log(err);
                        res.json({message:"Neuspesna promena lozinke"});
                        return;
                    }
                    if (!isMatch) {
                        res.json({message:"Neispravna lozinka"});
                    } else {
                        UserModel.updateOne({korime:user},{$set:{lozinka:hashPass}}).then(ok=>{
                            res.json({message:"Uspesno ste promenili lozinku"})
                        }).catch(err=>{
                            console.log(err)
                            res.json({message:"Neuspesna promena lozinke"})
                        })
                    }
                });
            }
        }).catch(err=>{
            console.log(err)
            res.json({message:"Neuspesna promena lozinke"})
        })
        }else{
            res.json({message:messagePass})
        }

    }

    

}
