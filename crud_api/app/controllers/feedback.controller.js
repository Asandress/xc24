const db = require("../models");
const Feedback = db.feedback;
const Op = db.Sequelize.Op;


exports.create = (req, res) => {

  // Validate request
  if (!req.body.message) {
    res.status(400).send({
      message: "Поле сообщение не может быть пустым!"
    });
    return;
  }


  const feedback = {
    type: req.body.type,
    article_id: req.body.article_id,
    message: req.body.message,
    read: 'N'
  }

  // Save Tutorial in the database
  Feedback.create(feedback)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Ошибка создания"
      })
    })
  
}

exports.getFeedbackList = (req, res) => {

  db.sequelize.query("SELECT * FROM `tbl_feedbacks`  WHERE 1 ORDER BY id DESC  LIMIT 0, 300 ", {
    type: db.sequelize.QueryTypes.SELECT
  })
  .then(data => {
    res.send(data)
  })
  .catch(err => {
    res.status(500).send({
      message: err
    })
  })

}


exports.getUnreadableFeedbackList = (req, res) => {

  db.sequelize.query("SELECT * FROM `tbl_feedbacks`  WHERE `read` = 'N' ORDER BY id DESC  LIMIT 0, 300 ", {
    type: db.sequelize.QueryTypes.SELECT
  })
  .then(data => {
    res.send(data)
  })
  .catch(err => {
    res.status(500).send({
      message: err
    })
  })

}

exports.updateFeadbackRead = (req, res) => {
  const id = req.params.id

  db.sequelize.query("UPDATE `tbl_feedbacks` SET `read` = 'Y' WHERE `id` = (:id)", {
    replacements: {id: id},
    type: db.sequelize.QueryTypes.UPDATE
  })
  .then(data => {
    res.send({status:'success', message:`ID: ${id} успешно обновлен`})
  })
  .catch(err => {
    res.status(500).send({
      message: err
    })
  })
  
}

exports.deleteFeedbackByID = (req, res) => {

  const id = req.params.id
  
  db.sequelize.query("DELETE FROM `tbl_feedbacks` WHERE `id` = (:id)", {
    replacements: {id: id},
    type: db.sequelize.QueryTypes.DELETE
  }).then(data => {
    res.send({status:'success', message:`ID: ${id} успешно удален`})
  })
  .catch(err => {
    res.status(500).send({
      message: err
    })
  })
  
}

// exports.deleteFeedbackAll = (req, res) => {

//   const id = req.params.id;
  
//   sequelize.query("DELETE FROM `tbl_feedback` WHERE `model_id` = (:id)", {
//     replacements: {id: id},
//     type: db.sequelize.QueryTypes.DELETE
//   }).then(data => {
//     res.send({data: data})
//   })
//   .catch(err => {
//     res.status(500).send({
//       message: err
//     })
//   })
  
// }

