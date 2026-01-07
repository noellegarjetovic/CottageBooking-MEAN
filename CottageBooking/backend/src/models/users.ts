import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    korime:{type: String, required:true, unique:true},
    lozinka:{type:String, required:true},
    ime:{type:String, required:true},
    prezime:{type:String, required:true},
    pol:{type:String, enum:['M', 'Ž'], required: true},
    adresa:{type:String, required:true},
    telefon:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    slika:{type:String},
    kartica:{type:String, required:true},
    tip:{type:String, enum:['turista','vlasnik'],required:true},
    status: {type:String}
})

export default mongoose.model('UserModel',userSchema,'users')