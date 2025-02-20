import React, { useEffect, useState } from 'react';
import '../css/Card.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function WatchlistCard({ watchlist }) {
  const [errorMessage, setErrorMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const moviesPerPage = 8; 
  const [bookmark, setBookmark] = useState(() => {
    const savedBookmark = JSON.parse(localStorage.getItem('Bookmark')) || {};
    return savedBookmark;
  });

  useEffect(() => {
    localStorage.setItem('Bookmark', JSON.stringify(bookmark)); 
  }, [bookmark]);

  function handleRemoveWatchlist(event, movie) {
    event.preventDefault();
    event.stopPropagation();
  
    const token = localStorage.getItem('Token');
    if (!token) {
      setErrorMessage("User is not authenticated.");
      return;
    }
      
      axios.post('http://127.0.0.1:8000/api/remove_watchlist/', { id: movie.movie_id }, 
        { headers: { Authorization: `Token ${token}` } }
      )
      .then(() => {
        setBookmark(prev =>{
            const updatedBookmark = { ...prev };
            delete updatedBookmark[movie.movie_id];
            localStorage.setItem('Bookmark', JSON.stringify(updatedBookmark));
            
            return updatedBookmark;
          
        });
        alert('Removed from watchlist successfully.');
      })
      .catch(() => setErrorMessage("Failed to remove from  watchlist."));
    }
  

  function handleCardClick(movie) {
    navigate(`/View/${movie.movie_id}`);
    }

  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = watchlist.slice(indexOfFirstMovie, indexOfLastMovie);
  const totalPages = Math.ceil(watchlist.length / moviesPerPage);

  return (
    <div className="container mt-4">
      {errorMessage && (<div className="alert alert-danger" role="alert">{errorMessage}</div>)}
      
      <div className="mt-3 row g-3">
        {currentMovies.map((movie) => (
          <div className="col-6 col-md-3" key={movie.movie_Id}>
            <div className="custom-card fixed-size position-relative" onClick={() => handleCardClick(movie)}>
              <button 
                className="btn btn-transparent position-absolute top-0 end-0 m-2"
                onClick={(event) => handleRemoveWatchlist(event, movie)}
              >
                
          
                  <i className="bi bi-bookmark-fill" style={{ color: '#00FFFF', fontSize: '1.5rem' }} />
                
              </button>

              <img src={`http://localhost:8000${movie.image}`} className="custom-card-img-top" alt={movie.title} />

              <div className="custom-card-body">
                <h5 className="custom-card-title">{movie.title}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <nav>
        <ul className="pagination justify-content-center mt-4">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link rounded-pill shadow-sm px-3" onClick={() => setCurrentPage(currentPage - 1)}>
              &laquo; Previous
            </button>
          </li>
          
          {[...Array(totalPages)].map((_, index) => (
            <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
              <button className="page-link rounded-pill shadow-sm px-3 mx-1" onClick={() => setCurrentPage(index + 1)}>
                {index + 1}
              </button>
            </li>
          ))}

          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button className="page-link rounded-pill shadow-sm px-3" onClick={() => setCurrentPage(currentPage + 1)}>
              Next &raquo;
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default WatchlistCard;


