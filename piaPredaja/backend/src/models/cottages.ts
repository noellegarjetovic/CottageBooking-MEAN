import mongoose from 'mongoose'

const cottageSchema= new mongoose.Schema({
    naziv:{type:String, required:true},
    mesto:{type:String, required:true},
    usluge:{type:String, required:true},
    cenaLeto: { type: Number, required: true },
    cenaZima:{type:Number, required:true},
    telefon: String,
    koordinate: {
        lat: Number,
        lng: Number
    },
    slike: [{
        type:String
    }],
    vlasnik: { type: String, required: true },
    status: { type: String, enum: ['aktivna', 'blokirana'], default: 'aktivna' },
     ocene: [{
        korime: { type: String},
        ocena: { type: Number,  min: 1, max: 5 },
    }],
    komentari: [{
        korime: { type: String},
        tekst: { type: String},
    }],
    blokiranaDo: {type:String}

},{versionKey:false});

export default mongoose.model('CottageModel',cottageSchema, 'cottages')