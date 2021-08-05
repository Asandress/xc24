module.exports = app => {
  const feedback = require("../controllers/feedback.controller.js")

  console.log('feedback routes')

  var router = require("express").Router()

  router.post("/send", feedback.create)
  router.put("/:id", feedback.updateFeadbackRead)
  router.delete("/:id", feedback.deleteFeedbackByID)
  router.get("/list", feedback.getFeedbackList)
  router.get("/unreadable_list", feedback.getUnreadableFeedbackList)
  
  app.use('/api/feedback', router);
}