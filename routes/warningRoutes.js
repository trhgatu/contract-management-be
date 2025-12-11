const express = require('express');
const {
    getWarnings,
    getWarning,
    updateWarning,
    createWarning,
    deleteWarning,
    generateWarnings
} = require('../controllers/warningController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

router
    .route('/')
    .get(getWarnings)
    .post(createWarning);

router.post('/generate', generateWarnings);

router
    .route('/:id')
    .get(getWarning)
    .put(updateWarning)
    .delete(deleteWarning);

module.exports = router;
