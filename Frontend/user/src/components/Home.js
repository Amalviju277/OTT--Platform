import '../css/Common.css';
import Navbar from "./Navbar";
import MovieCard from './MovieCard';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Home() {
    const [movies, setMovies] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    // View movie List
    useEffect(() => {
        const token = localStorage.getItem("Token");
         if (!token) {
            setErrorMessage("User is not authenticated.");
            return;
        }
        // View movies
        axios.get('http://127.0.0.1:8000/api/movie_list/', {
            headers: { 'Authorization': `Token ${token}` }
        })
        .then(response => setMovies(response.data))
        .catch(error => {
            setErrorMessage(error.response?.data?.error || 'Failed to fetch. Please try again later.');
        });
    }, []);

    // History
    function handleCardClick(movie) {
        const token = localStorage.getItem("Token");
        if (!token) {
            setErrorMessage("User is not authenticated.");
            return;
        }
        // Add to history
        axios.post('http://127.0.0.1:8000/api/add_history/', { id: movie.id }, {
            headers: { 'Authorization': `Token ${token}` }
        })
        .then(() => navigate(`/View/${movie.id}`))// calls the appropriate id 
        .catch(error => {
            setErrorMessage(error.response?.data?.error || 'Failed to add history.');
        });
    }

    // Filtered movies based on search query
    const filteredMovies = movies.filter(movie => 
        movie.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="background2">
            <Navbar />
            <h2 className="text-center mt-4 display-4">Movies</h2>
            
            <div className='container'>
                {/* Search bar */}
                <div className='d-flex mb-4'>
                    <input 
                    type="text" 
                    className="search ms-auto" 
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="search movies" />
                    <button className="bg-dark">
                        <i className="bi bi-search text-white"/>
                    </button>
                </div>
            </div>
            
            {errorMessage && ( <div className="alert alert-danger" role="alert"> {errorMessage} </div> )}
            
            <MovieCard movies={filteredMovies} handleCardClick={handleCardClick} />
        </div>
    );
}

export default Home;
