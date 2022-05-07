import ReactDOM from "react-dom";
import "./App.css";
import React, { useEffect } from "react";
import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useMatch,
  useParams,
  useLocation,
  useNavigate,
} from "react-router-dom";

function App() {
  const [data, setData] = useState(null);
  React.useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  return (
    <>
      <BrowserRouter>
        <div>
          <nav
            class="navbar navbar-expand-lg navbar-light"
            style={{ backgroundColor: "silver" }}
          >
            <div class="collapse navbar-collapse" id="navbarNav">
              <img class="ms-4" src="\images\favicon.png"></img>
              <span
                style={{
                  fontWeight: "bold",
                  fontFamily: "Square Peg",
                  fontSize: "30px",
                }}
                class="navbar-brand me-4 mb-0 h1"
              >
                {" "}
                &nbsp;Weathering With Me
              </span>
              <NavList />
            </div>
            <Logout username="Admin" />
            {/*----------todo:username----------*/}
          </nav>

          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route path="/favloc" element={<FavLoc />} />
            <Route path="/createaccount" element={<CreateAccount />} />
            <Route path="/location/:loc" element={<Location_details />} />
            <Route path="/admin" element={<Admin_page />} />
            <Route path="*" element={<NoMatch />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

function LongLink({ label, to }) {
  let match = useMatch({ path: to });
  return (
    <li style={{ listStyleType: "none" }}>
      {match && " "}
      <Link
        style={{ color: "#484848", textDecoration: "none", fontSize: "20px" }}
        to={to}
      >
        &nbsp;{label}
      </Link>
    </li>
  );
}

function NoMatch() {
  let location = useLocation();
  return (
    <div>
      <h3>
        No match for <code>{location.pathname}</code>
      </h3>
    </div>
  );
}

// TO DO: User UD, Location UD
function Admin_page() {
  const [locData, setlocData] = useState([]);
  const [userData, setuserData] = useState([]);

  const [userAction, setUA] = useState("Choose");
  const [userName, setU] = useState("");
  const [pwd, setP] = useState("");

  const [locAction, setLA] = useState("Choose");
  const [locName, setLN] = useState("");
  const [locLat, setLat] = useState("");
  const [locLong, setLong] = useState("");

  const CRUDLocation = (e) => {
    e.preventDefault();
    if (locAction == "Choose") {
      alert("Please choose an action.")
    } else {
      switch (locAction){
        case "c":
          if (locName == "" || locLat == "" || locLong == "") {
            alert("Missing information.")
          } else {
            let bodytext = "locName=" + locName
            fetch("/location", {
              method: "POST", 
              headers: {"Content-Type": "application/x-www-form-urlencoded"},
              body: bodytext})
            .then(data => {
              console.log(locName)
              console.log(data);
              alert("You've created " + locName);
            })
          }
          break;
        case "r":
          if (locName == "") {
            fetch("/location")
            .then((r) => r.json())
            .then((data) => setlocData(data));
          } else {
            fetch("/searchLoc?search=" + locName)
            .then((r) => r.json())
            .then((data) => {
              let format = [{Name: data[0].locName, Latitude: data[0].locLat, Longitude: data[0].locLong}]
              console.log(format);
              setlocData(format);
            });
          }
          break;
        case "u":
          alert("Update")
          break;
        case "d":
          alert("Delete")
          break;
      }
    }
  };

  const CRUDUser = (e) => {
    e.preventDefault();
    if (userAction == "Choose") {
      alert("Please choose an action.")
    } else {
      switch (userAction){
        case "c":
          if (userName === "" || pwd === "") {
            alert("Missing information.")
          } else {
            let bodytext = "username=" + userName + "&pwd=" + pwd

            fetch("/user", {
                method: "POST", 
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: bodytext})
            .then(res => res.text())
            .then(data => console.log(data))
            alert("User is created! Please check!")
          }
          break;
        case "r":
          if (userName === "") {
            fetch("/user")
            .then((r) => r.json())
            .then((data) => setuserData(data));
          } else {
            fetch("/user?username=" + userName)
            .then((r) => r.json())
            .then((data) => {
              setuserData(data);
            });
          }
          break;
        case "u":
          alert("Update")
          break;
        case "d":
          fetch("/user/" + userName, {method: 'DELETE'})
          .then(data => {
            alert("User " + userName + " is deleted.")
          })
          console.log(userName)
          break;
      }
    }
  };

  const columns = userData[0] && Object.keys(userData[0]);

  return (
    <div class="container mt-3">
      <br />
      <h1>Admin Page</h1>
      <br />
      <div class="row">
        <div class="col">
          <h2>CRUD Users</h2>
          <form onSubmit={(e) => CRUDUser(e)}>
            <div className="mb-3">
            <select className="form-select" aria-label="Default select example" onChange={(e) => {setUA(e.target.value);}}>
              <option value="Choose" disabled selected>Choose an action</option>
              <option value="c">Create User</option>
              <option value="r">Retrieve User</option>
              <option value="u">Update User</option>
              <option value="d">Delete User</option>
            </select>
            </div>
            <div class="mb-3">
              <label for="username" class="form-label">
                Username
              </label>
              <input type="text" class="form-control" onChange={(e) => {setU(e.target.value);}} />
            </div>
            <div class="mb-3">
              <label for="Password" class="form-label">
                Password
              </label>
              <input
                type="password"
                class="form-control"
                id="Password"
                aria-describedby="passwordhelp" onChange={(e) => {setP(e.target.value);}}
              />
              <div id="passwordhelp" class="form-text">
                Leave blank if delete or retrive user.
              </div>
            </div>
            <div class="row gx-2">
              <button type="submit" className="btn btn-outline-secondary">Submit</button>
            </div>
          </form>
          <hr />
          {userData.length == 0 ? "" : <>
            <table class="table table-hover">
            <thead>
              <tr>
                <th scope="col">Username</th>
                <th scope="col">Password</th>
              </tr>
            </thead>
            <tbody>
              {userData.map((row) => (
                <tr>
                  {columns.map((column) => (
                    <td>{row[column]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          </>}
        </div>

        <div class="col">
          <h2>CRUD Locations</h2>
          <form onSubmit={(e) => CRUDLocation(e)}>
          <div className="mb-3">
            <select className="form-select" aria-label="Default select example" onChange={(e) => {setLA(e.target.value);}}>
              <option value="Choose" disabled selected>Choose an action</option>
              <option value="c">Create Location</option>
              <option value="r">Retrieve Location</option>
              <option value="u">Update Location</option>
              <option value="d">Delete Location</option>
            </select>
            </div>
            <div class="mb-3">
              <label for="locname" class="form-label">
                Location
              </label>
              <input
                type="text"
                class="form-control"
                id="locname" onChange={(e) => {setLN(e.target.value);}}
              />
            </div>
            <div class="mb-3">
              <label for="locLat" class="form-label">
                Latitude
              </label>
              <input
                type="float"
                class="form-control"
                id="locLac"
                aria-describedby="locLachelp" onChange={(e) => {setLat(e.target.value);}}
              />
              <div id="locLachelp" class="form-text">
                Leave blank if delete or retrive location.
              </div>
            </div>
            <div class="mb-3">
              <label for="locLong" class="form-label">
                Longtitude
              </label>
              <input
                type="float"
                class="form-control"
                id="locLong"
                aria-describedby="locLonghelp" onChange={(e) => {setLong(e.target.value);}}
              />
              <div id="locLonghelp" class="form-text">
                Leave blank if delete or retrive location.
              </div>
            </div>
            <div class="row gx-2">
              <button type="submit" className="btn btn-outline-secondary">Submit</button>
            </div>
          </form>
          <hr />
          {locData.length == 0 ? "": <>
          <h2>Locations</h2>
          <Datatable fData={locData} />
          </>}
        </div>
      </div>
    </div>
  );
}

// TO DO: Change username from Alvin to user based on cookie / session!
function Location_details() {
  const [c, setC] = useState([]);
  const[nc, setNC] = useState("");
  const [details, setDetails] = useState({
    Name: null,
    Latitude: null,
    Longitude: null,
    Temperature: null,
    Wind_speed: null,
    Wind_direction: null,
    Humidity: null,
    Precipitation: null,
    Visibility: null,
  });
  const navigate = useNavigate()


  let locName = details.Name
  let username = "Alvin"
  let loc = useParams().loc;

  const fetchDetails = () => {
    let link = "/location/" + loc;
    console.log(link);
    fetch(link)
      .then((res) => res.json())
      .then((text) => {
        setDetails({
          Name: text.Name,
          Latitude: text.Latitude,
          Longitude: text.Longitude,
          Temperature: text.Temperature,
          Wind_speed: text.Wind_speed,
          Wind_direction: text.Wind_direction,
          Humidity: text.Humidity,
          Precipitation: text.Precipitation,
          Visibility: text.Visibility,
        });
      });
  };

  const fetchComments = () => {
    let link = "/comment/" + loc;
    fetch(link)
      .then((r) => r.json())
      .then((data) => {
        for (let index = 0; index < data.length; index++) {
          var d = {
            username: data[index].user.username,
            comment: data[index].comment,
          };
          setC((olddata) => [...olddata, d]);
        }
      });
  };

  const addComments = (e) => {
    e.preventDefault();
    // Updating Server
    let bodytext = "username=" + username + "&locName=" + locName + "&comment=" + nc

    fetch("http://localhost:4000/newComment", {
         method: "POST", 
         headers: {"Content-Type": "application/x-www-form-urlencoded"},
         body: bodytext})
    .then(res => res.text())
    .then(data => console.log(data))
    alert("Your comment has been submitted!")
    var newComment = {username: username, comment: nc}
    setC((olddata) => [...olddata, newComment]);
  }

  const handleCommentChange = (e) => {
    setNC(e.target.value)
  }

  const handleFavourite = () => {
    let link = "/favourite/" + username + "/" + locName
    let bodytext = "username=" + username + "&locName=" + locName
    console.log(link)
    fetch(link, {
      method: "PUT", 
      headers: {"Content-Type": "application/x-www-form-urlencoded"},
      body: bodytext})
    .then(res => res.text())
    .then(data => {
        console.log(data);
        let message = locName + " has been added to your favourite!"
        alert(message)
    })
  }

  React.useEffect(() => {
    fetchDetails();
    fetchComments();
  }, []);

  var listItems = c.map((row) => (
    <div>
      <h5>{row.username}</h5>
      <p>{row.comment}</p>
    </div>
  ));
  return (
    <div class="container mt-3 mb-3">
      <div class="container m-0 pt-3 pb-4">
        <div class="row justify-content-between">
         <div class="col-auto">
          <h1>{details.Name}</h1>
          <span>
            {Math.abs(details.Latitude)}°{details.Latitude > 0 ? "N" : "S"}{" "}
            {Math.abs(details.Longitude)}°{details.Longitude > 0 ? "E" : "W"}&nbsp;
          </span>
         </div>
          
         <div class="col-auto align-self-center">
          <button class="btn btn-danger d-inline-flex justify-content-center align-content-between" onClick={() => handleFavourite()}>
            <span class="material-icons">favorite</span>
            <span>&nbsp;Add to favourites</span>
          </button>
         </div>
        </div>
      </div>

      <div class="gmap_canvas mt-1">
        {/*----------Use this link to generate the src https://google-map-generator.com/ ---------- */}
        <iframe
          width="100%"
          height="400"
          id="gmap_canvas"
          src={
            "https://maps.google.com/maps?q=" +
            details.Name +
            "&t=k&z=11&ie=UTF8&iwloc=&output=embed"
          }
          frameborder="0"
          scrolling="no"
          marginheight="0"
          marginwidth="0"
        ></iframe>
      </div>
      <div class="container mt-3 mb-4">
        <div class="row">
        <div class="col-auto p-0">{/*wanna have weather icon here but need work (if have time sin do la)*/}</div>
          <div class="col-auto me-auto">
            <h2>Current Temperature: {details.Temperature}°C</h2>
            <p class="m-0">
              Wind speed: {details.Wind_speed}kph {details.Wind_direction}
              <br />
              Humidity: {details.Humidity}%<br />
              Precipitation: {details.Precipitation}mm
              <br />
              Visibillity: {details.Visibility}km
              <br />
            </p>
          </div>

          <div class="col-auto align-self-end">
            <button class="btn btn-primary d-inline-flex justify-content-center align-content-between">
              <span class="material-icons">refresh</span>
              <span>&nbsp;Refresh</span>
            </button>
          </div>

        </div>
      </div>
      {/* User Comment Form */}
      <div class="container mt-3 mb-3">
        <h3>Users' Comments: </h3>
        <div>{listItems.length===0 ? "No Comments for this Location." : listItems}</div>
        <br />
        <h3>Your Comment</h3>
        <form onSubmit={(e) => addComments(e)}>
          <textarea
            className="form-control form-control-lg mb-3"
            placeholder="Write your comments here."
            id="comment"
            onChange={(e) => handleCommentChange(e)}
          ></textarea>
          <button type="submit" className="btn btn-secondary">Submit</button>
        </form>
      </div>

      <div className="d-flex justify-content-center">
          <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/')}>Back to Homepage</button>
      </div>
    </div>
  );
}

// TO DO: For non-user?
class NavList extends React.Component {
  render() {
    // a stub for detemining if the user is admin (todo: get from session if the user is admin)
    let isAdmin = 1,
      isUser = 0,
      isNonUser = 0;
    {
      /*Set to 1 For testing diff user(!!!!!todo)*/
    }

    if (isAdmin == 1)
      return (
        <>
          {/*----------NavList for admin----------*/}
          <p>&nbsp;</p>
          <span class="material-icons" style={{ color: "#484848" }}>
            &#xE88A;
          </span>
          <LongLink to="/" label="Home" />

          <p>&nbsp;&nbsp;&nbsp;&nbsp;</p>
          <span class="material-icons" style={{ color: "#484848" }}>
            &#xE87D;
          </span>
          <LongLink to="/favloc" label="My Favourite Locations" />

          <p>&nbsp;&nbsp;&nbsp;&nbsp;</p>
          <span class="material-icons" style={{ color: "#484848" }}>
            &#xE8B8;
          </span>
          <LongLink to="/admin" label="Admin Page" />
        </>
      );
    else if (isUser == 1)
      return (
        <>
          {/*-----------NavList for user----------*/}
          <p>&nbsp;</p>
          <span class="material-icons" style={{ color: "#484848" }}>
            &#xE88A;
          </span>
          <LongLink to="/" label="Home" />

          <p>&nbsp;&nbsp;&nbsp;&nbsp;</p>
          <span class="material-icons" style={{ color: "#484848" }}>
            &#xE87D;
          </span>
          <LongLink to="/favloc" label="My favourite location" />
        </>
      );
    else if (isNonUser == 1) return (
      "Hello World"
    );
  }
}

// Not working!!
class Logout extends React.Component {
  // a stub for detemining if the user is admin (todo: get from session if the user is admin)

  render() {
    let isAdmin = 0,
      isUser = 1,
      isNonUser = 0; //Set to 1 For testing diff user(!!!!!todo)
    return (
      <>
        {isNonUser != 1 && (
          <li style={{ listStyleType: "none" }} class="nav-item dropdown">
            {/*dropdown for logout*/}

            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="navbarDarkDropdownMenuLink"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <span style={{ float: "right", color: "#484848" }}>
                <i style={{ color: "#484848" }} class="material-icons">
                  &#xE853;
                </i>
                Hi, {this.props.username}!&nbsp;&nbsp;&nbsp;
              </span>
            </a>

            <ul
              style={{ backgroundColor: "silver" }}
              class="dropdown-menu dropdown-menu-dark"
              aria-labelledby="navbarDarkDropdownMenuLink"
            >
              <LongLink to="/login" label="&nbsp;&nbsp; &nbsp;&nbsp;Logout" />
            </ul>
          </li>
        )}
      </>
    );
  }
}

// TO DO: Map icon to each location view!
function Home() {
  const [data, setData] = useState([]);
  const [q, setQ] = useState("");
  const [s, setS] = useState("locName");

  useEffect(() => {
    fetch("/location")
      .then((r) => r.json())
      .then((data) => setData(data));
  }, []);

  function search(rows) {
    let filterRows = rows.filter(
      (row) => row.locName.search(new RegExp(q, "i")) > -1
    );
    let sortRows;
    if (s === "locName") {
      sortRows = filterRows.sort((a, b) =>
        a.locName === b.locName ? 0 : a.locName > b.locName ? 1 : -1
      );
    } else if (s === "locLat") {
      sortRows = filterRows.sort((a, b) =>
        parseFloat(a.locLat) === parseFloat(b.locLat)
          ? 0
          : parseFloat(a.locLat) > parseFloat(b.locLat)
          ? 1
          : -1
      );
    } else {
      sortRows = filterRows.sort((a, b) =>
        parseFloat(a.locLong) === parseFloat(b.locLong)
          ? 0
          : parseFloat(a.locLong) > parseFloat(b.locLong)
          ? 1
          : -1
      );
    }
    return sortRows;
  }

  return (
    <>
      <div class="container">
        <br />
        <h2>Location</h2>
        <div class="row">
          <div class="col-7">
            <div class="row">
              <div class="col-6">
                <form class="d-flex">
                  <input
                    class="form-control me-2"
                    type="text"
                    placeholder="Search for location"
                    aria-label="Search"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                  />
                </form>
              </div>
              <p class="col-2 mb-0 mt-2 p-0 text-end">Sort By:</p>
              <div class="col-4">
                <form class="d-flex">
                  <select
                    class="form-select"
                    aria-label="Default select example"
                    onChange={(e) => {
                      setS(e.target.value);
                    }}
                  >
                    <option value="locName" selected>
                      Location Name
                    </option>
                    <option value="locLat">Latitude</option>
                    <option value="locLong">Longitude</option>
                  </select>
                </form>
              </div>
            </div>
            <Datatable fData={search(data)} />
          </div>
          <div class="col-5">
            <div class="mapouter">
              <div class="gmap_canvas">
                {/*----------Use this link to generate the src https://google-map-generator.com/ ---------- */}
                <iframe
                  width="300"
                  height="300"
                  id="gmap_canvas"
                  src={
                    "https://maps.google.com/maps?q=2880%20Broadway,%20New%20York&t=&z=13&ie=UTF8&iwloc=&output=embed"
                  }
                  frameborder="0"
                  scrolling="no"
                  marginheight="0"
                  marginwidth="0"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Datatable({ fData }) {
  const columns = fData[0] && Object.keys(fData[0]);
  const navigate = useNavigate();
  const handleRowClick = (link) => {
    navigate(link);
  };

  return (
    <>
      <table class="table table-hover">
        <thead>
          <tr>
            <th scope="col">Location Name</th>
            <th scope="col">Latitude</th>
            <th scope="col">Longitude</th>
          </tr>
        </thead>
        <tbody>
          {fData.map((row) => (
            <tr onClick={() => handleRowClick("/location/" + row.locName)}>
              {columns.map((column) => (
                <td>{row[column]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

// TO DO: Change from Alvin to user (by cookie / session)!
function FavTable() {
  const navigate = useNavigate();
  const handleRowClick = (link) => {
    navigate(link);
  };
  const [data, setData] = useState([]);
  React.useEffect(() => {
    fetch("/favourite/Alvin")
      .then((res) => res.json())
      .then((text) => {
        for (let index = 0; index < text.length; index++) {
          var d = {
            num: index + 1,
            locName: text[index].locName,
            locLat: text[index].locLat,
            locLong: text[index].locLong,
          };
          setData((olddata) => [...olddata, d]);
        }
      });
  }, []);

  var listItems = data.map((data) => (
    <tr onClick={() => handleRowClick("/location/" + data.locName)}>
      <th scope="row">{data.num}</th>
      <td>{data.locName}</td>
      <td>{data.locLat}</td>
      <td>{data.locLong}</td>
    </tr>
  ));

  return (
    <>
      {listItems.length == 0 ? <p className="lead">Opps! You've no favourite locations. Maybe starting adding some!</p> : 
      <div>
      <table class="table table-hover">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Location</th>
            <th scope="col">Latitude</th>
            <th scope="col">Longitude</th>
          </tr>
        </thead>
        <tbody>{listItems}</tbody>
        </table>
      </div>
      }
    </>
  );
}

function FavLoc () {
  const navigate = useNavigate();
  return (
    <>
      <div class="container">
        <br />
        <div class="text-center">
          <h2>My Favourite Locations</h2>
        </div>
        <FavTable />
        <div className="d-flex justify-content-center">
          <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/')}>Back to Homepage</button>
        </div>
      </div>
    </>
  );
}

// TO DO: Not yet implemented!
class Login extends React.Component {
  render() {
    return (
      <>
        <br />
        <br />
        <form action="" class="container px-1 " method="POST">
          {/*----------!!!!!todo form action ----------*/}
          <div class="text-center">
            {/*login.png by flaticon*/}
            <img
              src={"/images/login.png"}
              class="img-fluid"
              style={{ width: "200px" }}
            />
          </div>
          <br />
          <div class="mb-3 row justify-content-center">
            <div class="col-sm-5">
              <input
                type="text"
                class="form-control"
                id="username"
                placeholder="username"
              />
            </div>
          </div>
          <div class="mb-3 row justify-content-center">
            <div class="col-sm-5">
              <input
                type="password"
                class="form-control"
                id="password"
                placeholder="password"
              />
            </div>
          </div>
          <div class="text-center">
            <button type="button" class="btn btn-dark">
              Login
            </button>
            <div>
              <LongLink
                to="/createaccount"
                label="Not yet member? Sign up now"
              />
            </div>
          </div>
        </form>
      </>
    );
  }
}

// Implement this only if have time!
class CreateAccount extends React.Component {
  handleConfirm() {
    {
      /*----------confirm pwd match and enable the button----------*/
    }
    {
      /*ref: https://stackoverflow.com/questions/21727317/how-to-check-confirm-password-field-in-form-without-reloading-page */
    }
    let msg = document.getElementById("msg");
    if (
      document.getElementById("pwd").value !=
      document.getElementById("confirmpwd").value
    ) {
      msg.style.color = "red";
      msg.innerHTML = " * Password must Match the previous entry.";
      document.getElementById("btn").disabled = true;
    } else {
      msg.style.color = "green";
      msg.innerHTML = " Password match";
      document.getElementById("btn").disabled = false;
    }
  }
  render() {
    return (
      <>
        <br />
        <br />
        <form action="/createaccount" class="container px-1 " method="POST">
          {/*----------!!!!!todo form action----------*/}
          <div class="text-center">
            <h2>Sign Up</h2>
          </div>
          <br />
          <div class="mb-3 row justify-content-center">
            <div class="col-sm-5">
              <input
                type="text"
                class="form-control"
                id="username"
                placeholder="username"
              />
            </div>
          </div>
          <div class="mb-3 row justify-content-center">
            <div class="col-sm-5">
              <input
                type="password"
                class="form-control"
                id="pwd"
                placeholder="password"
              />
            </div>
          </div>
          <div class="mb-3 row justify-content-center">
            <div class="col-sm-5">
              <input
                type="password"
                class="form-control"
                id="confirmpwd"
                placeholder="confirm password"
                onKeyUp={() => this.handleConfirm()}
              />
              <span id="msg"></span>
            </div>
            {/*----------confirm password done in function handleConfirm()----------*/}
          </div>
          <div class="text-center">
            <button id="btn" type="button" class="btn btn-dark" disabled>
              Signup
            </button>
          </div>
          <div class="text-center">
            <LongLink to="/login" label="Already have an account? Sign In" />
          </div>
        </form>
      </>
    );
  }
}

ReactDOM.render(
  <App name="WEATHERING WITH ME" />,
  document.querySelector("#app")
);

export default App;
