import { useState } from 'react';
import '../../css/Common.css'
import Navbar from "../Navbar";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

function Update() {

    const [password,setPassword] = useState('')
    const [newPassword,setNewPassword] = useState('')
    const [passwordConf,setpassConf] = useState('')
    const [errorMessage,setErrorMessage] = useState('')
    const navigate = useNavigate()

    function update(e) {
        e.preventDefault();
        
        // Check if new password matches confirmation
        if (passwordConf !== newPassword) {
            setErrorMessage(` Your new password does not match`);
            return; 
        }

     // Check  new password is at least 8 characters long
        if (newPassword.length < 8) {
        setErrorMessage("Password must be at least 8 characters long.");
        return;
        }
    
        // Retrieve token from  storage
        const token = localStorage.getItem('Token');
        console.log('The token is', token);
        
        if (!token) {
            setErrorMessage('No token found');
            return; // Stop function execution
        }
    
         const user = {
            old_password: password,
            new_password: newPassword
        };
    
        axios.post('http://127.0.0.1:8000/api/update/', user, {
            headers: {
                'Authorization': `Token ${token}`,
            }
        })
        .then(() => {

            alert('Updated Successfully');
            navigate('/Home'); 
        })
        .catch(error => {

            if(error.response.data.error){
                setErrorMessage(error.response.data.error)
            }else{
                setErrorMessage('Failed to Update. Please try again later !')
            }
        });
    }    
   
    return(
        <div className="background2">
            <Navbar/>
              <div className="container text-dark mt-5">
                 <div className="row justify-content-center">
                    <div className="col-md-6">
                       <h2 className="text-center mb-4 display-4">Profile</h2>

                       <form onSubmit={update}>
                       {errorMessage && ( <div className="alert alert-danger" role="alert"> {errorMessage} </div> )}

                        <div className="mb-3">
                           <label className="form-label">Current Password</label>
                           <input 
                            type="password"  
                            className="form-control" 
                            onInput={(e)=>setPassword(e.target.value)}
                            placeholder="Enter your email" required/>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">New Password</label>
                            <input 
                            type="password" 
                            className="form-control" 
                            onInput={(e)=>setNewPassword(e.target.value)}
                            placeholder="Enter your password" required/>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Confirm Password</label>
                            <input 
                            type="password" 
                            className="form-control" 
                            onInput={(e)=>setpassConf(e.target.value)}
                            placeholder="Confirm your password" required/>
                        </div>

                        <div className="d-grid">
                            <button type="submit"  className="btn btn-primary">Update</button>
                        </div>
                        </form>
                        
                        <div className="mt-4 text-end">
                            <Link to={'/Home'} className="btn btn-success btn-lg">
                                <i className='bi bi-house'></i>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Update;