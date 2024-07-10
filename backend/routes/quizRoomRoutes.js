import express from "express";
import { createRoom, joinRoomByCode, getRoom, getUserRooms, startRoom } from "../controllers/quizRoomController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post('/create', protectRoute, createRoom);
router.post('/join', joinRoomByCode);
router.get('/:roomId', protectRoute, getRoom);
router.get('/user/rooms', protectRoute, getUserRooms);
router.post('/start/:roomId', protectRoute, startRoom);

export default router;
    