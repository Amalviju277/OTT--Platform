import React, { useState } from "react";
import "../../css/Login.css"
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login(){

    var[email,setEmail] = useState('')
    var[password,setPassword] = useState('')
    var[errorMessage,setErrorMessage] = useState('')
    const navigate = useNavigate()

    function login(e) {
        e.preventDefault()

        axios.post('http://127.0.0.1:8000/api/login/',{
            email:email,
            password:password
        }).then(response=>{
           
            localStorage.setItem('Token',response.data.token)            
            alert(' Login successful')
            navigate('/Home')

        }).catch(error=>{

            if(error.response.data.error){
                setErrorMessage(error.response.data.error)
            }else{
                setErrorMessage('Failed to login user. Please contact admin')
            }
        })
    }
    return (
        <div className="login">
            <div className="container text-white mt-5">
            <div className="row justify-content-center">
            <div className="col-md-6">
                <h2 className="text-center mb-4 display-4">Login</h2>
                
                <form onSubmit={login}>
                {errorMessage && ( <div className="alert alert-danger" role="alert"> {errorMessage} </div> )}
                
                <div className="mb-3">
                  <label className="form-label">Email address</label>
                  <input 
                  type="email" 
                  className="form-control" 
                  onInput={(e)=>setEmail(e.target.value)}
                  placeholder="Enter your email" required/>
                </div>
                
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input 
                    type="password" 
                    className="form-control" 
                    onInput={(e)=>setPassword(e.target.value)}
                    placeholder="Enter your password" required/>
                </div>
                
                <div className="mb-3 form-check">
                     <input 
                     type="checkbox" 
                     className="form-check-input" 
                     id="rememberMe"/>
                     <label class="form-check-label" for="rememberMe">Remember me</label>
                </div>
                
                <div className="d-grid">
                    <button type="submit" class="btn btn-primary">Login</button>
                </div>
                </form>
                
                <div className="mt-3 text-center">
                    <p>New to Lumia ? <Link to={'/Signup'} className="text-info">Signup</Link></p>
                </div>
            </div>
            </div>
            </div>           
        </div>
      );
}
export default Login;

