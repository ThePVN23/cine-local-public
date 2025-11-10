import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { Star, Plus, Bookmark } from 'lucide-react';

const moviesData = [
  { 
    id: 1, 
    title: 'Weapons', 
    poster: 'https://via.placeholder.com/200x300/1f2937/DC2626?text=Weapons', 
    genre: 'Horror', 
    releaseDate: '08/25/25',
    overview: 'When all but one child from the same classroom mysteriously vanish on the same night at exactly the same time, a community is left questioning who or what is behind their disappearance.',
    rating: 4.5
  },
  { 
    id: 2, 
    title: 'Black Phone 2', 
    poster: 'https://via.placeholder.com/200x300/1f2937/DC2626?text=Black+Phone+2', 
    genre: 'Horror', 
    releaseDate: '2024',
    overview: 'The sequel to the hit horror film Black Phone continues the terrifying story.',
    rating: 4.2
  },
  { 
    id: 3, 
    title: 'Tron Ares', 
    poster: 'https://via.placeholder.com/200x300/1f2937/DC2626?text=Tron+Ares', 
    genre: 'Sci-Fi', 
    releaseDate: '2025',
    overview: 'A new chapter in the Tron universe exploring the digital frontier.',
    rating: 4.0
  },
  { 
    id: 4, 
    title: 'Him', 
    poster: 'https://via.placeholder.com/200x300/1f2937/DC2626?text=Him', 
    genre: 'Drama', 
    releaseDate: '2024',
    overview: 'A powerful drama exploring themes of identity and faith.',
    rating: 4.7
  },
  { 
    id: 5, 
    title: 'Sinners', 
    poster: 'https://via.placeholder.com/200x300/1f2937/DC2626?text=Sinners', 
    genre: 'Drama', 
    releaseDate: '2025',
    overview: 'Michael B. Jordan stars in this intense drama about redemption.',
    rating: 4.3
  }
];

const LandingPage = () => {
  const navigate = useNavigate();
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#000', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ 
        position: 'absolute',
        inset: 0,
        opacity: 0.3,
        backgroundImage: 'linear-gradient(135deg, #1f2937 25%, transparent 25%), linear-gradient(225deg, #1f2937 25%, transparent 25%)',
        backgroundSize: '20px 20px'
      }} />
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: '6rem', 
          fontWeight: 'bold', 
          marginBottom: '2rem',
          color: '#DC2626',
          letterSpacing: '0.1em'
        }}>
          CINE LOCAL
        </h1>
        <p style={{ color: 'white', fontSize: '1.5rem', marginBottom: '2rem' }}>
          Discover and Review Local Cinema
        </p>
        <button
          onClick={() => navigate('/browse')}
          style={{
            backgroundColor: '#1f2937',
            color: 'white',
            padding: '1rem 3rem',
            borderRadius: '0.375rem',
            fontSize: '1.25rem',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#374151'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#1f2937'}
        >
          GET STARTED
        </button>
      </div>
    </div>
  );
};

const Header = () => {
  return (
    <header style={{ 
      backgroundColor: '#111827', 
      borderBottom: '1px solid #1f2937', 
      padding: '1.5rem 2rem' 
    }}>
      <div style={{ 
        maxWidth: '80rem', 
        margin: '0 auto', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <div></div>
        <Link to="/browse" style={{ textDecoration: 'none' }}>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: 'bold', 
            cursor: 'pointer',
            color: '#DC2626',
            letterSpacing: '0.05em'
          }}>
            CINE LOCAL
          </h1>
        </Link>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <button style={{ 
              color: 'white', 
              background: 'none', 
              border: 'none', 
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '1rem'
            }}>
              LOG IN
            </button>
          </Link>
          <Link to="/signup" style={{ textDecoration: 'none' }}>
            <button style={{ 
              backgroundColor: '#DC2626', 
              color: 'white', 
              padding: '0.5rem 1.5rem', 
              borderRadius: '0.375rem',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem'
            }}>
              SIGN UP
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
};

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  
  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };
  
  return (
    <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '2rem' }}>
      <input
        type="text"
        placeholder="Search for movies..."
        value={query}
        onChange={handleSearch}
        style={{
          width: '100%',
          padding: '1rem 1.5rem',
          borderRadius: '9999px',
          backgroundColor: 'white',
          color: '#111827',
          fontSize: '1.125rem',
          border: 'none',
          outline: 'none'
        }}
      />
    </div>
  );
};

const MovieCard = ({ movie, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        cursor: 'pointer',
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        transition: 'transform 0.2s'
      }}
    >
      <div style={{ 
        backgroundColor: '#1f2937', 
        borderRadius: '0.5rem', 
        overflow: 'hidden',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        position: 'relative'
      }}>
        <img 
          src={movie.poster} 
          alt={movie.title}
          style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover' }}
        />
        {isHovered && (
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            textAlign: 'center'
          }}>
            <div>
              <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                {movie.title}
              </h3>
              <p style={{ color: 'white', fontSize: '0.875rem' }}>{movie.genre}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const BrowsePage = () => {
  const navigate = useNavigate();
  const [filteredMovies, setFilteredMovies] = useState(moviesData);
  
  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredMovies(moviesData);
      return;
    }
    
    const filtered = moviesData.filter(movie => 
      movie.title.toLowerCase().includes(query.toLowerCase()) ||
      movie.genre.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredMovies(filtered);
  };
  
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000' }}>
      <Header />
      <SearchBar onSearch={handleSearch} />
      
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '3rem 2rem' }}>
        <h2 style={{ 
          color: 'white', 
          fontSize: '2.25rem', 
          fontWeight: 'bold', 
          marginBottom: '2rem',
          letterSpacing: '0.1em'
        }}>
          {filteredMovies.length === moviesData.length ? 'TRENDING MOVIES' : 'SEARCH RESULTS'}
        </h2>
        
        {filteredMovies.length === 0 ? (
          <div style={{ color: 'white', fontSize: '1.25rem', textAlign: 'center', padding: '5rem 0' }}>
            No movies found. Try a different search.
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
            gap: '2rem' 
          }}>
            {filteredMovies.map((movie) => (
              <MovieCard 
                key={movie.id}
                movie={movie}
                onClick={() => navigate(`/movie/${movie.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const MovieDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const movie = moviesData.find(m => m.id === parseInt(id));
  
  if (!movie) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#000' }}>
        <Header />
        <div style={{ color: 'white', textAlign: 'center', padding: '5rem 0' }}>
          <h2 style={{ fontSize: '1.875rem', marginBottom: '1rem' }}>Movie not found</h2>
          <button 
            onClick={() => navigate('/browse')}
            style={{
              color: '#DC2626',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Return to browse
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000' }}>
      <Header />
      
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '3rem 2rem' }}>
        <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
          <div style={{ width: '320px', flexShrink: 0 }}>
            <div style={{ 
              backgroundColor: '#1f2937', 
              borderRadius: '0.5rem', 
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}>
              <img 
                src={movie.poster} 
                alt={movie.title}
                style={{ width: '100%' }}
              />
            </div>
          </div>
          
          <div style={{ flex: 1, color: 'white' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
              {movie.title}
            </h1>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i}
                    size={24}
                    fill={i < Math.floor(movie.rating) ? '#DC2626' : 'none'}
                    stroke="#DC2626"
                  />
                ))}
              </div>
              <span style={{ fontSize: '1.5rem', fontWeight: '600' }}>{movie.rating}/5</span>
            </div>
            
            <div style={{ marginBottom: '2rem' }}>
              <p style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>
                <span style={{ fontWeight: '600' }}>Genre:</span> {movie.genre}
              </p>
              <p style={{ fontSize: '1.25rem' }}>
                <span style={{ fontWeight: '600' }}>Release Date:</span> {movie.releaseDate}
              </p>
            </div>
            
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.75rem' }}>Overview</h2>
              <p style={{ fontSize: '1.125rem', lineHeight: '1.75', color: '#d1d5db' }}>
                {movie.overview}
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                disabled
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: '#374151',
                  color: '#9ca3af',
                  padding: '0.75rem 2rem',
                  borderRadius: '9999px',
                  fontWeight: '600',
                  cursor: 'not-allowed',
                  opacity: 0.5,
                  border: 'none'
                }}
                title="Login to add reviews"
              >
                <Plus size={20} />
                Add Review
              </button>
              
              <button 
                disabled
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: '#374151',
                  color: '#9ca3af',
                  padding: '0.75rem 2rem',
                  borderRadius: '9999px',
                  fontWeight: '600',
                  cursor: 'not-allowed',
                  opacity: 0.5,
                  border: 'none'
                }}
                title="Login to add to watchlist"
              >
                <Bookmark size={20} />
                Add to Watchlist
              </button>
            </div>
            
            <p style={{ color: '#9ca3af', marginTop: '1rem', fontSize: '0.875rem' }}>
              <Link to="/login" style={{ color: '#DC2626' }}>Log in</Link> or{' '}
              <Link to="/signup" style={{ color: '#DC2626' }}>sign up</Link> to add reviews and create watchlists
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginPage = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000' }}>
      <Header />
      <div style={{ maxWidth: '28rem', margin: '0 auto', padding: '5rem 2rem' }}>
        <div style={{ backgroundColor: '#111827', borderRadius: '0.5rem', padding: '2rem' }}>
          <h2 style={{ color: 'white', fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>
            LOG IN
          </h2>
          <p style={{ color: '#9ca3af', textAlign: 'center', marginBottom: '2rem' }}>
            Login functionality coming soon!
          </p>
          <Link to="/browse" style={{ textDecoration: 'none' }}>
            <button style={{ 
              width: '100%', 
              backgroundColor: '#DC2626', 
              color: 'white', 
              padding: '0.75rem', 
              borderRadius: '0.375rem',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem'
            }}>
              Back to Browse
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const SignupPage = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000' }}>
      <Header />
      <div style={{ maxWidth: '28rem', margin: '0 auto', padding: '5rem 2rem' }}>
        <div style={{ backgroundColor: '#111827', borderRadius: '0.5rem', padding: '2rem' }}>
          <h2 style={{ color: 'white', fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>
            SIGN UP
          </h2>
          <p style={{ color: '#9ca3af', textAlign: 'center', marginBottom: '2rem' }}>
            Signup functionality coming soon!
          </p>
          <Link to="/browse" style={{ textDecoration: 'none' }}>
            <button style={{ 
              width: '100%', 
              backgroundColor: '#DC2626', 
              color: 'white', 
              padding: '0.75rem', 
              borderRadius: '0.375rem',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem'
            }}>
              Back to Browse
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const CineLocalApp = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/movie/:id" element={<MovieDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </Router>
  );
};

export default CineLocalApp;