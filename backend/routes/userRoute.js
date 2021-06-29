const express = require('express');
const userController = require('../controller/userController');
const checkAuth = require('../middleware/check-auth');
const routes = express.Router();


routes.post("/signup" ,userController.userSignup )
routes.post("/login" ,  userController.userLogin)
routes.post("/resetPassword" , userController.resetPassword)
routes.put("/forgotPassword" , userController.forgetPassword)

routes.use(checkAuth);
routes.get("/searchUserInfo" , userController.searchUserInfo)
routes.post("/postContent", userController.sendPost);
routes.get("/allPosts" , userController.allPost)
routes.get("/myPost" , userController.myPost)
routes.put("/like", userController.like);
routes.put("/unlike", userController.unlike);
routes.put("/comment" , userController.comment)
routes.delete("/delete/:postId", userController.deletePost);
module.exports = routes;