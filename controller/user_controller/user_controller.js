const userModel = require("../../model/user_model/user_model");
const genderModel = require("../../model/gender_model/gender_model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");

function userSignUp(req, res) {
  userModel
    .findOne({ where: { email: req.body.email } })
    .then((result) => {
      if (result) {
        res.status(409).json({
          [process.env.PROJECT_NAME]: {
            status: 409,
            timestamp: Date.now(),
            message: "User Already Exists",
          },
        });
      } else {
        bcrypt.genSalt(10, function (error, salt) {
          bcrypt.hash(req.body.password, salt, function (error, hash) {
            const user = {
              email: req.body.email,
              password: hash,
            };
            userModel
              .create(user)
              .then((result1) => {
                const token = jwt.sign(
                  {
                    email: user.email,
                  },
                  process.env.JWT_KEY,
                  function (error, token) {
                    res.status(201).json({
                      [process.env.PROJECT_NAME]: {
                        status: 201,
                        timestamp: Date.now(),
                        token: token,
                        message: "User Created Successfully!",
                        data: {
                          id: result1.id,
                          email: result1.email,
                        },
                      },
                    });
                  },
                );
              })
              .catch((error) => {
                res.status(500).json({
                  [process.env.PROJECT_NAME]: {
                    status: 500,
                    timestamp: Date.now(),
                    message: "Something Went Wrong!",
                    data: error,
                  },
                });
              });
          });
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        [process.env.PROJECT_NAME]: {
          status: 500,
          timestamp: Date.now(),
          message: "Something Went Wrong!",
          data: error,
        },
      });
    });
}

function userLogin(req, res) {
  userModel
    .findOne({
      where: { email: req.body.email },
      include: [
        {
          model: genderModel,
          attributes: ["gender"],
        },
      ],
    })
    .then((user) => {
      if (user === null) {
        res.status(404).json({
          [process.env.PROJECT_NAME]: {
            status: 404,
            timestamp: Date.now(),
            message: "User with this email not found!",
            data: {
              email: user.email,
            },
          },
        });
      } else {
        bcrypt.compare(
          req.body.password,
          user.password,
          function (error, result) {
            if (result) {
              const token = jwt.sign(
                {
                  email: user.email,
                },
                process.env.JWT_KEY,
                function (error, token) {
                  res.status(200).json({
                    [process.env.PROJECT_NAME]: {
                      status: 200,
                      timestamp: Date.now(),
                      message: "User loggedIn successfuly",
                      token: token,
                      data: {
                        id: user.user_id,
                        email: user.email,
                        name: user.name,
                        phoneNumber: user.phoneNumber,
                        gender: user.gender ? user.gender.gender : null,
                        profileUrl: user.profileUrl,
                        dob: user.dob,
                      },
                    },
                  });
                },
              );
            } else {
              res.status(404).json({
                [process.env.PROJECT_NAME]: {
                  status: 404,
                  timestamp: Date.now(),
                  message: "User Not found",
                },
              });
            }
          },
        );
      }
    })
    .catch((error) => {
      res.status(500).json({
        [process.env.PROJECT_NAME]: {
          status: 500,
          timestamp: Date.now(),
          message: "Something Went Wrong!",
          data: error,
        },
      });
    });
}

function updateProfile(req, res) {
  const updateProfile = {
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    dob: req.body.dob,
    genderId: req.body.genderId,
  };
  userModel
    .findOne({ where: { email: req.body.email } })
    .then((user) => {
      if (user === null) {
        res.status(404).json({
          [process.env.PROJECT_NAME]: {
            status: 404,
            timestamp: Date.now(),
            message: "User with this email not found!",
            data: {
              email: user.email,
            },
          },
        });
      } else {
        userModel
          .update(updateProfile, { where: { email: user.email } })
          .then((result) => {
            if (result) {
              res.status(200).json({
                [process.env.PROJECT_NAME]: {
                  status: 200,
                  timestamp: Date.now(),
                  message: "User profile updated successfully",
                  data: updateProfile,
                },
              });
            } else {
              res.status(404).json({
                [process.env.PROJECT_NAME]: {
                  status: 404,
                  timestamp: Date.now(),
                  message: "User Profile not found",
                },
              });
            }
          })
          .catch((error) => {
            console.log(error);
            res.status(500).json({
              [process.env.PROJECT_NAME]: {
                status: 500,
                timestamp: Date.now(),
                message: "Something Went Wrong!",
                data: error,
              },
            });
          });
      }
    })
    .catch((error) => {
      res.status(500).json({
        [process.env.PROJECT_NAME]: {
          status: 500,
          timestamp: Date.now(),
          message: "Something Went Wrong!",
          data: error,
        },
      });
    });
}

function getUserProfile(req, res) {
  userModel
    .findOne({
      where: { email: req.body.email },
      include: [
        {
          model: genderModel,
          attributes: ["gender"],
        },
      ],
    })
    .then((user) => {
      if (user === null) {
        res.status(404).json({
          [process.env.PROJECT_NAME]: {
            status: 404,
            timestamp: Date.now(),
            message: "User with this email not found!",
            data: {
              email: user.email,
            },
          },
        });
      } else {
        res.status(200).json({
          [process.env.PROJECT_NAME]: {
            status: 200,
            timestamp: Date.now(),
            message: "User profile fetched!",
            data: {
              id: user.user_id,
              name: user.name,
              email: user.email,
              phoneNumber: user.phoneNumber,
              profileUrl: user.profileUrl,
              gender: user.gender ? user.gender.gender : null,
              dob: user.dob,
            },
          },
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        [process.env.PROJECT_NAME]: {
          status: 500,
          timestamp: Date.now(),
          message: "Something Went Wrong!",
          data: error,
        },
      });
    });
}

function getAllTheUsers(req, res) {
  userModel
    .findAll({
      include: [
        {
          model: genderModel,
          attributes: ["gender"],
        },
      ],
    })
    .then((result) => {
      res.status(200).json({
        [process.env.PROJECT_NAME]: {
          status: 200,
          timestamp: Date.now(),
          message: "Getting All the Users!",
          data: result.map((user) => {
            return {
              id: user.user_id,
              name: user.name,
              email: user.email,
              phoneNumber: user.phoneNumber,
              profileUrl: user.profileUrl,
              gender: user.gender ? user.gender.gender : null,
              dob: user.dob,
            };
          }),
        },
      });
    })
    .catch((error) => {
      res.status(500).json({
        [process.env.PROJECT_NAME]: {
          status: 500,
          timestamp: Date.now(),
          message: "Something Went Wrong!",
          data: error,
        },
      });
    });
}

function userProfilePictureUpdate(req, res) {
  const updateProfilePicture = {
    profileUrl: req.file.path.replace(/\\/g, "/"),
  };
  userModel
    .findOne({ where: { email: req.body.email } })
    .then((user) => {
      if (user === null) {
        res.status(404).json({
          [process.env.PROJECT_NAME]: {
            status: 404,
            timestamp: Date.now(),
            message: "User with this email not found!",
            data: {
              email: user.email,
            },
          },
        });
      } else {
        if (user.profileUrl != null) {
          let deleteHandler = function (err) {
            if (err) {
              console.log("Unlink Failed", err);
            } else {
              console.log("File Deleted");
            }
          };
          fs.unlink(user.profileUrl, deleteHandler);
          userModel
            .update(updateProfilePicture, { where: { email: user.email } })
            .then((result) => {
              if (result) {
                res.status(200).json({
                  [process.env.PROJECT_NAME]: {
                    status: 200,
                    timestamp: Date.now(),
                    message: "User profile updated successfully",
                    data: updateProfile,
                  },
                });
              } else {
                res.status(404).json({
                  [process.env.PROJECT_NAME]: {
                    status: 404,
                    timestamp: Date.now(),
                    message: "User Profile not found",
                  },
                });
              }
            })
            .catch((error) => {
              res.status(500).json({
                [process.env.PROJECT_NAME]: {
                  status: 500,
                  timestamp: Date.now(),
                  message: "Something Went Wrong!",
                  data: error,
                },
              });
            });
        } else {
          userModel
            .update(updateProfilePicture, { where: { email: user.email } })
            .then((result) => {
              if (result) {
                res.status(200).json({
                  [process.env.PROJECT_NAME]: {
                    status: 200,
                    timestamp: Date.now(),
                    message: "User profile updated successfully",
                    data: updateProfile,
                  },
                });
              } else {
                res.status(404).json({
                  [process.env.PROJECT_NAME]: {
                    status: 404,
                    timestamp: Date.now(),
                    message: "User Profile not found",
                  },
                });
              }
            })
            .catch((error) => {
              res.status(500).json({
                [process.env.PROJECT_NAME]: {
                  status: 500,
                  timestamp: Date.now(),
                  message: "Something Went Wrong!",
                  data: error,
                },
              });
            });
        }
      }
    })
    .catch((error) => {
      res.status(500).json({
        [process.env.PROJECT_NAME]: {
          status: 500,
          timestamp: Date.now(),
          message: "Something Went Wrong!",
          data: error,
        },
      });
    });
}

module.exports = {
  userSignUp: userSignUp,
  userLogin: userLogin,
  updateProfile: updateProfile,
  getUserProfile: getUserProfile,
  getAllTheUsers: getAllTheUsers,
  userProfilePictureUpdate: userProfilePictureUpdate,
};
