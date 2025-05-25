import { useNavigate } from 'react-router-dom';
import '../css/Home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1 className="project-title">SWingSpace</h1>
      <div className="button-group">
        <button onClick={() => navigate('/signup')} className="home-button">회원가입</button>
        <button onClick={() => navigate('/login')} className="home-button">로그인</button>
      </div>
    </div>
  );
}

export default Home;