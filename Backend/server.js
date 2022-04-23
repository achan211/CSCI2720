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
    User.find((err, e) => {
      if (err) res.send(err);
      else res.send(e);
    })
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

  // Add User Comment

  // User Favoriate Array

  // Request Updated Data

  // Login

  // Logout

  // Admin Retrieve Location (latlong and name)

  // Admin Update Location (latlong and name)

  // Admin delete Location

  // Admin Retrieve User Data

  // Admin Update User Data

  // Admin delete User
})
// listen to port 3000
const server = app.listen(3000);

// Step 1 create folder
// npm init
// install all packages you need
// npm start
