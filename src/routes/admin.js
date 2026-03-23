import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/adminMiddleware.js';
import {
  getAllUsersAdmin,
  updateUserAdmin,
  deleteReviewAdmin,
} from '../controllers/adminController.js';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Admin
 *     description: Administrative operations (Requires Admin role)
 */

/**
 * @openapi
 * /api/admin/users:
 *   get:
 *     summary: Get all registered users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 */
router.get('/users', protect, isAdmin, getAllUsersAdmin);

/**
 * @openapi
 * /api/admin/users/{id}:
 *   put:
 *     summary: Update any user data
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 *       404:
 *         description: User not found
 */
router.put('/users/:id', protect, isAdmin, updateUserAdmin);

/**
 * @openapi
 * /api/admin/reviews/{id}:
 *   delete:
 *     summary: Delete any review and its cloud photo
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 *       404:
 *         description: Review not found
 */
router.delete('/reviews/:id', protect, isAdmin, deleteReviewAdmin);

export default router;
