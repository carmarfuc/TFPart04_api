const { Router } = require('express');
const {getLocations}=require('../controllers/location')
const router = Router();

router.use('/', getLocations);

module.exports = router;