const express = require('express'); 
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://stu002:p233183-@csci2720.6hfif.mongodb.net/stu002'); // This is the mongoose connect line. 
const bodyParser = require('body-parser');
const res = require('express/lib/response');
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
})
// listen to port 3000
const server = app.listen(3000);
