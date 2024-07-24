import { Router } from "express";
import { answerSuggestions } from "@controllers/aiAssistant.controller";

const router = Router();

// get response from AI assistant
router.post("/response", answerSuggestions);

export default router;
