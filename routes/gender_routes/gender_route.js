const express = require('express');
const genderController = require('../../controller/gender_controller/gender_controller');
const checkAuth = require('../../middleware/middleware');

const route = express.Router();

route.post('/add-gender', checkAuth.checkAuth, genderController.genderCreate);
route.patch('/update-gender', checkAuth.checkAuth,  genderController.genderUpdate);
route.get('/get-gender', checkAuth.checkAuth, genderController.getAllGender);

module.exports = route;