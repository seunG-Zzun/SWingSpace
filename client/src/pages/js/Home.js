import { useNavigate } from 'react-router-dom';
import '../css/Home.css';
import ClubCarousel from './ClubCarousel';

function Home() {
  const navigate = useNavigate();
  let user = null;
  try {
    const userStr = localStorage.getItem('user');
    if (userStr && userStr !== 'undefined') {
      user = JSON.parse(userStr);
    }
  } catch (e) {
    console.error('유저 정보 파싱 실패:', e);
    user = null;
  }

const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  window.location.reload();
};
  return (
    <div className="home-container">
          <div className="carousel-section">
        <ClubCarousel />
      </div>
      <h1 className="project-title">SWingSpace</h1>
        <h2>소프트웨어융합대학 동아리 공간 예약 시스템</h2>

       {user ? ( 
          <>
            <p className="welcome-message">안녕하세요, {user.club} 동아리 {user.name}님!</p>
            <div className="login-group">
              <button onClick={() => navigate('/reservation')} className="login-button">예약화면으로</button>
              <button onClick={logout} className="login-button">로그아웃</button>
            </div>
          </>
        ): (
          <>
            <div className="logout-group">
              <button onClick={() => navigate('/signup')} className="logout-button">회원가입</button>
              <span className="divider-text">또는</span>
              <button onClick={() => navigate('/login')} className="logout-button">로그인</button>
            </div>
          </>
        )}
    </div>
  );
}

export default Home;