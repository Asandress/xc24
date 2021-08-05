const dbConfig = require("../config/db.config");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;


const fns = require("./functions")

const getQueryTagsByID = async (data) => {
  
  if(data.length > 0){
      
    let tagsArr = []
    data.map(el => {
      tagsArr.push(`"${el.elastic_id}"`)
    })

    if(tagsArr.length !== 0){
        let p1 =  await fns.elasticQueryTagsByID(tagsArr)

       // console.log(p1)

        tagsRes = p1.hits.hits
        let tags = []
        tagsRes.map(el => {
            
            tags.push({id: el._id, value: el._source.tag, label: el._source.tag})
        })
        return tags
    
    } 
  } else {
    return {data: []}
  }
}

const getQueryTags = async (data) => {
        let p1 =  await fns.elasticQueryTags()

        tagsRes = p1.hits.hits
        let tags = []
        tagsRes.map(el => {
            
            tags.push({id: el._id, value: el._source.tag, label: el._source.tag})
        })
        return tags
}


const queryAddTag = async (data, synonym) => {
  let p1 =  await fns.elasticAddTag(data, synonym)

  return p1._id
}

exports.find = async (req, res) => {
  const title = req.query.title

  console.log('title => ', req.body.query)

  if(!req.body.query){
    res.status(404).send({
      status:404,
      message: 'Ошибка'
    })
    return
  }

  let words = req.body.query.split(' ')
  let withoutStopwords = []
  words.map( el => {
    console.log('el =>', fns.isStopWord(el))

      !fns.isStopWord(el) ? withoutStopwords.push(el.toLowerCase()) : ''

  })

  let qArr = []

  let a = withoutStopwords.length
  let b = a
  let i = 0

  //console.log('withoutStopwords =>', withoutStopwords)

  qArr.push(withoutStopwords.join(' '))

  while (i < a) {
      b --
      let ii = 0 
      let bb = b
      while (bb <= a && ii != bb  ) {
        qArr.push(withoutStopwords.slice(ii, bb).join(' '))
        bb++
        ii++
      }
      i++
    
  }
  //console.log('qArr => ', qArr)
  
  query = async (qArr) => {
    const q = await Promise.all(qArr.map(async (el) => {
      const response = await fns.elasticQuery(el.toLowerCase())
      //console.log('response ===> ',response)
      return response.hits
    }))
    return q
  }
 //Сотрудники ГИБДД отказываются выезжать на место
Promise.all([await query(qArr)]).then(resArr => {
  //set array with score
  let uArr =[]
  resArr[0].map(el => {
        el.hits.map(ele =>  { 
        // console.log(ele)
          uArr.push({id:ele._id, tag: ele._source, score: ele._score})
        })
  })
  //set IDs for mysql query
  const unique = [...new Set(uArr.map(item => item.id))]


  
  //console.log('unique => ',unique)
  
if(unique !=''){

  //console.log('unique => ',unique)
  
  sequelize.query("SELECT * FROM `tbl_elastic_model_link`  WHERE `elastic_id` IN (:id) GROUP BY model_id", {
          replacements: {id: unique},
          type: db.sequelize.QueryTypes.SELECT
      })
      .then(data => {

       // console.log('res ===>', data)

          let ids = data.map(el => el.model_id)
          let scoreArr = []
          ids.map(id => {
            data.filter(el =>{  
              if(id === el.model_id){
              let scoreId = uArr.find(ue => el.elastic_id === ue.id )
              scoreArr.push({id: el.id, model_id: el.model_id, elastic_id: el.elastic_id, score: scoreId.score, tags: scoreId.tag})
              
            } }
            )
          })
          let sortScoreArr = scoreArr.sort(function (a, b) {
            if (a.score < b.score) {
              return 1;
            }
            if (a.score > b.score) {
              return -1;
            }
            // a должно быть равным b
            return 0;
          });
          if(ids != ''){
            sequelize.query("SELECT * FROM `tbl_consultation`  WHERE `id` IN (:id) ", {
              replacements: {id: ids},
              type: db.sequelize.QueryTypes.SELECT
            })
            .then(data => {
              let newR = sortScoreArr.map(el => {
              //  console.log('el =>', el.model_id)
                let rf = data.filter(fl => fl.id === el.model_id)
                
                return {...rf[0], score: el.score, tags: el.tags}
                
              })
              let r = data.map(el => el)
              res.send({
                  words: words,
                  articles: newR,
            
              })
            })
            .catch(err => {
              //console.log(err)
              res.status(500).send({
                message: err
              })
            })
          } else {
            res.send({
              status:404
            })
          }
          
      })
      .catch(err => {
        console.log(err)
          res.status(500).send({
            message: err
          })
        })
      } else {
        res.send({
          status:404
        })
      }
  })

};



exports.getModelsList = async (req, res) => {
  res.send({message: ` get models list successful`});
}

exports.createTag = async (req, res) => {
  res.send({message: 'tag create successful'});
}

exports.getTags = async (req, res) => {
  let data = await getQueryTags()
  res.send(data)
}

exports.getTag = async (req, res) => {
  const id = req.params.id
  if(req.params.id != undefined){
    let resMySQL = await sequelize.query("SELECT * FROM `tbl_elastic_model_link`  WHERE model_id=(:id) LIMIT 0, 100 ", {
      replacements: {id: id },
      type: db.sequelize.QueryTypes.SELECT
    })
    let data = await getQueryTagsByID(resMySQL)
    res.send(data)
    
  }
  
}

exports.putTag = async (req, res) => {
  res.send({message: 'tag update successful'});
}

exports.addTag = async (req, res) => {
  const value = req.body.value;
  const synonym = req.body.synonym || ''

  let data = await queryAddTag(value, synonym)

  res.send({message: `tag add ${data} successful`, id: data});
}

//== pure tags ===
exports.getTagPure = async (req, res) => {
  const id = req.params.id

  if(id != undefined){
    try {
      let data = await fns.elasticQueryTagsByID(`"${id}"`)
      if(data.hits.total.value > 0) {
        res.send({data: data.hits.hits[0]._source })
      }
    } catch (error) {
      console.log('error', error)
      res.status(500).send({error})
    }
    
  } else {
    res.status(500).send({error: 'ID is not defined'})
  }
  
}

exports.putTagPure = async (req, res) => {

  
  const id = req.params.id;
  const tag = req.body.tag;
  const synonym = req.body.synonym || ''
  
  if(req.params.id != undefined){

    let data = await fns.elasticPutTag(id, tag, synonym)
    res.send({data })
    
  } else {
    res.status(500).send({error: 'ID is not defined'})
  }
  
}


exports.getArticles = async (req, res) => {

  sequelize.query("SELECT * FROM `tbl_consultation`  WHERE 1 ORDER BY id DESC  LIMIT 0, 300 ", {
    type: db.sequelize.QueryTypes.SELECT
  })
  .then(data => {
    res.send({data: data})
  })
  .catch(err => {
    res.status(500).send({
      message: err
    })
  })
}

exports.createArticle = async (req, res) => {
  const title = req.body.title;
  const text = req.body.text;


    let mRes = await sequelize.query("INSERT INTO `tbl_consultation` (`id`, `title`, `text`, `created_at`, `updated_at`) VALUES (NULL, :title, :desc, NOW(), NOW())", {
      replacements: {title: title, desc: text},
      type: db.sequelize.QueryTypes.INSERT
    })
    res.send({message: `статья #${mRes[0]} успешно создана... `, id: mRes[0]})
}

exports.addTagsToArticle = async (req, res) => {
  const id = req.params.id;
  
  sequelize.query("DELETE FROM `tbl_elastic_model_link` WHERE `model_id` = (:id)", {
    replacements: {id: id},
    type: db.sequelize.QueryTypes.DELETE
  }).then(re => {

  
  })
  
  try {
    let i = 0
    req.body.tags.map(el =>{
        sequelize.query("INSERT INTO `tbl_elastic_model_link` (`id`, `model_class`, `model_id`, `elastic_id`) VALUES (NULL, 'tbl_consultation', :id, :tag_id)", {
          replacements: {id: id, tag_id: el.id},
          type: db.sequelize.QueryTypes.INSERT
        })
        i++
    })


    res.send({message: `связи (${i}) с тегами успешно созданы...`})

  } catch (error) {
    res.send({status: 'error', message: `что-то пошло не так${error}`})
  }
    
}

//addTagsToArticle

exports.getArticle = async (req, res) => {
  const id = req.params.id
  sequelize.query("SELECT * FROM `tbl_consultation`  WHERE id=(:id) LIMIT 0, 100 ", {
      replacements: {id: id },
      type: db.sequelize.QueryTypes.SELECT
  })
  .then(data => {
    res.send({data: data})
  })
  .catch(err => {
     //console.log(err)
    res.status(500).send({
      message: err
    })
  })
}
//getArticleByTagId
exports.getArticleByTagId = async (req, res) => {
  const id = req.params.id
  sequelize.query("SELECT * FROM `tbl_consultation` as cn, `tbl_elastic_model_link` as m  WHERE elastic_id=(:id) AND model_id = cn.id LIMIT 0, 100 ", {
      replacements: {id: id },
      type: db.sequelize.QueryTypes.SELECT
  })
  .then(data => {
    res.send({data: data})
  })
  .catch(err => {
     //console.log(err)
    res.status(500).send({
      message: err
    })
  })
}

exports.putArticle = async (req, res) => {
  const id = req.params.id
  const title = req.body.title
  const text = req.body.text


    sequelize.query("UPDATE `tbl_consultation` SET `title` = :title, `text` = :desc,  `updated_at`= NOW() WHERE `tbl_consultation`.`id` = (:id)", {
      replacements: {title: title, desc: text, id: id},
      type: db.sequelize.QueryTypes.UPDATE
    }).then(re => {
      
    })
    res.send({message: `save article successfull`})
}

exports.delArticle = async (req, res) => {
  const id = req.params.id;
  
  if(req.params.id != 'undefined'){

    sequelize.query("DELETE FROM `tbl_elastic_model_link` WHERE `model_id` = (:id)", {
      replacements: {id: id},
      type: db.sequelize.QueryTypes.DELETE
    }).then(re => {
    })

    sequelize.query("DELETE FROM `tbl_consultation` WHERE `id` = (:id)", {
      replacements: {id: id},
      type: db.sequelize.QueryTypes.DELETE
    }).then(re => {

    })

    res.send({message: `delete article #${id} successfull`})
  } else {
    res.send({status: 'error', message: `delete article #${id} fail`})
  }
}

exports.delTag = async (req, res) => {
  const id = req.params.id

  if(id != undefined){
    try {

      await sequelize.query("DELETE FROM `tbl_elastic_model_link` WHERE `elastic_id` = (:id)", {
        replacements: {id: id},
        type: db.sequelize.QueryTypes.DELETE
      }).then(async re => {
        let data = await fns.elasticDelTag(`${id}`)
        res.send(data)
      }).catch(err => {
        console.log('error', err)
        res.send({error: "Ошибка удаления"})
      })
      
      
    } catch (error) {
      console.log('error', error)
      res.send({error: "Ошибка удаления"})
    }
    
  } else {
    res.send({error: 'ID is not defined'})
  } 
}
