const HttpError = require("../utils/http-error");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();
const Post = require('../model/post');
const User = require("../model/user");

const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.API_KEY);
const crypto = require("crypto");

const userSignup = async (req, res, next) => {
  const { name, username , email, password, dob } = req.body;
  let existingUser;
  let existingUserName;
  try {
    existingUser = await User.findOne({ email: email});
  } catch (err) {
    const error = new HttpError("SignUp Failed", 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError("User Already Exists ", 422);
    return next(error);

  }
  try {
    existingUserName = await User.findOne({ username: username });
  } catch (err) {
    const error = new HttpError("SignUp Failed", 500);
    return next(error);
  }

  if (existingUserName) {
    const error = new HttpError("User Already Exists With This UserName" , 422);
    return next(error);
  }
   let encryptPassword;
   try {
     encryptPassword = await bcrypt.hash(password, 12);
   } catch (err) {
     const error = new HttpError("Encryption Failed", 500);
     return next(error);
   }
   const createUser = new User({
     name : name,
     username: username,
     email: email,
     password: encryptPassword,
     dob: dob,
     role: "User",
   });
  
   try {
     await createUser.save();
   } catch (err) {
     const error = new HttpError("Sign Up Failed", 500);
     return next(error);
   }
};
    
const userLogin = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Login Failed", 500);
    return next(error);
  }
  if (!existingUser) {
    const error = new HttpError("Invalid Credentials", 403);
    return next(error);
  }
  if(existingUser){
  let checkPassword = false;
  try {
    checkPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError("Invalid Credentials", 403);
    return next(error);
  }
  if(!checkPassword){
    return res.status(500).json({message : "password do not match"})
  }
  let token;

  try {
    token = jwt.sign(
      {
        _id: existingUser._id,
        email: existingUser.email,
        name: existingUser.name,
      },
      `${process.env.DB_USERKEY}`,
      { expiresIn: "2h" }
    );
  } catch (err) {
    const error = new HttpError("Sign Up Failed", 500);
    return next(error);
  }
   res.json({ _id: existingUser._id, Email: existingUser.email, token });
}
};

const resetPassword = async (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email }).then((user) => {
      if (!user) {
        return res
          .status(422)
          .json({ error: "User Does Not Exist With this email" });
      }
      user.resetToken = token;
      user.expireToken = Date.now() + 36000000;
      user
        .save()
        .then((result) => {
          const msg = {
            to: `${user.email}`, // Change to your recipient
            from: `${process.env.USER_EMAIL}`, // Change to your verified sender
            subject: "Sending with SendGrid is Fun",
            text: "and easy to do anywhere, even with Node.js",
            html: `<strong><h1>Reset Password Code </h1></strong><br> 
           <p>Kindly Use The Below Secret Code To Update Password </p>
            <h3>${token}</h3>
            <h2>Note: Do not Share Secret Code With Anyone Otherwise Strict Action Take Against You</h2>`,
          };
          sgMail
            .send(msg)
            .then(() => {
              return res
                .status(200)
                .json({ message: "The Email Has been Sent" });
            })
            .catch((err) => {
              const error = new HttpError("Something Went Wrong", 500);
              return next(error);
            });
        })
        .catch((err) => {
          const error = new HttpError("Email Sent Failed Try Again", 500);
          return next(error);
        });
    });
  });
};

const forgetPassword = async (req, res, next) => {
  const newPassword = req.body.password;
  const sentToken = req.body.token;
  User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
    .then((user) => {
      if (!user) {
        return res.status(422).json({ error: "try again session expired" });
      }
      bcrypt.hash(newPassword, 12).then((hashedPassword) => {
        user.Password = hashedPassword;
        user.resetToken = undefined;
        user.expireToken = undefined;
        user.save().then((saveduser) => {
          return res
            .status(200)
            .json({ message: "Password Updated Successfully" });
        });
      });
    })
    .catch((err) => {
      console.log(err);
      const error = new HttpError("Password Update Failed", 500);
      return next(error);
    });
};

let searchUserInfo = async (req, res, next) => {
  let existingUser;
  try {
    existingUser = await User.findOne({ userName: req.body.userName });
  } catch (err) {
    const error = new HttpError("Something Went Wrong", 500);
    return next(error);
  }
  if (existingUser) {
    return res.status(200).json({
      Id : existingUser.id,
      Name: existingUser.Name,
      userName: existingUser.userName,
      Email: existingUser.Email,
      DOB: existingUser.DOB,
    });
  } else {
    return res.status(500).json({ message: "UserName Does Not Exist" });
  }
};

let sendPost = async (req , res ,next ) => {
    
    const {title , body , name} = req.body
    const createPost = new Post({
      title: title,
      body: body,
      name:name,
      postedBy: req.user

    });

    try {
      await createPost.save();
      return res.status(200).json({ message: "Post Created" });
    } catch (err) {
      console.log(err)
      const error = new HttpError("Something Went Wrong", 500);
      return next(error);
    }
}


let allPost = (req ,res , next) => {
  Post.find()
  .populate("postedBy" , "_id")
  .then(posts => {
    return res.status(200).json({posts})
  }).catch(err => {
      const error = new HttpError("Something Went Wrong", 500);
      return next(error);
  })
}

let myPost = (req , res , next ) => {

   Post.find({postedBy: req.user._id})
   .populate("postedBy" , "_id name")
   .then(myPost => {
        return res.status(200).json({myPost})
   })
   .catch(err => {
       const error = new HttpError("Something Went Wrong", 500);
       return next(error);
   })
}

let like = (req, res) => {
  Post.findByIdAndUpdate(req.body.postId,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
}


let unlike = (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
}


let comment = (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.user._id,
  };
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        console.log(err)
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
}

let deletePost = (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .populate("postedBy", "_id")
    .exec((err, post) => {
      if (err || !post) {
        return res.status(422).json({ error: err });
      }
      if (post.postedBy._id.toString() === req.user._id.toString()) {
        post
          .remove()
          .then((result) => {
            res.json(result);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
}

exports.userSignup = userSignup;
exports.userLogin = userLogin;
exports.resetPassword = resetPassword;
exports.forgetPassword = forgetPassword;
exports.like = like
exports.unlike = unlike;
exports.searchUserInfo = searchUserInfo;
exports.sendPost = sendPost;
exports.allPost = allPost;
exports.myPost = myPost; 
exports.comment = comment
exports.deletePost = deletePost