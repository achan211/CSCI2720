

const {BrowserRouter, Routes, Route, Link} = ReactRouterDOM;
const {useMatch, useParams, useLocation} = ReactRouterDOM;

class App extends React.Component{
    render(){
        return(
            <>
          
            <BrowserRouter>
                <div>
                    <nav class="navbar navbar-expand-lg navbar-light" style={{backgroundColor: "silver"}}>
                        <div class="collapse navbar-collapse" id="navbarNav">
                            <span style={{fontWeight: 'bold'}} class="navbar-brand mb-0 h1"><img src="\images\favicon.png"></img>WEATHERING WITH ME</span>
                            <NavList/>
                        </div>
                        <Logout/>
                    </nav>

                    <Routes>
                        <Route path="/login" element={<Login/>} />
                        <Route path="/" element={<Home/>} />
                        <Route path="/favloc" element={<FavLoc/>} />
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
    <li style={{listStyleType:'none'}}>
    {match && " "}
        <Link style={{color:"#484848", textDecoration: 'none' , fontSize:"20px"}} to={to}>{label}</Link>
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


class NavList extends React.Component{
    render(){
     let isAdmin=0, isUser=1, isNonUser=0;{/*Set to 1 For testing diff user(!!!!!todo)*/}
        if(isAdmin==1)
            return(
                <>{/*----------NavList for admin----------*/}
                        <p>&nbsp;</p>
                        <span class="material-icons" style={{color:'#484848'}}>&#xE88A;</span>
                        <LongLink to="/" label="Home" />
                </>
            );
        else if(isUser==1)
            return(
                <>{/*-----------NavList for user----------*/}
                        <p>&nbsp;</p>
                        <span class="material-icons" style={{color:'#484848'}}>&#xE88A;</span>
                        <LongLink to="/" label="Home" />
                        
                        <p>&nbsp;&nbsp;&nbsp;&nbsp;</p>
                        <span class="material-icons" style={{color:'#484848'}}>&#xE87D;</span>
                        <LongLink to='/favloc' label='My favourite location'/>
                </>
            );
        else if(isNonUser==1)
            return;
    }
}

class Logout extends React.Component {

    render() {
        return(
            <>
                <li style={{listStyleType:'none'}} class="nav-item dropdown">{/*dropdown for logout*/}
                <a class="nav-link dropdown-toggle" href="#" id="navbarDarkDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    
                    {/*__________Todo: username???????&& !display when isNonUser  */}
                    <span style={{float:"right",color:'#484848'}}><i style={{color:'#484848'}} class="material-icons">&#xE853;</i>Hi, Username!&nbsp;&nbsp;&nbsp;</span>
                </a>
                <ul style={{backgroundColor: "silver"}} class="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDarkDropdownMenuLink">
                <LongLink to="/login" label="&nbsp;&nbsp; &nbsp;&nbsp;Logout" />
                </ul>
                </li>   
            </>
        );
    }
  }


class Home extends React.Component {
    render() {
        return(
            <>
                <div class="container">
                    <br/>
                    <h2>Location</h2>
                    <div class="row">
                        <div class="col-7">
                            <div class='row'>
                                <div class='col-6'>
                                <form class="d-flex">{/*----------!!!!!to do: search for loc---------- */}
                                    <input class="form-control me-2" type="search" placeholder="Search for location" aria-label="Search"/>
                                    <button class="btn btn-dark" type="submit"><span class="material-icons">&#xE8B6;</span></button>
                                </form>
                                </div>
                                <div class='col-6'>
                                <form class="d-flex">{/*----------!!!!!To do: sorting using dropdown list---------- */}
                                    <input class="form-control me-2" list="datalistOptions" id="exampleDataList" placeholder="Sort by"/>
                                    <datalist id="datalistOptions">
                                    <option value="opt1"/>
                                    <option value="opt2"/>
                                    <option value="opt3"/>
                                    </datalist>
                                </form>
                                </div>
                            </div>
                            <Table/>{/*----------!!!!!todo: loc data tranfer by props??---------- */}
                        </div>
                        <div class="col-5">
                        <div class="mapouter">
                                    <div class="gmap_canvas">
                                        {/*----------Use this link to generate the src https://google-map-generator.com/ ---------- */}
                                        <iframe width="300" height="300" id="gmap_canvas" src={"https://maps.google.com/maps?q=2880%20Broadway,%20New%20York&t=&z=13&ie=UTF8&iwloc=&output=embed"} frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe>
                                    </div>
                                </div>
                        </div>    
                    </div>


                </div>

            </>
        );
    }
  }
  {/*-----Todo: table for both favloc and home (usemapping??)--------*/ }
class Table extends React.Component{
    render() {
        return(
            <>
            <table class="table table-hover">
                <thead>
                    <tr>
                    <th scope="col">#</th>
                    <th scope="col">First</th>
                    <th scope="col">Last</th>
                    <th scope="col">Handle</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <th scope="row">1</th>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                    </tr>
                    <tr>
                    <th scope="row">2</th>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                    </tr>
                    <tr>
                    <th scope="row">3</th>
                    <td colspan="2">Larry the Bird</td>
                    <td>@twitter</td>
                    </tr>
                </tbody>
            </table>
            </>
        );
    }
}
class FavLoc extends React.Component {
    render() {
        return(
            <>
            <div class="container">
            <br/>
            <div class="text-center"><h2>My favourite Location</h2></div>
                <Table/>
            </div>
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
            <form action ="" class="container px-1 " method="POST">{/*----------!!!!!todo form action ----------*/}
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
    handleConfirm(){
        {/*----------confirm pwd match and enable the button----------*/}
        {/*ref: https://stackoverflow.com/questions/21727317/how-to-check-confirm-password-field-in-form-without-reloading-page */}
        let msg=document.getElementById("msg");
        if(document.getElementById('pwd').value!=document.getElementById('confirmpwd').value){
            msg.style.color='red';
            msg.innerHTML=" * Password must Match the previous entry.";
            document.getElementById("btn").disabled = true;
        }else{
            msg.style.color='green';
            msg.innerHTML=" Password match";
            document.getElementById("btn").disabled = false;
        }
    }
    render() {
      return(
        <>
            <br/><br/>
            <form action ="/createaccount" class="container px-1 " method="POST">{/*----------!!!!!todo form action----------*/}
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
                    <input type="password" class="form-control" id="pwd" placeholder="password"/>
                    </div>
                </div>
                <div class="mb-3 row justify-content-center">
                    <div class="col-sm-5">
                    <input type="password" class="form-control" id="confirmpwd" placeholder="confirm password" onKeyUp={()=>this.handleConfirm()}/>
                    <span id="msg"></span>
                    </div>{/*----------confirm password done in function handleConfirm()----------*/}
                </div>
                <div  class="text-center">
                    <button id="btn" type="button" class="btn btn-dark" disabled>Signup</button>
                </div>   
                <div class="text-center">
                       <LongLink to="/login" label=  "Already have an account? Sign In" />
                </div>
            </form>
        </>
      );

    }
  }
 
ReactDOM.render(
    <App name="WEATHERING WITH ME"/>,
    document.querySelector("#app")
);



