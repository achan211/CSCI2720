// Name and SID (alphabetically):
// Alvin CHAN 1155108897
// Chun Yeung CHOW 1155131406
// Ngou Shan WONG 1155141835
// Siu Fung CHEUNG 1155110966
// Wing Lam CHENG 1155125313
// Yee Han CHENG 1155143426

const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://stu002:p233183-@csci2720.6hfif.mongodb.net/stu002"
); // This is the mongoose connect line.
const bodyParser = require("body-parser");
const res = require("express/lib/response");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static(path.resolve(__dirname, "../frontend/build")));
const api_key = "d73c8d825739428089d134440222304";
const db = mongoose.connection;
// Upon connection fail
db.on("error", console.error.bind(console, "Connection error:"));
// Upon opening the database successfully
db.once("open", function () {
  console.log("Connection is open...");

  const UserSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    pwd: { type: String, required: true },
    admin: { type: Boolean, required: true },
    favourite: [{ type: mongoose.Schema.Types.ObjectId, ref: "Loc" }],
  });

  const LocationSchema = mongoose.Schema({
    locName: { type: String, required: true, unique: true },
    locLat: { type: String, required: true },
    locLong: { type: String, required: true },
  });

  const CommentSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    loc: { type: mongoose.Schema.Types.ObjectId, ref: "Loc" },
    comment: { type: String },
  });

  const User = mongoose.model("User", UserSchema);
  const Loc = mongoose.model("Loc", LocationSchema);
  const Comment = mongoose.model("Comment", CommentSchema);

  app.get("/example", (req, res) => {
    fetch(
      "http://api.weatherapi.com/v1/current.json?key=d73c8d825739428089d134440222304&q=London"
    )
      .then((res) => res.json())
      .then((text) => res.send(text));
  });

  // Search for Location - DONE!
  app.get("/loc", (req, res) => {
    // query in the form /loc?keyword=Hong-Kong
    var keyword = req.query["keyword"];
    // res.send(keyword)
    Loc.find(
      { locName: { $regex: keyword } },
      "-_id locName locLat locLong"
    )
      .exec()
      .then((r) => {
        res.send(r);
      });
  });

  // Login - DONE!

  app.post("/login", (req, res) => {
    // Form validation
    if (req.body["username"].length < 4 || req.body["username"].length > 20) {
      return res.status(400).json("wrong name length");
    }

    if (req.body["pwd"].length < 4 || req.body["pwd"].length > 20) {
      return res.status(400).json("wrong password length");
    }
    const password = req.body.pwd;
    // Find user by email
    User.findOne({ username: req.body["username"] }).then((user) => {
      // Check if user exists

      if (user == null) {
        return res.status(404).json({ Usernotfound: "user not found" });
      }
      // Check password
      bcrypt.compare(password, user.pwd).then((isMatch) => {
        if (isMatch) {
          res.cookie('name', req.body["username"]);
            
          res.cookie('loggined', 'true');
        //  set username in cookie
          res.send("login successful");
        } else {
          return res
            .status(400)
            .json({ passwordincorrect: "Password incorrect" });
        }
      });
    });
  });

  // Add User Comment - DONE!
  app.post("/newComment", (req, res) => {
    var user_id;
    var loc_id;
    User.findOne({ username: req.body["username"] }, "_id")
      .exec()
      .then((r) => {
        user_id = r._id;
        return user_id;
      })
      .then(() => {
        Loc.findOne({ locName: req.body["locName"] }, "_id")
          .exec()
          .then((r) => {
            loc_id = r._id;
            console.log(loc_id);
            return loc_id;
          })
          .then(() => {
            Comment.create({
              user: user_id,
              loc: loc_id,
              comment: req.body["comment"],
            }).then(() => {
              Comment.findOne(
                { user: user_id, loc: loc_id },
                "-_id user loc comment"
              )
                .populate("user", "-_id username")
                .populate("loc", "-_id locName")
                .exec((err, comment) => {
                  if (err) res.send(err);
                  else {
                    if (comment != null) {
                      var string = JSON.stringify(comment, null, 1);
                      res.set("Content-Type", "text/plain");
                      res.status(201);
                      res.send(string);
                    } else {
                      res.status(404);
                      res.send("Opps! Something went wrong!");
                    }
                  }
                });
            });
          });
      });
  });

  // See Comment based on Location - DONE!
  app.get("/comment/:locName", (req, res) => {
    var loc_id;
    Loc.findOne({ locName: req.params["locName"] }, "_id")
      .exec()
      .then((r) => {
        if (r != null) loc_id = r._id;
      })
      .then(() => {
        Comment.find({ loc: loc_id }, "-_id user loc comment")
          .populate("user", "-_id username")
          .populate("loc", "-_id locName")
          .exec()
          .then((r) => {
            var string = JSON.stringify(r, null, 1);
            res.status(200);
            res.send(string);
          });
      });
  });

  // View User Favourite Array - DONE!
  app.get("/favourite/:username", (req, res) => {
    User.findOne({ username: req.params["username"] }, "-_id favourite")
      .populate("favourite", "-_id locName locLat locLong")
      .exec()
      .then((fav) => {
        res.send(JSON.stringify(fav.favourite));
      });
  });

  // Select a location, then add favourite - DONE!
  app.put("/favourite/:username/:locName", (req, res) => {
    var loc_id;
    Loc.findOne({ locName: req.body["locName"] }, "_id")
      .exec()
      .then((r) => {
        loc_id = r._id;
      })
      .then(() => {
        console.log(loc_id);
        User.findOneAndUpdate(
          { username: req.body["username"] },
          {
            // add location to array
            $addToSet: {
              favourite: loc_id,
            },
          }
        )
          .exec()
          .then((r) => {
            if (r != null) {
              User.find(
                { username: req.body["username"] },
                "-_id username favourite"
              )
                .exec()
                .then((r) => {
                  res.send(r);
                });
            }
          });
      });
  });

  // Admin Create Location (create by locat name)-->DONE
  app.post("/location", (req, res) => {
    var name = req.body["locName"];
    var link =
      `http://api.weatherapi.com/v1/current.json?key=${api_key}&q=` + name;
    fetch(link)
      .then((res) => res.json())
      .then((text) => {
        if (text.error) {
          res.status(404).send("Location does not exist");
        } else {
          Loc.create({
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
    var query = Loc.find();
    query.select("-_id locName locLat locLong");
    query.exec().then(
      (results) => {
        if (results == null) {
          res
            .status(404)
            .send("This location is not existed.\n404 Not Found\n");
        } else {
          res.send(results);
        }
      },
      (err) => {
        res.contentType("text/plain");
        res.send(err);
      }
    );
  });

  // Search matching location
  // use form submit to pass the searching location
  app.get("/searchLoc", (req, res) => {
    var search = req.query["search"];
    var query = Loc.find({ locName: { $regex: new RegExp(search,"i") } });
    query.select("-_id locName locLat locLong");
    query.exec().then(
      (results) => {
        if (results == null) {
          res
            .status(404)
            .send("This location is not existed.\n404 Not Found\n");
        } else {
          res.send(results);
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
          Loc.findOneAndUpdate(
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
    var query = Loc.findOne({ locName: req.params["locat"] });
    query.exec().then(
      (results) => {
        if (results == null) {
          res.contentType("text/plain");
          res
            .status(404)
            .send("This location is not existed.\n404 Not Found\n");
        } else {
          Loc.deleteOne({ _id: results._id }).then(
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
    const newUser = new User({
      username: req.body["username"],
      pwd: req.body["pwd"],
      admin: false,
    });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.pwd, salt, (err, hash) => {
          if (err) throw err;
          newUser.pwd = hash;
          newUser.save().then(
            (results) => {
              res.status(201).send("Ref: " + results);
            },
            (err) => {
              res.contentType("text/plain");
              res.send(err);
            }
          );
        });
      });
  });

  // Admin Retrieve User Data // search query-->DONE
  app.get("/user", (req, res) => {
    if (req.query["username"] != null) { // if have query
      var query = User.find({
        username: req.query["username"]
      });
      query.select("-_id username pwd");
      query.exec().then(
        (results) => {
          res.send(results);
        },
        (err) => {
          res.contentType("text/plain");
          res.send(err);
        }
      )
    } else {
      var query = User.find(); // if have no query then it means search all
      query.select("-_id username pwd");
      query.exec().then(
        (results) => {
          if (results == null) {
            res
              .status(404)
              .send("Something is wrong.");
          } else {
            res.send(results);
          }
        },
        (err) => {
          res.contentType("text/plain");
          res.send(err);
        }
      )}
  });

  // Admin Update User Data - DONE!
   app.put("/user", (req, res) => {
    bcrypt.genSalt(10, (err, salt) => {
     
      bcrypt.hash(req.body["newpassword"], salt, (err, hash) => {
        if (err) throw err;
        req.body["newpassword"] = hash;
        var query = User.findOneAndUpdate(
          { username: req.body["username"]},
          {
            username: req.body["newusername"],
            pwd: req.body["newpassword"],
          }
        );
        query.exec().then(
          (results) => {
            if (results != null) {
              res.contentType("text/plain");
              res.status(200);
              var event = JSON.stringify(results, null, "\t");
              res.send(event);
            } else {
              res.status(404);
              res.send("Opps...")
            }
          },
          (error) => {
            res.contentType("text/plain");
            res.send(error);
          }
        );
      });
    });

    
    
  });

  // Admin delete User-->DONE
  app.delete("/user/:username", (req, res) => {
    var query = User.findOne({ username: req.params["username"] });
    query.exec().then(
      (results) => {
        if (results == null) {
          res.contentType("text/plain");
          res.status(404).send("This user is not existed.\n404 Not Found\n");
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
    res.json({ message: "Hello from sever" });
  });

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build"));
  });
});

const PORT = 4000;
const server = app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});