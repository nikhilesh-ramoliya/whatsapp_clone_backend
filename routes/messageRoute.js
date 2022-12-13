import { Router } from "express";
import { deleteMessage, newMessage, syncMessage } from "../controllers/messageController.js";

const router = Router();

router.post("/new", newMessage)
router.get("/sync", syncMessage)
router.put("/delete/:id", deleteMessage)

export default router;