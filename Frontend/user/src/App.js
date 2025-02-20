import React from "react";
import './App.css';
import { Link } from "react-router-dom";

function App(){
  return(
    <div className="background1">    
            <div className="container  text text-dark ">
            <div className="row justify-content-center">
            <div className="col-md-6">
                <h2 className="text-center mt-5 mb-4 display-4 "><span className="lumia" >LUMIA</span>...</h2>
                
                <div className="">
                  <p>Dive into the endless Entertainment!.</p>
                  <p>Enjoy our Premium Top-notch movies,series and anime at your fingertips</p>
                  <b>Happy Streaming !!!</b>
                </div>
                <div className="d-grid mt-5">
                  <p className="text-warning">Hey you New here ?</p>
                </div>
            </div>
            </div>
            </div> 

            <div className="d-flex justify-content-center ml-4">
              <Link to={'Signup'} class="btn btn-primary btn-md">Signup</Link>
              <span class="mx-2">OR</span>
               <Link to={'Login'} class="btn btn-success btn-md text-white ml-4">Login</Link>
            </div>

        </div>
  );

}
export default App;