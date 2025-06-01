import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Signup from './Signup';
import Login from './Login';
import Reservationpage from './Reservationpage';
import Mypage from './Mypage';
import AdminDashboard from './AdminDashboard';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reservation" element={<Reservationpage />} />
        <Route path="/mypage" element={<Mypage />} /> 
        <Route path="/admin" element={<AdminDashboard />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;