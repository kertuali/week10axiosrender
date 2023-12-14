const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController')


router.get('/', mainController.mainPage);
router.get('/search', mainController.getSearchPages);
router.post('/search', mainController.getMovieData);
router.post('/getmovie', mainController.getMovie);

module.exports = router;