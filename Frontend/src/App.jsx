// const {BrowserRouter, Routes, Route, Link} = ReactRouterDOM;
// const {useMatch, useParams, useLocation} = ReactRouterDOM;
import ReactDOM from "react-dom";
import "./App.css";
import React from "react";
import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useMatch,
  useParams,
  useLocation,
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
            <Route path="/location" element={<Location_details />} />
            <Route path="*" element={<NoMatch />} />
          </Routes>
          <p>{!data ? "Lodaing..." : data}</p>
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

class Location_details extends React.Component {
  render() {
    return (
      <div class="container mt-3">
        <h2>Location</h2>
        <div class="gmap_canvas">
          {/*----------Use this link to generate the src https://google-map-generator.com/ ---------- */}
          <iframe
            width="100%"
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
    );
  }
}

class NavList extends React.Component {
  render() {
    // a stub for detemining if the user is admin (todo: get from session if the user is admin)
    let isAdmin = 0,
      isUser = 1,
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
    else if (isNonUser == 1) return;
  }
}

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

class Home extends React.Component {
  render() {
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
                    {/*----------!!!!!to do: search for loc---------- */}
                    <input
                      class="form-control me-2"
                      type="search"
                      placeholder="Search for location"
                      aria-label="Search"
                    />
                    <button class="btn btn-dark" type="submit">
                      <span class="material-icons">&#xE8B6;</span>
                    </button>
                  </form>
                </div>
                <p class="col-2 mb-0 mt-2 p-0 text-end">Sort By:</p>

                <div class="col-4">
                  <form class="d-flex">
                    {/*----------!!!!!To do: sorting using dropdown list---------- */}
                    <select
                      class="form-select"
                      aria-label="Default select example"
                    >
                      <option value="opt0" selected>
                        Name
                      </option>
                      <option value="opt1">District</option>
                      <option value="opt2">East to West</option>
                      <option value="opt3">North to south</option>
                    </select>
                  </form>
                </div>
              </div>
              <Table />
              {/*----------!!!!!todo: loc data tranfer by props??---------- */}
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
}
{
  /*-----Todo: table for both favloc and home */
}
function Table() {
  // a stub for creating location info (todo: get location info from database)
  //   const data =[{num: 1 , locName: "New York", locLat: 40.712, locLong: -74.0059},
  //   {num: 2 , locName: "Hong Kong", locLat: 22.302, locLong: 114.177},
  //   {num: 3 , locName: "London", locLat: 51.507, locLong: -0.127}];
  const [data, setData] = useState([]);
  React.useEffect(() => {
    fetch("/location")
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
    <tr>
      <th scope="row">{data.num}</th>
      <td>{data.locName}</td>
      <td>{data.locLat}</td>
      <td>{data.locLong}</td>
    </tr>
  ));

  return (
    <>
      <table class="table table-hover">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Location</th>
            <th scope="col">Latitude</th>
            <th scope="col">Longitude</th>
          </tr>
        </thead>
        <tbody>{!listItems ? "Lodaing..." : listItems}</tbody>
      </table>
    </>
  );
}

class FavLoc extends React.Component {
  render() {
    return (
      <>
        <div class="container">
          <br />
          <div class="text-center">
            <h2>My favourite Location</h2>
          </div>
          <Table />
        </div>
      </>
    );
  }
}

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
