const stopwords = require('stopwords-ru');

const russian = stopwords.ru;

const fetch = require("node-fetch");

//let word = 'Видеть'



exports.isStopWord = (word) => {
  //console.log('word =>', word)
  //console.log('stopwords =>', stopwords)
	//var regex = new RegExp("\\b"+word+"\\b","i");
  //console.log(regex)
//let regex = stopwords.join(', ').search(word.toLowerCase())

let regex = stopwords.indexOf(word.toLowerCase())
console.log('regex ===> ',regex)
	if(regex < 0)
	{
		return false;
	}else
	{
		return true;	
	}
}

exports.elasticQuery = async (str) => {
    let URL = `http://192.168.94.55:9200/info-sys/consultation/_search?pretty`
    let params = `{"query":{"bool":{"must":[{"query_string":{"query":"${str}"}}]}},"from":0,"size":5}`
    const response = await fetch(URL,{
      headers:{
        'Content-Type':'application/json'
      },
      method:'POST',
      body: params
      
    })

    const data = response.json()

    return data
}

exports.elasticQueryTagsByID = async (str) => {

 // console.log(str)
  let URL = `http://192.168.94.55:9200/info-sys/consultation/_search?pretty`
  let params = `{
    "query": {
      "ids" : {
        "values" : [${str}]
      }
    }
  }`
  //console.log(params)
  const response = await fetch(URL,{
    headers:{
      'Content-Type':'application/json'
    },
    method:'POST',
    body: params
    
  })

  const data = response.json()
  return data
}

exports.elasticAddTag = async (str, symonym) => {
 // console.log('str =>',str)
  let URL = `http://192.168.94.55:9200/info-sys/consultation/`
  let params = `{
   "tag": "${str}",
   "synonym": "${symonym}"
  }`
  // console.log(params)
  const response = await fetch(URL,{
    headers:{
      'Content-Type':'application/json'
    },
    method:'POST',
    body: params
    
  })

  const data = response.json()
  return data
}


exports.elasticPutTag = async (id, tag, synonym) => {
  let URL = `http://192.168.94.55:9200/info-sys/consultation/${id}`
  let params = `{
    "tag": "${tag}",
    "synonym":"${synonym}"
  }`
  // console.log(params)
  const response = await fetch(URL,{
    headers:{
      'Content-Type':'application/json'
    },
    method:'PUT',
    body: params
    
  })

  const data = response.json()
  return data
}

exports.elasticDelTag = async (id) => {
  let URL = `http://192.168.94.55:9200/info-sys/consultation/${id}`
  
  // console.log(params)
  const response = await fetch(URL,{
    headers:{
      'Content-Type':'application/json'
    },
    method:'DELETE'
    
  })

  const data = response.json()
  return data
}

exports.elasticQueryTags = async (str) => {
  let URL = `http://192.168.94.55:9200/info-sys/consultation/_search?pretty=true&q=*:*&size=1000`
  let params = ``
 // console.log(params)
  const response = await fetch(URL,{
    headers:{
      'Content-Type':'application/json'
    },
    method:'GET',
    
  })

  const data = response.json()
  

  return data
}



//console.log(isStopWord('давать'))