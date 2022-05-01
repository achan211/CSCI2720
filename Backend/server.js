// Use Port 4000!

const express = require('express'); 
const app = express();
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://stu002:p233183-@csci2720.6hfif.mongodb.net/stu002'); // This is the mongoose connect line. 
const bodyParser = require('body-parser');
const res = require('express/lib/response');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());
app.use(express.static(path.resolve(__dirname,'../frontend/build')))
const api_key = "d73c8d825739428089d134440222304"
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

  app.get('/example', (req, res) => {
    fetch('http://api.weatherapi.com/v1/current.json?key=d73c8d825739428089d134440222304&q=London')
    .then(res => res.json())
    .then(text => res.send(text));
  })

  // TO DO - Urgent: 
  // Seperate View for Each Locations (Frontend)
  // Admin CRUD Page for Users and Locations (Frontend)
  // index.html now showing what????? (Frontend)
  // Sorting based locName, locLong, locLat (Frontend)
  // Favourite Location View, and Add Favourite Button
  // Show username and Login/Logout (Jimmy - Session / Backend?)
  // Admin have button at seperate Location views to refresh Location temperature data (Frontend for button, Backend for update data)
  // function Login (Frontend + Jimmy) 

  // TO DO - Not very urgent but Urgent: 
  // Think think how VM works (ALL)
  // Project Documentations (ALL)
  // Include full names and student IDs of all members in all code files using comments. (ALL)


  // Search for Location - DONE!
  app.get('/loc', (req, res) => { // query in the form /loc?keyword=Hong-Kong
    var keyword = req.query['keyword'];
    // res.send(keyword)
    Location.find({locName: {$regex: keyword}}, '-_id locName locLat locLong').exec()
    .then(r => {res.send(r)})
  })

  // Login - DONE!

  app.post("/login", (req, res) => {
    // Form validation
  
    if (req.body['username'].length<4||req.body['username'].length>20) {
      return res.status(400).json("wrong name length");
    }

    if (req.body["pwd"].length<4||req.body['pwd'].length>20) {
      return res.status(400).json("wrong password length");
    }
  //  username: req.body["username"],
   // pwd: req.body["pwd"],
   // admin: Ad,
    const password = req.body.pwd;
  // Find user by email
    User.findOne({ username: req.body['username'] }).then(user => {
      // Check if user exists

    
      if (user==null) {
        return res.status(404).json({ Usernotfound: "user not found" });
      }
  // Check password
      bcrypt.compare(password, user.pwd).then(isMatch => {
        if (isMatch) {
         
        res.setHeader('Set-Cookie','loggined=true');
        res.send('login successful')
        } else {
          return res
            .status(400)
            .json({ passwordincorrect: "Password incorrect" });
        }
      });
    });
  });

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

  // Logout

  // View User Favourite Array - DONE!
  app.get('/favourite/:username', (req, res) => {
    User.findOne({username: req.params['username']}, '-_id favourite')
    .populate('favourite', '-_id locName locLat locLong')
    .exec()
    .then(fav => {
      res.send(JSON.stringify(fav.favourite))
    })
  })
  
  // Select a location, then add favourite - DONE!
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
  
  // Admin Create Location (create by locat name)-->DONE
  app.post("/location/:locName", (req, res) => {
    var name = req.params["locName"];
    var link =
      `http://api.weatherapi.com/v1/current.json?key=${api_key}&q=` + name;
    fetch(link)
      .then((res) => res.json())
      .then((text) => {
        if (text.error) {
          res.status(404).send("Location does not exist");
        } else {
          Location.create({
            locName: text.location.name,
            locLat: text.location.lat,
            locLong: text.location.lon,
          }).then(
            (results) => {
              res.status(201).send("Ref: " + results);
            },
            (err) => {
              res.contentType("text/plain");
              res.send(err);
            }
          );
        }
      })
      .catch((error) => {
        res.status(404).send("Getting Error");
      });
  });

  // Admin Retrieve Location (latlong and name) -->DONE
  app.get("/location/:locat", (req, res) => {
    var loc = req.params["locat"];
    var link =
      `http://api.weatherapi.com/v1/current.json?key=${api_key}&q=` + loc;
    fetch(link)
      .then((res) => res.json())
      .then((text) => {
        if (text.error) {
          res.status(404).send("Location does not exist");
        } else {
          var data = {
            Name: text.location.name,
            Latitude: text.location.lat,
            Longitude: text.location.lon,
            Temperature: text.current.temp_c,
            Wind_speed: text.current.wind_kph,
            Wind_direction: text.current.wind_dir,
            Humidity: text.current.humidity,
            Precipitation: text.current.precip_mm,
            Visibility: text.current.vis_km,
          };
          res.send(JSON.stringify(data, null, "\t"));
        }
      })
      .catch((error) => {
        res.status(404).send("Getting Error");
      });
  });

  //retireve all Location name
  app.get("/location", (req, res) => {
    var query = Location.find();
    query.select("-_id locName locLat locLong");
    query.exec().then(
      (results) => {
        if (results == null) {
          res
            .status(404)
            .send("This location is not existed.\n404 Not Found\n");
        } else {
          res.send(results)
        }
      },
      (err) => {
        res.contentType("text/plain");
        res.send(err);
      }
    );

  });

  // Admin Update Location (latlong and name)-->DONE
  app.put("/location/:locat", (req, res) => {
    var loc = req.params["locat"];
    var link =
      `http://api.weatherapi.com/v1/current.json?key=${api_key}&q=` + loc;
    fetch(link)
      .then((res) => res.json())
      .then((text) => {
        if (text.error) {
          res.status(404).send("Location does not exist");
        } else {
          Location.findOneAndUpdate(
            { locName: req.params["locat"] },
            {
              locName: text.location.name,
              locLat: text.location.lat,
              locLong: text.location.lon,
            }
          )
            .exec()
            .then(
              (re) => {
                if (re == null) {
                  res.contentType("text/plain");
                  res
                    .status(404)
                    .send("This event is not existed.\n404 Not Found\n");
                } else {
                  res.contentType("text/plain");
                  res.send("Ref: " + re);
                }
              },
              (err) => {
                res.contentType("text/plain");
                res.send(err);
              }
            );
        }
      })
      .catch((error) => {
        res.status(404).send("Getting Error");
      });
  });

  // Admin delete Location (search by locat name)-->DONE

  app.delete("/location/:locat", (req, res) => {
    var query = Location.findOne({ locName: req.params["locat"] });
    query.exec().then(
      (results) => {
        if (results == null) {
          res.contentType("text/plain");
          res
            .status(404)
            .send("This location is not existed.\n404 Not Found\n");
        } else {
          Location.deleteOne({ _id: results._id }).then(
            function () {
              res.status(204).send("204 No Content");
            },
            (error) => {
              res.contentType("text/plain");
              res.send(error);
            }
          );
        }
      },
      (err) => {
        res.contentType("text/plain");
        res.send(err);
      }
    );
  });

  //Admin Create User-->DONE
  app.post("/user", (req, res) => {
    if (req.body["admin"] == "false") {
      var Ad = false;
    } else if (req.body["admin"] == "true") {
      var Ad = true;
    } else {
      var Ad = null;
    }
    if (Ad != null) {

      const newUser = new User({
        username: req.body["username"],
        pwd: req.body["pwd"],
        admin: Ad,
      });


      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser. pwd, salt, (err, hash) => {
          if (err) throw err;
          newUser. pwd = hash;
          newUser
            .save().then(
        (results) => {
          res.status(201).send("Ref: " + results);
        },
        (err) => {
          res.contentType("text/plain");
          res.send(err);
        }
      );
    });
  });}
  else {
      res.status(404).send("Cannot create user");
    }
  });

  // Admin Retrieve User Data // search query-->DONE
  app.get("/user", (req, res) => {
    //req.query
    //console.log(req.query)
    var query = User.findOne({
      username: req.query["username"],
      pwd: req.query["pwd"],
    });

    query.select("-_id username admin favourite");
    query.populate('favourite', '-_id locName').exec().then(
      (results) => {
        if (results == null) res.send("There is no user available");
        else {
          var event = JSON.stringify(results, null, "\t");
          res.send(event);
          
        }
      },
      (error) => {
        res.contentType("text/plain");
        res.send(error);
      }
    );
  });

  // Admin Update User Data -->DONE
  // Can user update favourite location?
  // this part assume not ok
  app.put("/user", (req, res) => {
    //req.query
    var query = Location.findOneAndUpdate(
      { username: req.body["username"], pwd: req.body["pwd"] },
      {
        username: req.body["newusername"],
        pwd: req.body["newpwd"],
        admin: req.body["admin"],
      }
    );
    query.exec().then(
      (results) => {
        if (results == null) res.send("There is no user available");
        else {
          res.contentType("text/plain");
          var event = JSON.stringify(results, null, "\t");
          res.send(event);
        }
      },
      (error) => {
        res.contentType("text/plain");
        res.send(error);
      }
    );
  });

  // Admin delete User-->DONE
  app.delete("/user/:username", (req, res) => {
    var query = User.findOne({ username: req.params["username"] });
    query.exec().then(
      (results) => {
        if (results == null) {
          res.contentType("text/plain");
          res
            .status(404)
            .send("This user is not existed.\n404 Not Found\n");
        } else {
          User.deleteOne({ _id: results._id }).then(
            function () {
              res.status(204).send("204 No Content");
            },
            (error) => {
              res.contentType("text/plain");
              res.send(error);
            }
          );
        }
      },
      (err) => {
        res.contentType("text/plain");
        res.send(err);
      }
    );
  });

  app.get("/api", (req, res) => {
    res.json({message:"Hello from sever"})
  });

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname,'../frontend/build'))
  });


})

// listen to port 5000
const PORT = 4000
const server = app.listen(PORT,()=>{
  console.log(`Server listening on ${PORT}`);
});

// Step 1 create folder
// npm init
// install all packages you need
// npm start