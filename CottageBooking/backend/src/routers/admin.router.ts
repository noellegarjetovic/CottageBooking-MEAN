import express from "express";
import { TouristController } from "../controllers/tourist.controller";
import { OwnerController } from "../controllers/owner.controller";
import { AdminController } from "../controllers/admin.controller";

const adminRouter = express.Router();

adminRouter.route("/getAllUsers").get(
    (req,res)=> new AdminController().getAllUsers(req,res)
);
adminRouter.route("/getAllCottages").get(
    (req,res)=> new AdminController().getAllCottages(req,res)
);
adminRouter.route("/updateUserStatus").post(
    (req,res)=> new AdminController().updateUserStatus(req,res)
);
adminRouter.route("/deleteUser").post(
    (req,res)=> new AdminController().deleteUser(req,res)
);
adminRouter.route("/blockCottage").post(
    (req,res)=> new AdminController().blockCottage(req,res)
);
adminRouter.route("/updateUser").post(
    (req,res)=> new AdminController().updateUser(req,res)
);
adminRouter.route("/unBlockCottage").post(
    (req,res)=> new AdminController().unBlockCottage(req,res)
);


export default adminRouter;