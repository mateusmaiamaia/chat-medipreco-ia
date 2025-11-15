import { Router } from 'express';
import { chatController } from '../controllers/chat.controller.js';

const router = Router();

router.post('/', chatController.postMessage);
router.get('/history', chatController.getHistory);
router.delete('/history', chatController.deleteHistory);

export default router;