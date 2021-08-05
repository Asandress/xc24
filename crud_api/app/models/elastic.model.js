//module.exports = (sequelize, Sequelize) => {
  //  const tbl_consult = sequelize.define("tbl_consult", {
  //   id: {
  //     type: Sequelize.BOOLEAN,
  //     primaryKey: true
  //   },
  //   title: {
  //     type: Sequelize.STRING
  //   },
  //   text: {
  //     type: Sequelize.STRING
  //   }
  // });

//SELECT * FROM tbl_elastic_model_link	 WHERE `elastic_id` IN(11, 26, 12)
  //  const Tbl_model = sequelize.define("tbl_elastic_model_link", {
  //   id: {
  //     type: Sequelize.BOOLEAN,
  //     primaryKey: true
  //   },
  //   model_class: {
  //     type: Sequelize.STRING
  //   },
  //   model_id: {
  //     type: Sequelize.BOOLEAN
  //   },
  //   elastic_id: {
  //     type: Sequelize.BOOLEAN
  //   }
  // })
  // return Tbl_model

  module.exports = (sequelize, Sequelize) => {
    const Tbl_model = sequelize.define("tbl_elastic_model_link", {
      title: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      published: {
        type: Sequelize.BOOLEAN
      }
    });
  
    return Tbl_model;
}

