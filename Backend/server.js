const express = require('express'); 
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://stu002:p233183-@csci2720.6hfif.mongodb.net/stu002'); // This is the mongoose connect line. 
const bodyParser = require('body-parser');
const res = require('express/lib/response');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

const db = mongoose.connection;
// Upon connection fail
db.on('error', console.error.bind(console, 'Connection error:'));
// Upon opening the database successfully
db.once('open', function() {
  console.log("Connection is open...");

  const UserSchema = mongoose.Schema({
    username: {type: String, required: true, unique: true},
    pwd: {type: String, required: true},
    admin: {type: Boolean, required: true},
    favourite: [{type: mongoose.Schema.Types.ObjectId, ref: 'Location'}]
  });

  const LocationSchema = mongoose.Schema({
    locName: {type: String, required: true, unique: true},
    locLat: {type: String, required: true},
    locLong: {type: String, required: true},
  });

  const CommentSchema = mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    loc: {type: mongoose.Schema.Types.ObjectId, ref: 'Location'},
    comment: {type: String}
  });

  const User = mongoose.model('User', UserSchema);
  const Location = mongoose.model('Location', LocationSchema);
  const Comment = mongoose.model('Comment', CommentSchema);

  app.get('/', (req, res) => {
    res.send("Hello! Welcome to Weathering with Me!")
  })

  app.get('/example', (req, res) => {
    fetch('http://api.weatherapi.com/v1/current.json?key=d73c8d825739428089d134440222304&q=London')
    .then(res => res.json())
    .then(text => res.send(text));
  })

  // Location: Hong-Kong, London, New-York, Tokyo, Osaka, Singapore, Taipei, Paris, Rome, Berlin, Asterdam, Seoul, Bangkok, Shanghai, Dubai

  // Retrieve temp_c, wind_kph, wind_dir, humidity, precip_mm, vis_km

  //Example of getting JSON file from Weatherapi.com
  //So to get current weather for London: JSON: http://api.weatherapi.com/v1/current.json?key=d73c8d825739428089d134440222304&q=London

  // Add User Comment - DONE!
  app.post('/newComment', (req, res) => {
    var user_id
    var loc_id
    User.findOne({username: req.body['username']}, '_id').exec()
    .then(r => {
      user_id = r._id;
      console.log(user_id);
      return user_id;
    })
    .then(() => {
      Location.findOne({locName: req.body['locName']}, '_id').exec()
      .then(r => {
        loc_id = r._id;
        console.log(loc_id);
        return loc_id;
      })
      .then(() => {
        Comment.create({
          user: user_id,
          loc: loc_id,
          comment: req.body['comment']
        }).then(() => {
          Comment.findOne({user: user_id, loc: loc_id}, '-_id user loc comment')
          .populate('user', '-_id username')
          .populate('loc', '-_id locName')
          .exec((err, comment) => {
            if (err) res.send(err)
            else {
              if (comment != null){
                var string = JSON.stringify(comment, null, 1);
                res.set('Content-Type', 'text/plain');
                res.status(201);
                res.send(string);
              } else {
                res.status(404);
                res.send("Opps! Something went wrong!");
              }
            }
          })
        })
      })
    })
  })

  // See Comment based on Location - DONE!
  app.get('/:locName/comment', (req, res) => {
    var loc_id
    Location.findOne({locName: req.params['locName']}, '_id').exec()
    .then((r) => {
      if (r!= null) loc_id = r._id
    })
    .then(() => {
      Comment.find({loc: loc_id}, '-_id user loc comment')
      .populate('user', '-_id username')
      .populate('loc', '-_id locName')
      .exec()
      .then((r) => {
        var string = JSON.stringify(r, null, 1);
        res.set('Content-Type', 'text/plain');
        res.status(200);
        res.send(string);
      })
    })
  })

  // View User Favourite Array
  app.get('/favourite/:username', (req, res) => {
    User.findOne({username: req.params['username']}, '-_id favourite')
    .populate('favourite', '-_id locName')
    .exec()
    .then(fav => {
      res.send(JSON.stringify(fav.favourite))
    })
  })
  
  // Select a location, then add favourite
  app.put('/favourite/:username/:locName', (req, res) => {
    var loc_id
    Location.findOne({locName: req.body['locName']}, '_id').exec()
    .then(r => {
      loc_id = r._id
    })
    .then(() => {
      console.log(loc_id)
      User.findOneAndUpdate({username: req.body['username']}, {
        // add location to array
        $addToSet: {
          favourite: loc_id
        }
      }).exec()
      .then(r => {
        if (r != null) {
          User.find({username: req.body['username']}, '-_id username favourite').exec()
          .then(r => {
            res.send(r)
          })
        }
      })
    })
  })

  // Request Updated Data

  // Login

  // Logout

  // Admin Retrieve Location (latlong and name)
  app.get('/loc/:locName', (req, res) => {
    Location.findOne({locName: req.params['locName']}, '_id locName locLat locLong').exec()
    .then(r => {
      res.send(r);
    })
  })

  // Admin Update Location (latlong and name)

  // Admin delete Location

  // Admin Retrieve User Data
  app.get('/user/:username', (req, res) => {
    User.findOne({username: req.params['username']}, '_id username pwd admin favourite').exec()
    .then(r => {
      res.send(r);
    })
  })

  // Admin Update User Data

  // Admin delete User

})

// listen to port 3000
const server = app.listen(3000);

// Step 1 create folder
// npm init
// install all packages you need
// npm start
