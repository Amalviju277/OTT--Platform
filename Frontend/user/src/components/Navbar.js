import React, { useState } from "react";
import '../css/Navbar.css';
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

function Navbar() {
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const logout = () => {
    const token = localStorage.getItem('Token');
    if (!token) {
      setErrorMessage("User is not authenticated.");
      return;
    }

    axios.post('http://127.0.0.1:8000/api/logout/', {}, {
      headers: { 'Authorization': `Token ${token}` }
    })
    .then(() => {
      localStorage.removeItem('Token');
      localStorage.removeItem('Bookmark');
      alert('You have been logged out successfully.');
      navigate('/Login');
    })
    .catch(error => {
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error); // Show backend error message
      } else {
        setErrorMessage("Failed to logout. Please try again later.");
      }
    });
  };

  return (
    <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
      <div className="navbar-brand ml-4">
        <h4 className="nav-link"> <NavLink to={'/'} className="nav-link">LUMIA</NavLink></h4>
      </div>
      
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      
      <div className="collapse navbar-collapse mr-auto" id="navbarNav" style={{ float: "left" }}>
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <NavLink to={'/Home'} className={"nav-link"}>
              <i className="bi bi-house" style={{ fontSize: '1.2rem' }} /> Home
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink to={'/Bookmark'} className={"nav-link "}>
              <i className="bi bi-bookmark" style={{ fontSize: '1.2rem' }} /> Bookmark
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink to={'/History'} className={"nav-link "}>
              <i className="bi bi-clock-history" style={{ fontSize: '1.2rem' }} /> History
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink to={'/Profile'} className={"nav-link"}>
              <i className="bi bi-person" style={{ fontSize: '1.2rem' }} /> Profile
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink onClick={logout} className={"nav-link "}>
              <i className="bi bi-box-arrow-in-left" style={{ fontSize: '1.3rem' }} />
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
