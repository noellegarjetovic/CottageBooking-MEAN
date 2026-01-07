import express from "express";
import UserModel from '../models/users'
import CottageModel from '../models/cottages'
import ReservationModel from '../models/reservations'
import fs from 'fs';

export class TouristController{


    updateUser = (req: express.Request, res: express.Response) => {
        const { korime, userData } = req.body;
        const { ime, prezime, adresa, telefon, email, kartica, slika } = userData;

        UserModel.findOne({email: email,korime: { $ne: korime }}).then(data => {
            if (data) {
                return res.json("Email vec u upotrebi" );
            }
            const updateData: any = {
                ime: ime,
                prezime: prezime,
                adresa: adresa,
                telefon: telefon,
                email: email,
                kartica: kartica
            };

            if (slika && slika !== '') {
                updateData.slika = slika;
            }

            UserModel.updateOne({ korime: korime },{ $set: updateData }).then(data => {
                if (data) {
                    res.json("Korisnik uspešno ažuriran");
                } else {
                    res.json("Korisnik nije pronađen" );
                }
            }).catch(err => {
                console.log(err);
                res.json("Korisnik nije uspešno ažuriran")
            });
        }).catch(err => {
            console.log(err);
            res.json("Greška pri proveri emaila" );
        });
    };



    getUser(req: express.Request, res: express.Response) {
    let user = req.body.korime;

    UserModel.findOne({ korime: user }).then(data => {
            if (data) {
                res.json(data);
            } else {
                res.json(null);
            }
        })
        .catch(err => {
            console.log(err);
            res.json(null);
        });
    }

    getCottages(req: express.Request, res: express.Response) {
        CottageModel.find({ status: 'aktivna' }).then(data => 
            res.json(data)).catch(err => {
                console.log(err);
            });
    }

    getCottage(req:express.Request,res:express.Response){
        let naz=req.body.naziv
        CottageModel.findOne({naziv:naz, status:'aktivna'}).then(data=>{
            res.json(data)
        }).catch(err=>{
            console.log(err)
            res.json(null)
        })
    }

    getOwner(req:express.Request,res:express.Response){
        let kor=req.body.korime
        UserModel.findOne({korime:kor}).then(data=>{
            res.json(data)
        }).catch(err=>{
            console.log(err)
            res.json(null)
        })
    }

    getMyReservations(req:express.Request,res:express.Response){
        let kor=req.body.korime
        ReservationModel.find({turista:kor}).then(data=>{
            res.json(data)
        }).catch(err=>{
            console.log(err)
            res.json(null)
        })
    }

    submitReservationRating(req:express.Request,res:express.Response){
        let vikend=req.body.vikend
        let datumP=req.body.datum
        let koment=req.body.comm
        let ocena=req.body.ocena
        let korime=req.body.korime
        let ocene;
        let komentari;
        CottageModel.findOne({naziv:vikend}).then(data=>{
            if(data){
                data.ocene.push({korime:korime,ocena:ocena})
                data.komentari.push({korime:korime,tekst:koment})
                data.save()
            }
        }).catch(err=>{
            console.log(err)
        })
        ReservationModel.updateOne({vikendica:vikend, datumPocetka:datumP},{ocena:ocena,komentar:koment}).then(()=>
            res.json("uspesno")
        ).catch(err=>{
            console.log(err)
            res.json("neuspesno")
        })
    }

    deleteReservation(req:express.Request,res:express.Response){
        let vikend=req.body.vikendica
        let datumP=req.body.datum
        ReservationModel.deleteOne({vikendica:vikend, datumPocetka:datumP}).then(()=>{
            res.json("uspesno")
        }).catch((err)=>{
            console.log(err)
            res.json("neuspesno")
        })
    }

    checkReservationOverlap = (req: express.Request, res: express.Response) => {
    const { vikendica, datumPocetka, datumKraja } = req.body;


    const pocetak = `${datumPocetka}T14:00:00.000Z`;  // Dolazak u 14:00
    const kraj = `${datumKraja}T10:00:00.000Z`; 

    ReservationModel.find({
        vikendica: vikendica,
        $or: [
            {
                // Rezervacija koja počinje unutar trajanja nove rezervacije
                $and: [
                    { datumPocetka: { $gte: pocetak } },
                    { datumPocetka: { $lt: kraj } }
                ]
            },
            {
                // Rezervacija koja se završava unutar trajanja nove rezervacije
                $and: [
                    { datumKraja: { $gt: pocetak } },
                    { datumKraja: { $lte: kraj } }
                ]
            },
            {
                // Rezervacija koja traje tokom cele nove rezervacije (počinje pre i završava posle)
                $and: [
                    { datumPocetka: { $lte: pocetak } },
                    { datumKraja: { $gte: kraj } }
                ]
            },
            {
                // Rezervacija koja je unutar nove rezervacije (počinje posle i završava pre)
                $and: [
                    { datumPocetka: { $gte: pocetak } },
                    { datumKraja: { $lte: kraj } }
                ]
            }
        ]
    })
    .then(existingReservations => {
        if (existingReservations.length > 0) {
            res.json(false);
        } else {
            res.json(true);
        }
    })
    .catch(err => {
        console.log(err);
        res.json(false);
    });
}

addReservation = (req: express.Request, res: express.Response) => {
    const {
        vikendica,
        turista,
        datumPocetka,
        datumKraja,
        brojOsoba,
        datum,
        zahtevi
    } = req.body;


    
    const reservation = new ReservationModel({
        vikendica: vikendica,
        turista: turista,
        datumPocetka: datumPocetka,
        datumKraja: datumKraja,
        brojOsoba: brojOsoba,
        status: 'na čekanju',
        datum: datum,
        zahtevi:zahtevi
    });

    reservation.save()
        .then(ok => {
            res.json(true);
        })
        .catch(err => {
            console.log(err);
            res.json(false);
        });
}




    

}


    

