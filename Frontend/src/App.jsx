// Name and SID (alphabetically):
// Alvin CHAN 1155108897
// Chun Yeung CHOW 1155131406
// Ngou Shan WONG 1155141835
// Siu Fung CHEUNG 1155110966
// Wing Lam CHENG 1155125313
// Yee Han CHENG 1155143426

import ReactDOM from "react-dom";
import "./App.css";
import MapContainer from"./Map.jsx";

import React, { 
  useEffect, 
  useState 
} from "react";
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
import Cookies from 'universal-cookie'
const cookies = new Cookies();

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
            <div class="navbar-collapse" id="navbarNav">
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
            <Logout />
          </nav>

          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
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
    <li style={{ listStyleType: "none", display:"inline" }}>
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

function Admin_page() {
  const [locData, setlocData] = useState([]);
  const [userData, setuserData] = useState([]);

  const [userAction, setUA] = useState("Choose");
  const [userName, setU] = useState("");
  const [pwd, setP] = useState("");
  const [newUserName, setNU] = useState("");
  const [newPwd, setNP] = useState("");

  const [locAction, setLA] = useState("Choose");
  const [locName, setLN] = useState("");

  const CRUDLocation = (e) => {
    e.preventDefault();
    if (locAction == "Choose") {
      alert("Please choose an action.")
    } else {
      switch (locAction){
        case "c":
          if (locName == "") {
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
          if (locName == "") {
            alert("Missing information.")
          } else {
            fetch("/location/" + locName, {
              method: "PUT", 
              headers: {"Content-Type": "application/x-www-form-urlencoded"},
            })
            .then(data => {
              console.log(data);
              if (data.ok) {
                alert("You've updated " + locName);
              } else {
                alert("No Location " + locName + " in database. \nPlease create this location.")
              }
            })
          }
          break;
        case "d":
          if (locName == "") {
            alert("Missing information.")
          } else {
            fetch("/location/" + locName, {method: 'DELETE'})
            .then(data => {
              if (data.ok) {
                alert("Location " + locName + " is deleted.")
              } else {
                alert("There was no " + locName + " in the database.")
              }
            })
            console.log(locName)
          }
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
            if (userName.length < 4 || userName.length > 20) {
              alert("Username should be 4 to 20 characters.")
            } else {
              if (pwd.length < 4 || pwd.length > 20) {
                alert("Password should be 4 to 20 characters.")
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
            }
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
          let bodytext = "username=" + userName + "&newusername=" + newUserName + "&newpassword=" + newPwd
          fetch("/user", {
            method: "PUT", 
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: bodytext})
          .then(data => {
            console.log(data);
            if (data.ok) {
              alert("User update success!");
            } else {
              alert("Something is wrong...");
            }
          })
          break;
        case "d":
          fetch("/user/" + userName, {method: 'DELETE'})
          .then(data => {
            if (data.ok) {
              alert("User " + userName + " is deleted.")
            } else {
              alert("There was no " + userName + " in the database.")
            }
          })
          console.log(userName)
          break;
      }
    }
  };

  const columns = userData[0] && Object.keys(userData[0]);
  const navigate = useNavigate();
  if (cookies.get('loggined')!= "true")
  return (
  <><br/><br/><br/><br/>
  <div className="d-flex justify-content-center">
  
    <h1>Please Log in and try again.</h1>
  <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/')}>Back to login</button>
  </div>
  </>)
  else
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
            {userAction == "u" ? <>
            <div class="mb-3">
              <label for="username" class="form-label">
                New Username
              </label>
              <input type="text" class="form-control" onChange={(e) => {setNU(e.target.value)}} />
            </div>
            </>: ""}
            {userAction == "c" ? <>
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
            </div>
            </>: ""}
            {userAction == "u" ? <>
            <div class="mb-3">
              <label for="password" class="form-label">
                New Password
              </label>
              <input type="password" class="form-control" onChange={(e) => {setNP(e.target.value)}} />
            </div>
            </>: ""}
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
              <div id="passwordhelp" class="form-text">
                Longtitude and Latitude will be retrieved directly from API. 
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
  let username = cookies.get('name');
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

    fetch("/newComment", {
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
  if (cookies.get('loggined')!= "true")
  return (
  <><br/><br/><br/><br/>
  <div className="d-flex justify-content-center">
  
    <h1>Please Log in and try again.</h1>
  <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/')}>Back to login</button>
  </div>
  </>)
  else
  return (
    <div class="container mt-3 mb-3">
      <div class="container m-0 pt-3 pb-4">
        <div class="row justify-content-between">
         <div class="col-auto">
          <h1>{details.Name}</h1>
          <span>
            {Math.abs(details.Latitude)}{'\u00b0'}{details.Latitude > 0 ? "N" : "S"}{" "}
            {Math.abs(details.Longitude)}{'\u00b0'}{details.Longitude > 0 ? "E" : "W"}&nbsp;
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
        <div class="col-auto p-0"></div>
          <div class="col-auto me-auto">
            <h2>Current Temperature: {details.Temperature}&deg;C</h2>
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

          {username == "admin" && <>
          <div class="col-auto align-self-end">
            <button class="btn btn-primary d-inline-flex justify-content-center align-content-between" onClick={(e) => {console.log("Refreshed"); fetchDetails()}}>
              <span class="material-icons">refresh</span>
              <span>&nbsp;Refresh</span>
            </button>
          </div>
          </>}

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
          <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/home')}>Back to Homepage</button>
      </div>
    </div>
  );
}

function NavList (){
  const navigate = useNavigate();
  const [name, setName] = useState(0);
  const [login, setLogin] = useState(0);
  useEffect(() => {
    setTimeout(() => {
      setName(cookies.get('name'));
      setLogin(cookies.get('loggined'));
      navigate(). refresh();
    }, 10);
    
  });

  if(login=="true")
      return (
          <>
          <p>&nbsp;</p>
          <span class="material-icons" style={{ color: "#484848",display:"inline" }}>
            &nbsp;&nbsp;&nbsp;&nbsp;&#xE88A;
          </span>
          <LongLink to="/home" label="Home" />
          <p>&nbsp;</p>
          <span class="material-icons" style={{ color: "#484848",display:"inline" }}>
            &nbsp;&nbsp;&nbsp;&nbsp;&#xE87D;
          </span>
          <LongLink to="/favloc" label="My favourite location" />
          <p>&nbsp;</p>
          {name=="admin"&&(
                      <>
          <span class="material-icons" style={{ color: "#484848",display:"inline" }}>
            &nbsp;&nbsp;&nbsp;&nbsp;&#xE8B8;
          </span>
          <LongLink to="/admin" label="Admin Page" />
          <p>&nbsp;</p>
          </>
          )}
          </>
      ); 
  }


function Logout () {
  const navigate = useNavigate();
  function handleLogout(e){
    cookies.set('loggined', "false", 
    { path: '/'}
    );
    navigate("/");
  }
    let isLogin=0;
    let username=cookies.get('name');
    if(cookies.get('loggined')== "true") isLogin = 1; else isLogin=0; 

    return (
      <>
        {isLogin == 1 && (
          <li style={{ listStyleType: "none" }} class="nav-item dropdown">
            {/*dropdown for logout*/}

            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="navbarDarkDropdownMenuLink"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{color: "#484848" }}
            >
              <span style={{ float: "right", color: "#484848" }}>
                <i style={{ color: "#484848" }} class="material-icons">
                  &#xE853;
                </i>
                Hi, {username}!&nbsp;&nbsp;&nbsp;
              </span>
            </a>

            <ul
              style={{ backgroundColor: "silver" }}
              class="dropdown-menu dropdown-menu-dark"
              aria-labelledby="navbarDarkDropdownMenuLink"
            >
              <p style={{ color: "#484848", fontSize: "20px", cursor:"pointer" }} onClick={(e) => handleLogout(e)}>&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;Logout</p>
            </ul>
          </li>
        )}
      </>
    );
}

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
  const navigate = useNavigate();
  if (cookies.get('loggined')!= "true")
  return (
  <><br/><br/><br/><br/>
  <div className="d-flex justify-content-center">
  
    <h1>Please Log in and try again.</h1>
  <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/')}>Back to login</button>
  </div>
  </>)
  else
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

          <div class="col">
            <MapContainer loc={search(data)}/>
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
            <tr style={{cursor:"pointer"}} onClick={() => handleRowClick("/location/" + row.locName)}>
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

function FavTable() {
  const navigate = useNavigate();
  const handleRowClick = (link) => {
    navigate(link);
  };
  const [data, setData] = useState([]);
  let username=cookies.get('name');
  React.useEffect(() => {
    fetch("/favourite/"+username)
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
    <tr style={{cursor:"pointer"}} onClick={() => handleRowClick("/location/" + data.locName)}>
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
  if (cookies.get('loggined')!= "true")
  return (
  <><br/><br/><br/><br/>
  <div className="d-flex justify-content-center">
    
    <h1>Please Log in and try again.</h1>
  <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/')}>Back to login</button>
  </div>
  </>)
  else
  return (
    <>
      <div class="container">
        <br />
        <div class="text-center">
          <h2>My Favourite Locations</h2>
        </div>
        <FavTable />
        <div className="d-flex justify-content-center">
          <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/home')}>Back to Homepage</button>
        </div>
      </div>
    </>
  );
}


function Login() {
  const navigate = useNavigate();

  function handlelogin(e){
    e.preventDefault();
    let username=e.target[0].value;
    let pwd=e.target[1].value;
    let bodytext = "username=" + username + "&pwd=" + pwd
    fetch("/login", {
        method: "POST",
        headers: {"Content-Type": "application/x-www-form-urlencoded"}, 
        body: bodytext})
    .then(res => res.text())
    .then(()=> {
      if(cookies.get('loggined')== "true")
        navigate('/home');
      else 
        alert("Incorrect password or username!");
        }) 
  }

  if (cookies.get('loggined')== "true")
    return (<><br/><br/><br/><br/>
    <div className="d-flex justify-content-center"><h1>You are already logged in!</h1></div></>);
  else
    return (
      <>
        <br />
        <br />
        <form onSubmit={(e) => handlelogin(e)} class="container px-1 " method="POST">
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
                name="username"
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
                name="pwd"
                placeholder="password"
              />
            </div>
          </div>
          <div class="text-center">
            <button type="submit" class="btn btn-dark">
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

function CreateAccount() {
  const [userName, setU] = useState("")
  const [pwd, setP] = useState("")

  function handlePasswordCheck() {
    let msg = document.getElementById("msg");
    if (document.getElementById("pwd").value != "") {
      if (
        document.getElementById("pwd").value !=
        document.getElementById("confirmpwd").value
      ) {
        msg.style.color = "red";
        msg.innerHTML = " * Password must Match the previous entry.";
        document.getElementById("submit").disabled = true;
      } else {
        msg.style.color = "green";
        msg.innerHTML = " Password match";
        document.getElementById("submit").disabled = false;
      }
    }
  }

  const handleReg = (e) => {
    e.preventDefault()
    if (userName === "" || pwd === "") {
      alert("Missing information.")
    } else {
      if (userName.length < 4 || userName.length > 20) {
        alert("Username should be 4 to 20 characters.")
      } else {
        if (pwd.length < 4 || pwd.length > 20) {
          alert("Password should be 4 to 20 characters.")
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
      }
    }
  }

  if (cookies.get('loggined')== "true")
    return (<><br/><br/><br/><br/>
    <div className="d-flex justify-content-center"><h1>You need to log out before creating an account.</h1></div></>);
  else
  return (
    <>
      <br />
      <br />
      <form onSubmit={(e) => handleReg(e)} onChange={() => handlePasswordCheck()} class="container px-1 " method="POST">
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
              placeholder="username" onChange={(e) => setU(e.target.value)}
            />
          </div>
        </div>
        <div class="mb-3 row justify-content-center">
          <div class="col-sm-5">
            <input
              type="password"
              class="form-control"
              id="pwd"
              placeholder="password" onChange={(e) => setP(e.target.value)}
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
            />
            <span id="msg"></span>
          </div>
          {/*----------confirm password done in function handleConfirm()----------*/}
        </div>
        <div class="text-center">
          <button id="submit" type="submit" class="btn btn-dark" disabled>
            Signup
          </button>
        </div>
        <div class="text-center">
          <LongLink to="/" label="Already have an account? Sign In" />
        </div>
      </form>
    </>
  );
}

ReactDOM.render(
  <App name="WEATHERING WITH ME" />,
  document.querySelector("#app")
);

export default App;