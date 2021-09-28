// call all the required packages
const express = require('express')
const multer = require('multer');
const fs = require("fs")
const app = express();
const cors = require("cors");
const bcrypt = require('bcrypt')
const saltRounds = 10;
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const njwt = require('njwt');

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
// in latest body-parser use like below.
app.use(bodyParser.urlencoded({ extended: true }));

//db connection
let db = new sqlite3.Database('../imagerepo.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("connection to database successful")
})


// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../client/public/images')
  },



  filename: function (req, file, cb) {
    var g = file.mimetype
    let re = new RegExp('^[^/]*\/')
    g = g.replace(re, "")
    cb(null, Date.now() + '.' + g)
  }

})

// Set up file upload with multer middleware
var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    }
    else {
      cb(null, false);
      return false

    }
  }
});

//ROUTES WILL GO HERE

//Upload a single file to Image Repository
app.post('/upload', upload.single('file'), (req, res, next) => {
  const file = req.file
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    res.status(400)
    res.send("Failed to Upload Image, no file provided")
    return next(error)
  }

  data = {
    $imagePath: file.filename,
    $imagePoster: req.body.user,
    $imageCaption: req.body.caption
  }

  let sql = `INSERT INTO image (imagePath, imagePoster, privacy, caption) VALUES ($imagepath, $imagePoster, 'public', $imageCaption)`
  let sqlLike = `INSERT INTO likeCount (imageID) SELECT imageID FROM image WHERE imagePath = ?`
  db.run(sql, [data.$imagePath, data.$imagePoster, data.$imageCaption], function (err) {
    if (err) {
      console.log(err.message)
      res.status(500);
      res.send("Failed to Upload Image to database")
    }
  });


  db.run(sqlLike, [data.$imagePath], function (err) {
    if (err) {
      console.log(err.message)
      res.status(500);
      res.send("Failed to Generate Information for Image")
    }
  })
  res.send(true)
})

//Delete an image from the image repository
app.post("/delete/:image", function (req, res) {
  var image = req.params.image


  imagesql = `SELECT imagePath FROM image WHERE imagePath = ?`
  db.get(imagesql, [image], function (err, value) {
    console.log("value", value)
    if (value === undefined) {
      console.log("error")
      res.status(500)
      return res.end()

    }
  })

  var sql = `DELETE FROM image WHERE imagePath = ?`

  const path = '../client/public/images/' + image

  db.run(sql, [image], function (err, rows) { //delete image data from database
    if (err) {
      res.status(500)
      console.log("Deletion Error")
      return res.end()

    }
  })

  fs.unlink(path, (err) => { //delete image from file system
    if (err) {
      res.status(500)
      console.log("Deletion Error")
      return res.end()

    }
    else {
      res.send("Image Successfully deleted")
    }

  })





})

//Get images for given user
app.get('/imageNames/:username', function (req, res) {
  var username = req.params.username
  let usersql = `SELECT username FROM user WHERE username = ?`

  db.get(usersql, [username], function (err, value) {
    if (value === undefined) {
      console.log("error")
      res.status(500)
      return

    }
  })

  let sql = `SELECT imagePath, caption, privacy FROM image WHERE imageposter = ?`

  db.all(sql, [username], function (err, rows) {
    if (err) {
      res.send(err.message)
      return
    }
    var arr = []
    const dir = '../client/public/images'
    for (const row of rows) {
      arr.push(row)
    }
    res.send(arr)

  })
})

//Register new user into application
app.post('/register/', function (req, res) {



  let sql = `INSERT INTO user (username, password) VALUES ($username, $password)`
  var email = req.body.email
  var password = req.body.password

  if (email === undefined || password === undefined) {
    res.status(500)
    console.log("Missing critical information")
    return res.end();
  }


  bcrypt.genSalt(saltRounds, function (err, salt) {
    bcrypt.hash(password, salt, function (err, hash) {
      db.run(sql, [email, hash], function (err) {
        if (err) {
          res.status(500);
          res.send(false)
          return res.end();
        }
        res.send(true)
      });
    });
  })

})

//Login to application with existing user
app.post('/login/', function (req, res) {

  let skeysql = `SELECT skey FROM auth`
  let sql = `SELECT password FROM user WHERE username = ?`
  let authsql = `UPDATE user SET jti = ? WHERE username = ?`
  var email = req.body.email
  var password = req.body.password

  var claims = {
    sub: email,
    scope: "self, admins"
  }

  db.get(skeysql, [], function (err, row) {
    if (err) {
      res.send(err.message)
      res.status(500)
      return res.end()
    }

    var buff = Buffer.from(row.skey, 'base64')
    var jwt = njwt.create(claims, buff)

    var token = jwt.compact();

    db.get(sql, [email], function (err, row) {

      if (err) {
        res.send(err.message)
        res.status(500)
        return res.end()
      }
      try {
        bcrypt.compare(password, row.password, function (err, result) {
          if (err) {
            res.send(err.message)
            res.status(500)
            return res.end()
          }
          if (result) {
            db.run(authsql, [jwt.body.jti, email], function (err, row) {
              if (err) {
                res.send(err.message)
                res.status(500)
                return res.end()
              }
              res.send(token)
            })
          }
          else {
            res.send(false)
          }
        })
      } catch (e) {
        res.send(false)
      }

    });

  });

})

//Verify that jwt token is valid
app.post("/authenticate/", function (req, res) {

  var token = req.body.token

  if (token === undefined) {
    res.status(500);
    res.send("Failed to authenticate, no token provided");
    return
  }
  let skeysql = `SELECT skey FROM auth`
  let usersql = `SELECT username FROM user WHERE jti = ?`

  db.get(skeysql, [], function (err, row) {
    if (err) {
      res.status(500);
      res.send("Error processing token");
      return
    }

    var buff = Buffer.from(row.skey, 'base64')

    njwt.verify(token, buff, function (err, verifiedJwt) {
      if (err) {
        res.status(500)
        res.send("Failed to verify token")
        return
      }

      try {
        db.get(usersql, [verifiedJwt.body.jti], function (err, row) {
          if (err) {
            console.log(false)
            return
          }
          res.send(row)
        })
      }
      catch (err) {
        res.send(false)
        return
      }

    });

  })

})

//Alter privacy of uploaded image
app.post("/private/:imagename/:flag", function (req, res) {
  var imagename = req.params.imagename
  var flag = req.params.flag

  if (flag != "private" && flag != "public") {
    res.status(500)
    console.log("invalid selection")
    return res.end();
  }


  let imagesql = `SELECT imagePath FROM image WHERE imagePath = ?`
  db.get(imagesql, [imagename], function (err, value) {

    if (value === undefined) {

      res.status(500);
      console.log("image does not exist")
      return res.end();

    }
    let sql = `UPDATE image SET privacy = ? WHERE imagePath = ?`

    db.run(sql, [flag, imagename], function (err, row) {
      if (err) {
        console.log(err.message)
      }

    })
    res.send("Image Successfully Privated")

  })


})

//Get all images in database that are public
app.get("/publicimages", function (req, res) {
  let sql = `SELECT image.imageID, imagePath, imagePoster, caption, likeCount.likes FROM image INNER JOIN likeCount ON image.imageID = likeCount.imageID WHERE privacy = ?`

  db.all(sql, ['public'], function (err, rows) {
    if (err) {
      res.send(err.message)
      return
    }

    res.send(rows)

  });

})

//Get images from a specific user accessible by other users
app.get("/userprofile/:user", function (req, res) {
  var username = req.params.user

  let usersql = `SELECT username FROM user WHERE username = ?`

  db.get(usersql, [username], function (err, value) {
    if (value === undefined) {
      res.status(500);
      console.log("user not exist")
      return res.end();
    }
    
    let sql = `SELECT image.imageID, likeCount.likes, imagePath, caption FROM image INNER JOIN likeCount ON image.imageID = likeCount.imageID WHERE imagePoster = ? AND privacy = 'public'`

    db.all(sql, [username], function (err, rows) {
      if (err) {
        res.send(err.message)
        return
      }
      res.send(rows)
    })
  })



})

//Like an image
app.post("/like/:image/:username", function (req, res) {
  var image = req.params.image
  var username = req.params.username

  if (username == 'undefined') { //cannot like if the user is not validated
    console.log('expired token')
    res.send(false)
    return
  }

  let usersql = `SELECT username FROM user WHERE username = ?`
  let imagesql = `SELECT imagePath FROM image WHERE imagePath = ?`

  db.get(usersql, [username], function (err, UserValue) {

    if (UserValue === undefined) {
      res.status(500)
      console.log("User does not exist")
      return res.end();
    }
    



      let sql = `SELECT * FROM ImageLikes WHERE EXISTS (SELECT * FROM ImageLikes WHERE imageID = ? AND userLike = ?)`
      let addLike = `UPDATE likeCount SET likes = likes + 1 WHERE imageID = ?`
      let addLikeData = `INSERT INTO ImageLikes (imageID, userLike) VALUES (?,?)`
    
      db.get(sql, [image, username], function (err, row) {
    
        if (row != null) {
          res.status(500)
          console.log("user already liked this image")
          return res.end();
        }
    
        db.run(addLike, [image], function (err) {
          if (err) {
            res.send(err.message)
            return
          }
        })
    
        db.run(addLikeData, [image, username], function (err) {
          if (err) {
            res.send(err.message)
            return
          }
        })
    
        
      })
      res.send(true)
    
  })


  })

 


module.exports = app

app.listen(8000, () => console.log('Server started on port 3000'));