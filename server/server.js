const express = require('express');
const cors = require('cors');


const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use('/users', userRoutes);
app.use('/admin', adminRoutes);
app.use('/reservation', reservationRoutes);

app.get('/', (req, res) => {
  res.send(' 백엔드 서버 실행 중입니다!');
});

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
