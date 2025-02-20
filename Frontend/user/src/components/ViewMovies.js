import { Link, useParams } from 'react-router-dom';
import '../css/ViewMovies.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function View() {
  const {id} = useParams()
  const [movie,setMovie] = useState(null)
  const [errorMessage,setErrorMessage] = useState('')

  useEffect(() => {
    const token = localStorage.getItem("Token");

    if (!token) {
      setErrorMessage("User is not authenticated.");
      return;
    }

    axios.get(`http://127.0.0.1:8000/api/movie_view/${id}/`, {
      headers: {
          'Authorization': `Token ${token}`, // Pass the token 
      }
    })
    .then(response => {
      setMovie(response.data)
      console.log(response.data);
    })
    .catch(error => {
       if (error.response && error.response.data && error.response.data.error) {
          setErrorMessage(error.response.data.error); // Show backend error message
        } else {
          setErrorMessage('Failed to fetch. Please try again later.');
        }
    }) ;

    axios.get(`http://127.0.0.1:8000/api/movie_count/${id}/`, {
      headers: {
          'Authorization': `Token ${token}`, // Pass the token 
      }
    })
    .then(response => {
      console.log(response.data);
    })
    
    
  }, [id]);

  return (
    <div className='background'>
      <div className="container mt-5">
        {/* Home Button */}
        <Link to="/Home" className="btn btn-info btn-lg mb-3">
          <i className='bi bi-house'></i>
        </Link>

          {/* Show Error Message if Unauthorized */}
          {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}
        
        {/* Movie Card */}
        {movie? (

            <div className="card shadow-lg mb-4" key={movie.id}>
              {/* Card Body */}
              <div className="card-body bg-dark">
                <div className='row'>
                  <div className='col-md-6 order-md-2'>
                    
                    {/* Movie Image */}
                    <img
                      src={`http://localhost:8000${movie.thumbnail_url}`} // Use dynamic image URL
                      className="card-img-top movie-image"
                      alt={movie.title}
                    />
                  </div>
                  
                  <div className='col-md-6 order-md-1'>
                    <h2 className="card-title text-primary mt-2">{movie.title}</h2>
                    {/* Movie Description */}
                    <p className="card-text text-white mt-5">
                      {movie.description}
                    </p>
                  </div>
                </div>
                
                {/* Video Section */}
                <div className="mt-4">
                  <h5 className="text-secondary">Watch the Movie:</h5>
                  <div className="ratio ratio-16x9">
                  
                    <video
                      src={`http://localhost:8000${movie.video_url}`} // Use dynamic video URL
                      title={movie.title}
                    />
                  
                  </div>
                </div>
              </div>
            </div>
        ) : (
          <p className="text-dark text-center fw-bold fs-3 mt-5">
  🎬 No movies available at the moment. Check back later! 🍿
</p>

        )}
      </div>
    </div>
  );
}
export default View
