const express = require('express')
const multer = require('multer')
const bodyParser = require('body-parser')
const shortid = require('shortid')
const nunjucks = require('nunjucks')
const logger = require('morgan')
const router = express.Router()
const app = express()
const port = 3000

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
      if(file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
        cb(null, shortid.generate() + '_' + file.originalname)
      } else {
          console.log(file.mimetype)
      }
    }
})
  
const upload = multer({ storage: storage })

app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(logger('dev'));
app.use('/public', express.static('public'))
nunjucks.configure('views', {
    autoescape: true,
    express: app,
    watch: true,

})
app.engine('html',nunjucks.render)
app.set('view engine','html')
app.use(router)

router.get('/', (req, res, next) => {
    res.render('index')
    next()
})

router.post('/profile', upload.array('photos', 10), function (req, res, next) {
    res.json(req.files)
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
  })

app.listen(port, function () {
    console.log(`server on running on port ${port}`)
})