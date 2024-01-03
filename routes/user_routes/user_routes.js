const express = require('express');
const userController = require('../../controller/user_controller/user_controller');
const imageUploader = require('../../utils/user_profile/user_profile_uploader');
const checkAuth = require('../../middleware/middleware');

const route = express.Router();

route.post('/sign-up', userController.userSignUp);
route.post('/login', userController.userLogin);
route.put('/update',  checkAuth.checkAuth, userController.updateProfile);
route.patch('/get-user',  checkAuth.checkAuth, userController.getUserProfile);
route.get('/get-all-user',  checkAuth.checkAuth, userController.getAllTheUsers);
route.patch('/update-profile', checkAuth.checkAuth, imageUploader.upload, userController.userProfilePictureUpdate);

module.exports = route;