const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')
const bodyParser = require('body-parser')

const data = require('./data.json')

const LoggerMiddleware = (req, res, next) => {
  console.log(`Logged  ${req.url}  ${req.method} ${req}-- ${new Date()}`)
  next()
}
app.use(LoggerMiddleware)
app.use(cors())
app.use(bodyParser.json())

const saveToDB = data => {
  const fs = require('fs')

  fs.writeFile('./data.json', JSON.stringify(data, null, 2), err => {
    if (err) {
      console.error(err)
      return
    }
    console.log('File has been created')
  })
}

/*

C create - post
R read - get √
U
D
*/

const err = { error: 'Ooops! something went wrong !!' }
app.get('/', (req, res) => {
  res.send('welcome')
})
app.get('/blogs', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(JSON.stringify(data.blogs))
})
app.get('/blogs/:bid', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  console.log('params', req.params)
  console.log('BLOGS', data.blogs[1])
  const out = data.blogs[parseInt(req.params.bid)] || null
  res.send(out ? JSON.stringify(out) : JSON.stringify(err))
})

app.get('/articles/:bid', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  const out = data.articles[parseInt(req.params.bid)] || null
  res.send(out ? JSON.stringify(out) : JSON.stringify(err))
})

app.get('/comments/:aid', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  const out = data.comments[parseInt(req.params.aid)] || null
  res.send(out ? JSON.stringify(out) : JSON.stringify(err))
})

app.post('/create_blog', (req, res) => {
  console.log(req.body.blogName)
  const bName = req.body.blogName
  if (bName) {
    let index = data.blogs.length
    index = index + 1
    data.blogs.push({ name: bName, id: index })
    res.send({ STATUS: 200, id: index })
    saveToDB(data)
  }
})

app.post('/create_article', (req, res) => {
  const bId = req.body.bId
  const title = req.body.title
  const text = req.body.text

  if (bId && title && text) {
    let index = data.articles[bId].length
    index = index + 1
    console.log(data.articles[bId.toString()])
    data.articles[bId.toString()].push({
      bId: bId,
      title: title,
      content: text,
      id: index
    })
    res.send({ STATUS: 200, id: index })
    saveToDB(data)
  } else {
    res.send({ STATUS: 500, err: 'not valid data' })
  }
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
