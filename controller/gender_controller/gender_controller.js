const genderModel = require("../../model/gender_model/gender_model");

function genderCreate(req, res) {
  const user = {
    gender: req.body.gender,
  };
  genderModel
    .create(user)
    .then((result1) => {
      res.status(201).json({
        [process.env.PROJECT_NAME]: {
          status: 201,
          timestamp: Date.now(),
          message: "User Created Successfully!",
          data: {
            id: req.body.id,
            email: req.body.email,
          },
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

function genderUpdate(req, res) {
  genderModel
    .findOne({ where: { id: req.body.id } })
    .then((result) => {
      if (result === null) {
        res.status(404).json({
          [process.env.PROJECT_NAME]: {
            status: 404,
            timestamp: Date.now(),
            message: `Gender with id ${req.body.id} not found`,
            data: result,
          },
        });
      } else {
        const user = {
          gender: req.body.gender,
        };
        genderModel
          .update(user, { where: { id: req.body.id } })
          .then((result1) => {
            res.status(200).json({
              [process.env.PROJECT_NAME]: {
                status: 200,
                timestamp: Date.now(),
                message: "Gender Updated Successfully!",
                data: {
                  id: result1.id,
                  email: result1.email,
                },
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

function getAllGender(req, res) {
  genderModel
    .findAll()
    .then((result) => {
      res.status(200).json({
        [process.env.PROJECT_NAME]: {
          status: 200,
          timestamp: Date.now(),
          message: "Getting All the Gender!",
          data: result,
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

module.exports = {
  genderCreate: genderCreate,
  genderUpdate: genderUpdate,
  getAllGender: getAllGender,
};
