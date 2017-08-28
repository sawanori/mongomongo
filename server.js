const NeDB = require('nedb')
const path = require('path')
const MongoClient = require('mongodb').MongoClient
const dbUrl = 'mongodb://localhost:27017/monmon'


const express = require('express')
const app = express()
const portNo = 3000
app.listen(portNo, () => {
  console.log('起動',`http://localhost:${portNo}`)
})


app.use('/public',express.static('./public'))

app.get('/', (req,res) => {
  res.redirect(302,'/public')
})

app.get('/api/getItems', (req,res) => {
  MongoClient.connect(dbUrl, (err,db) => {
    if(err){
      throw err
    }
    const textCollection = db.collection('sawada')

    textCollection.find({}).sort({created: -1}).limit(40).toArray((err,docs) => {
      db.close()
      res.render('index', {docs:docs})
    })
  })
})


app.get('/api/write', (req,res) => {
  const q = req.query
  db.insert({
    name: q.name,
    body:q.body,
    stime: (new Date()).getTime()
  },(err,doc) => {
    if(err){
      console.error(err)
      sendJSON(res,false,{msg: err})
      return
    }
    sendJSON(res,true,{id:doc._id})
  })
})

function sendJSON(res,result,obj){
  obj['result'] = result
  res.json(obj)
}
