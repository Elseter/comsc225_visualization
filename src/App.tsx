import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import './App.css'


function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
