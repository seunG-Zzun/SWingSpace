import { useNavigate } from 'react-router-dom';
import '../css/Home.css';
import ClubCarousel from './ClubCarousel';

function Home() {
  const navigate = useNavigate();
  return (
    <div className="home-container">
          <div className="carousel-section">
        <h3>참여 동아리</h3>
        <ClubCarousel />
      </div>
      <h1 className="project-title">SWingSpace</h1>
        <h2>소프트웨어융합대학 동아리 공간 예약 시스템</h2>
      <div className="button-group">
        <button onClick={() => navigate('/signup')} className="home-button">회원가입</button>
        <button onClick={() => navigate('/login')} className="home-button">로그인</button>
      </div>

    </div>
  );
}

export default Home;