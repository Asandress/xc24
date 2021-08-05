module.exports = app => {
  const elastic = require("../controllers/elastic.controller.js");

  var router = require("express").Router();
  const jwt    = require('jsonwebtoken')

  //no auth routes
  router.post("/", elastic.find)

  //get lists routes
  router.get("/models_list", elastic.getModelsList)
  router.get("/tags", elastic.getTags)
  

  router.get("/tag/:id", elastic.getTag)

  router.get("/tag_pure/:id", elastic.getTagPure)

  router.get("/article/:id", elastic.getArticle)

  router.get("/article_by_tag_id/:id", elastic.getArticleByTagId);

  //article_by_tag_id



  router.use((req, res, next) =>{
    // check header for the token
    var token = req.headers['access-token']
  
    // decode token
    if (token) {
  
      // verifies secret and checks if the token is expired
      jwt.verify(token, app.get('Secret'), (err, decoded) =>{      
        if (err) {
          return res.json({ message: 'invalid token' });    
        } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;    
          next();
        }
      });
  
    } else {
  
      // if there is no token  
  
      res.status(401).send({  
          message: 'No token provided.' 
      });
  
    }
  });
 // router.get("/", elastic.find);
 router.get(`/ping`, (req,res) => {
   res.send({
     message:'token valid'
   })
 })
  

  //tags routes
  //router.post("/tag", elastic.createTag);
  router.get("/articles", elastic.getArticles)
  
  router.put("/tag/:id", elastic.putTag);

  //for tags crud
  
  router.put("/tag_pure/:id", elastic.putTagPure);

  router.post("/tag/add", elastic.addTag);
  router.post("/add_tags/:id", elastic.addTagsToArticle);
  router.delete("/tag/:id", elastic.delTag);

  //articles routes
  router.post("/article", elastic.createArticle);
  router.put("/article/:id", elastic.putArticle);
  router.delete("/article/:id", elastic.delArticle);

  app.use('/api/elastic', router);
};