import '../css/ClubCarousel.css';

import club1 from '../../assets/logos/AIM.png';
import club2 from '../../assets/logos/DOUM.png';
import club3 from '../../assets/logos/KOBOT.png';
import club4 from '../../assets/logos/FOSCAR.png';
import club5 from '../../assets/logos/KOSS.png';
import club6 from '../../assets/logos/KPSC.png';
import club7 from '../../assets/logos/WINK.png';

const logoList = [club1, club2, club3, club4, club5, club6, club7];

function ClubCarousel() {
  const extendedLogos = [...logoList, ...logoList];
  // const extendedLogos = [...logoList];
  return (
    <div className="carousel-container">
      <div className="carousel-track">
        {extendedLogos.map((src, idx) => (
          <img key={idx} src={src} className="club-logo" alt={`club${idx}`} />
        ))}
      </div>
    </div>
  );
}

export default ClubCarousel;