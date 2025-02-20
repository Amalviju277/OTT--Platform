import '../../css/History.css';
import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar';
import axios from 'axios';

function History() {
  const [history, setHistory] = useState([]); // Initialize as an array
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem("Token");

    if (!token) {
      setErrorMessage("User is not authenticated.");
      return;
    }

    axios.get('http://127.0.0.1:8000/api/view_history/', {
      headers: {
          'Authorization': `Token ${token}`, // Pass the token 
      }
    })
    .then(response => {
      setHistory(response.data)
      
    })
    .catch(error => {
       if (error.response && error.response.data && error.response.data.error) {
          setErrorMessage(error.response.data.error); // Show backend error message
        } else {
          setErrorMessage('Failed to fetch. Please try again later.');
        }
    })    
  }, []);

  //Convert the ISO date 
  const formatDate = (dateString)=>{
    const date = new Date(dateString)
    return date.toDateString();
  }

  return (
    <div className="history">
      <Navbar />
      <h4 className="display-4 text-center mt-2 mb-5">Watch History</h4>
      <div className="container">
        {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}

        {history.length > 0 ? (
          history.map((item) => (
            <div className="mb-4" key={item.id}> {/* Add a unique key */}
              <div className="card small-card bg-dark text-white">
                <div className="card-body d-flex">
                  <h5 className="card-title">
                    <i className="bi bi-film font"></i> {item.title}
                  </h5>
                  <p className="card-time ms-auto text-end">
                    <i className="bi bi-alarm font"></i> {formatDate(item.date)}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted">No history available.</p>
        )}
      </div>
    </div>
  );
}

export default History;
