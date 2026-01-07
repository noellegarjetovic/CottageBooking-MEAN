import express from 'express'
import ReservationModel from '../models/reservations'
import CottageModel from '../models/cottages'


export class OwnerController{
    
    getOwnersReservations(req:express.Request, res:express.Response){
        let naziv=req.body.naziv
        ReservationModel.find({vikendica:naziv}).then(data=>{
            res.json(data)
        }).catch(err=>{
            console.log(err)
            res.json(null)
        })
    }
    getOwnersCottages(req:express.Request, res:express.Response){
        let vlasnik=req.body.vlasnik
        CottageModel.find({vlasnik:vlasnik}).then(data=>{
            res.json(data)
        }).catch(err=>{
            console.log(err)
            res.json(null)
        })
    }

    updateStatusReservation(req:express.Request, res:express.Response){
        let naziv=req.body.naziv
        let datumP=req.body.datum
        let status=req.body.status
        let komentar=req.body.komentarOdbijanja
        if(status=="odobreno"){
            ReservationModel.updateOne({vikendica:naziv,datumPocetka:datumP},{status:status}).then(data=>{
                res.json("uspesno")
            }).catch(err=>{
                console.log(err)
                res.json("neuspesno")
            })
        }else{
            ReservationModel.updateOne({vikendica:naziv,datumPocetka:datumP},{status:status,komentarOdbijanja:komentar}).then(data=>{
                res.json("uspesno")
            }).catch(err=>{
                console.log(err)
                res.json("neuspesno")
            })
        }
    }

addCottage = (req: express.Request, res: express.Response) => {
    const cottageData = req.body;

    CottageModel.findOne({ naziv: cottageData.naziv })
        .then(existingCottage => {
            if (existingCottage) {
                return res.json({ message: "Vikendica sa ovim nazivom već postoji" });
            }

            const cottage = new CottageModel({
                naziv: cottageData.naziv,
                mesto: cottageData.mesto,
                usluge: cottageData.usluge,
                cenaLeto: cottageData.cenaLeto,
                cenaZima: cottageData.cenaZima,
                telefon: cottageData.telefon,
                koordinate: cottageData.koordinate,
                slike: cottageData.slike || [],
                vlasnik: cottageData.vlasnik,
                status: 'aktivna',
                ocene: [],
                komentari: []
            });

            cottage.save()
                .then(ok => {
                    res.json({ message: "Vikendica uspešno dodata" });
                })
                .catch(err => {
                    console.log(err);
                    res.json({ message: "Došlo je do greške pri dodavanju vikendice" });
                });
        })
        .catch(err => {
            console.log(err);
            res.json({ message: "Greška pri proveri vikendice" });
        });
}

updateCottage = (req: express.Request, res: express.Response) => {
    const { naziv, cottage } = req.body;
    console.log(naziv)
    CottageModel.findOne({ naziv: naziv }).then(existingCottage => {
        if (!existingCottage) {
            return res.json({ message: "Vikendica nije pronađena" });
        }
        const updateData = {
            naziv: cottage.naziv,
            mesto: cottage.mesto,
            usluge: cottage.usluge,
            cenaLeto: cottage.cenaLeto,
            cenaZima: cottage.cenaZima,
            telefon: cottage.telefon,
            koordinate: cottage.koordinate,
            vlasnik:existingCottage.vlasnik,
            ocene:existingCottage.ocene,
            komentari:existingCottage.komentari,
            blokiranaDo:existingCottage.blokiranaDo,
            slike: cottage.slike,
            status: cottage.status || existingCottage.status // zadrži postojeći status ako nije poslat
        };
        console.log('PODACI ZA AŽURIRANJE:', updateData);
        CottageModel.updateOne(
            { _id: existingCottage._id }, 
            { $set: updateData }
        )
        .then(updatedCottage => {
            res.json("Vikendica uspešno ažurirana");
        })
        .catch(err => {
            console.log(err);
            res.json("Greška pri ažuriranju vikendice" );
        });
    })
    .catch(err => {
        console.log(err);
        res.json( "Greška pri pronalaženju vikendice" );
    });
}


deleteCottage = (req: express.Request, res: express.Response) => {
    const naziv = req.body.naziv;

    CottageModel.deleteOne({ naziv:naziv }).then(result => {
            res.json("Uspesno obrisana vikendica")
        })
        .catch(err => {
            console.log(err);
            res.json({ message: "Greška pri brisanju vikendice" });
        });
}

importFromJson = (req: express.Request & { file?: Express.Multer.File }, res: express.Response) => {
    const vlasnik = req.body.vlasnik;

    if (!req.file) {
        return res.json({ message: "Nijedan JSON fajl nije odabran" });
    }

    try {
        // Pročitaj JSON fajl
        const jsonData = JSON.parse(req.file.buffer.toString());
        
        // Proveri da li vikendica sa istim nazivom već postoji
        CottageModel.findOne({ naziv: jsonData.naziv })
            .then(existingCottage => {
                if (existingCottage) {
                    return res.json({ message: "Vikendica sa ovim nazivom već postoji" });
                }

                // Kreiraj novu vikendicu iz JSON podataka
                const cottage = new CottageModel({
                    naziv: jsonData.naziv,
                    mesto: jsonData.mesto,
                    usluge: jsonData.usluge,
                    cenaLeto: jsonData.cenaLeto,
                    cenaZima: jsonData.cenaZima,
                    telefon: jsonData.telefon,
                    koordinate: jsonData.koordinate,
                    slike: [], // JSON ne uključuje slike
                    vlasnik: vlasnik,
                    status: 'aktivna',
                    ocene: [],
                    komentari: []
                });

                // Sačuvaj u bazi
                cottage.save()
                    .then(ok => {
                        res.json({ message: "Vikendica uspešno uvežena iz JSON fajla" });
                    })
                    .catch(err => {
                        console.log(err);
                        res.json({ message: "Došlo je do greške pri uvozu vikendice" });
                    });
            })
            .catch(err => {
                console.log(err);
                res.json({ message: "Greška pri proveri vikendice" });
            });
    } catch (error) {
        console.log(error);
        res.json({ message: "Nevalidan JSON format" });
    }
}

}