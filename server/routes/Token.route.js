const express = require('express');
const {
    createToken,
    getAllTokens,
    getTokenById,
    updateToken,
    deleteToken
} = require('../controllers/Token.controller.js');
const router = express.Router();

router.post('/tokens', createToken);
router.get('/tokens', getAllTokens);
router.get('/tokens/:id', getTokenById);
router.put('/tokens/:id', updateToken);
router.delete('/tokens/:id', deleteToken);

module.exports = router;
