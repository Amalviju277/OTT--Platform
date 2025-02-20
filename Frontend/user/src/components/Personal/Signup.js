import { Link, useNavigate } from "react-router-dom";
import '../../css/Signup.css'
import { useState } from "react";
import axios from "axios";

function Signup() {
    var [username, setUsername] = useState('');
    var [email, setEmail] = useState('');
    var [password, setPassword] = useState('');
    var [passwordConf, setPasswordConf] = useState('');
    var [errorMessage, setErrorMessage] = useState('');
    var navigate = useNavigate();

    function Register(event){
        event.preventDefault()

        if(password !== passwordConf){
            setErrorMessage(`Password doesnot match`)
            return;
        }
        // body
        var user = {
            username: username,
            email: email,
            password: password,
        }

        axios.post(' http://127.0.0.1:8000/api/signup/',user).then(response=>{
            alert('You have successfully registered');
            navigate('/Login');
        }).catch(error=>{

            if(error.response){
                if(error.response.data.email){
                    setErrorMessage('Email already registered ')
                }
            }else{
                setErrorMessage('Failed to connect to api');
            }
        })
    }
   
    return(
        <div className="signup">
              <div className="container text-white mt-5">
                 <div className="row justify-content-center">
                    <div className="col-md-6">
                       <h2 className="text-center mb-4 display-4">Sign Up</h2>

                       <form onSubmit={Register}>
                       {errorMessage && ( <div className="alert alert-danger" role="alert"> {errorMessage} </div> )}
                       
                       <div className="mb-2">
                           <label className="form-label">UserName</label>
                           <input 
                            type="text"
                            className="form-control" 
                            onInput={(e)=>setUsername(e.target.value)}
                            placeholder="Enter your full name" required/>
                        </div>

                        <div className="mb-2">
                           <label className="form-label">Email Address</label>
                           <input 
                            type="email"  
                            className="form-control" 
                            onInput={(e)=>setEmail(e.target.value)}
                            placeholder="Enter your email" required/>
                        </div>

                        <div className="mb-2">
                            <label className="form-label">Password</label>
                            <input 
                            type="password" 
                            className="form-control" 
                            onInput={(e)=>setPassword(e.target.value)}
                            placeholder="Enter your password" required/>
                        </div>

                        <div className="mb-2">
                            <label className="form-label">Confirm Password</label>
                            <input 
                            type="password" 
                            className="form-control" 
                            onInput={(e)=>setPasswordConf(e.target.value)}
                            placeholder="Confirm your password" required/>
                        </div>

                        <div className="mb-2 form-check">
                            <input 
                            type="checkbox" 
                            className="form-check-input " 
                            id="terms" required/>
                            <label className="form-check-label" for="terms"><b>I agree to the terms and conditions</b></label>
                        </div>

                        <div className="d-grid">
                            <button type="submit"  class="btn btn-primary">Sign Up</button>
                        </div>
                        </form>

                        <div className="mt-2 text-center">
                            <p>Already have Account ? <Link to={'/Login'} className="text-info">Login</Link></p>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
}
export default Signup;

