import mongoose from "mongoose";

const adminSchema=new mongoose.Schema({
    korime:String,
    lozinka:String
})

export default mongoose.model('AdminModel',adminSchema,'admins')