import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import FullMapPage from './pages/FullMapPage';
import './App.css'


function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/fullmap" element={<FullMapPage/>}/>
      </Routes>
    </div>
  );
}

export default App;
