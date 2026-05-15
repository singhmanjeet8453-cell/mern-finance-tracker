import express from 'express';
import { getInsights, chatWithAssistant } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/insights', protect, getInsights);
router.post('/chat', protect, chatWithAssistant);

export default router;
