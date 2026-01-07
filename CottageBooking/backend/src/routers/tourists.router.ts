import express from "express";
import { TouristController } from "../controllers/tourist.controller";

const touristRouter = express.Router();

touristRouter.route("/getUser").post(
    (req,res)=> new TouristController().getUser(req,res)
);

touristRouter.route("/updateUser").post(
    (req,res)=> new TouristController().updateUser(req,res)
)

touristRouter.route("/getCottages").get(
    (req,res)=> new TouristController().getCottages(req,res)
);
touristRouter.route("/getCottage").post(
    (req,res)=> new TouristController().getCottage(req,res)
)
touristRouter.route("/getOwner").post(
    (req,res)=> new TouristController().getOwner(req,res)
)
touristRouter.route("/getMyReservations").post(
    (req,res)=> new TouristController().getMyReservations(req,res)
)
touristRouter.route("/submitReservationRating").post(
    (req,res)=>new TouristController().submitReservationRating(req,res)
)
touristRouter.route("/deleteReservation").post(
    (req,res)=>new TouristController().deleteReservation(req,res)
)
touristRouter.route("/checkReservationOverlap").post(
    (req,res)=>new TouristController().checkReservationOverlap(req,res)
)
touristRouter.route("/addReservation").post(
    (req,res)=>new TouristController().addReservation(req,res)
)

export default touristRouter;
