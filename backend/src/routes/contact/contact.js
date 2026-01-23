import express from 'express';
import { 
  submitContact, 
  getContacts, 
  updateContactStatus, 
  getContactById 
} from '../../controller/contact/contact.js';
import { authenticateUser } from '../../middleware/auth.middleware.js';

const router = express.Router();

// Public route - Submit contact form
router.post('/', submitContact);

// Protected routes (admin only) - require authentication
router.get('/', authenticateUser, getContacts);
router.get('/:contactId', authenticateUser, getContactById);
router.put('/:contactId', authenticateUser, updateContactStatus);

export default router;