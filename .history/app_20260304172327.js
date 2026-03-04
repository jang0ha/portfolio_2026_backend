const express = require('express');
const cors = require('cors'); // 추가 필요
const app = express();
const projectRoutes = require('./routes/projectRoutes');
require('dotenv').config();

// CORS 설정: 모든 도메인 허용 혹은 특정 프론트엔드 주소 허용
app.use(cors()); 

app.use(express.json());

// 라우트 등록
app.use('/api/projects', projectRoutes);

app.get('/', (request, response) => {
    response.send({message: "hello world"})
});

// Vercel 환경에서는 app.listen이 없어도 동작하지만, 로컬 테스트를 위해 유지
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app; // Vercel을 위해 추가