import express from "express";
import { createRoom, joinRoomByCode, getRoom } from "../controllers/quizRoomController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/create",protectRoute, createRoom);
router.post("/join",protectRoute, joinRoomByCode);
router.get("/:roomId",protectRoute, getRoom);

export default router;
    