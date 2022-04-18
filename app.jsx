

const {BrowserRouter, Routes, Route, Link} = ReactRouterDOM;
const {useMatch, useParams, useLocation} = ReactRouterDOM;

class App extends React.Component{
    render(){
        return(
            <>
          
            <BrowserRouter>
                <div>
                <nav class="navbar navbar-expand-lg navbar-dark bg-dark">

                    <div class="collapse navbar-collapse" id="navbarNav">

                        <span class="navbar-brand mb-0 h1"><img src="\images\favicon.png"></img>WEATHERING WITH ME</span>

                        <ul class="navbar-nav">
                        <li class="nav-item">
                            <LongLink class="nav-link" to="/" label="Home" />
                        </li>
                        
                        <li class="nav-item">
                            <LongLink class="nav-link" to="/login" label="Login" />
                        </li>
                        </ul>
                    </div>
                </nav>

                    <Routes>
                        <Route path="/" element={<Home/>} />
                        <Route path="/login" element={<Login/>} />
                        <Route path="/createaccount" element={<CreateAccount/>} />
                        <Route path="*" element={<NoMatch/>} />
                    </Routes>
                </div>
            </BrowserRouter>
            
            </>
        );
    }
}
function LongLink({label, to}) {
    let match = useMatch({path: to});
    return (
    <li class="nav-item">
    {match && " "}
    <Link to={to}>{label}</Link>
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

class Home extends React.Component {
    render() {
      return(
        <>
            <h2 >hello</h2>
           
        </>
      );

    }
  }
 

class Login extends React.Component{
    render(){
        return(
            <>
            <br/>
            <br/>
            <form action ="/login" class="container px-1 " method="POST">{/*todo*/}
                <div class="text-center">
                    {/*login.png by flaticon*/ }
                    <img src={"/images/login.png"} class="img-fluid" style={{width: "200px"}}/>
                </div>
                <br/>
                <div class="mb-3 row justify-content-center">
                    <div class="col-sm-5">
                    <input type="text"  class="form-control" id="username" placeholder="username"/>
                    </div>
                </div>
                <div class="mb-3 row justify-content-center">
                    <div class="col-sm-5">
                    <input type="password" class="form-control" id="password" placeholder="password"/>
                    </div>
                </div>
                <div  class="text-center">
                    <button type="button" class="btn btn-dark">Login</button>
                    <div>
                       <LongLink to="/createaccount" label=  "Not yet member? Sign up now" />
                    </div>
       
                </div>
                </form>
            </>
        );
    }
}

class CreateAccount extends React.Component {
    render() {
      return(
        <>
            <br/><br/>
            <form action ="/createaccount" class="container px-1 " method="POST">{/*todo*/}
                <div class="text-center">
                    <h2>Sign Up</h2>
                </div>
                <br/>
                <div class="mb-3 row justify-content-center">
                    <div class="col-sm-5">
                    <input type="text"  class="form-control" id="username" placeholder="username"/>
                    </div>
                </div>
                <div class="mb-3 row justify-content-center">
                    <div class="col-sm-5">
                    <input type="password" class="form-control" id="password" placeholder="password"/>
                    </div>
                </div>
                <div  class="text-center">
                    <button type="button" class="btn btn-dark">Signup</button>
                </div>   
            </form>
        </>
      );

    }
  }
 
ReactDOM.render(
    <App name="CUHK Pictures"/>,
    document.querySelector("#app")
);


