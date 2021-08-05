module.exports = (sequelize, Sequelize) => {
  const feedback = sequelize.define("tbl_feedback", {
    type: {
      type: Sequelize.STRING
    },
    article_id: {
      type: Sequelize.INTEGER
    },
    message: {
      type: Sequelize.STRING
    },
    read: {
      type: Sequelize.ENUM('Y', 'N')
    }
  })
  return feedback
}
