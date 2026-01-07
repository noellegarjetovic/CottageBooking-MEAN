import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
    vikendica: { type: String,  required: true },
    turista: { type: String,  required: true },
    datumPocetka: { type: String, required: true },
    datumKraja: { type: String, required: true },
    brojOsoba: { type: Number, required: true },
    status: { type: String, enum: ['na čekanju', 'odobreno', 'odbijeno'], default: 'na čekanju' },
    ocena: { type: Number, min: 1, max: 5 },
    komentar: String,
    datum:{ type: String, required: true },
    zahtevi:String,
    komentarOdbijanja:String
});

export default mongoose.model('ReservationModel', reservationSchema, 'reservations');