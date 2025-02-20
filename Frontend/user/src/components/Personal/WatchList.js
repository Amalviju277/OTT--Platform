import "../../css/Common.css";
import Navbar from "../Navbar";
import WatchlistCard from "../WatchlistCard";
import { useState, useEffect } from "react";
import axios from "axios";

function Watchlist() {
    const [watchlist, setWatchlist] = useState([]);
    const [search, setSearch] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("Token");
        if (!token) {
            setErrorMessage("User is not authenticated.");
            return;
        }
        axios.get("http://127.0.0.1:8000/api/view_watchlist/", {
            headers: { Authorization: `Token ${token}` },
        })
        .then(response => setWatchlist(response.data))
        .catch(error => {
            setErrorMessage(error.response?.data?.error || "Failed to fetch watchlist. Please try again later.");
        });
    }, [watchlist]);

    // Filtered movies based on search query
    const filteredMovies = watchlist.filter(movie => 
        movie.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="background2">
            <Navbar />
            <h2 className="text-center mt-4 display-4">Watchlist</h2>

            {errorMessage && (
                <div className="alert alert-danger" role="alert">
                    {errorMessage}
                </div>
            )}

            <div className='container'>
                {/* Search bar */}
                <div className='d-flex mb-4'>
                    <input 
                        type="text" 
                        className="search ms-auto" 
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="search movies" 
                    />
                    <button className="bg-dark">
                        <i className="bi bi-search text-white"/>
                    </button>
                </div>
            </div>

            <WatchlistCard watchlist={filteredMovies} />
        </div>
    );
}

export default Watchlist;
