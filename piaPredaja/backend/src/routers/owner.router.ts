import express from "express";
import { TouristController } from "../controllers/tourist.controller";
import { OwnerController } from "../controllers/owner.controller";

const ownerRouter = express.Router();

ownerRouter.route("/getOwnersReservations").post(
    (req,res)=> new OwnerController().getOwnersReservations(req,res)
);
ownerRouter.route("/getOwnersCottages").post(
    (req,res)=>new OwnerController().getOwnersCottages(req,res)
);
ownerRouter.route("/updateStatusReservation").post(
    (req,res)=>new OwnerController().updateStatusReservation(req,res)
);
ownerRouter.route("/addCottage").post(
    (req,res)=>new OwnerController().addCottage(req,res)
);
ownerRouter.route("/deleteCottage").post(
    (req,res)=>new OwnerController().deleteCottage(req,res)
);
ownerRouter.route("/updateCottage").post(
    (req,res)=>new OwnerController().updateCottage(req,res)
);

export default ownerRouter;