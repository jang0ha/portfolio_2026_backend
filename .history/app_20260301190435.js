const express = require('express');
const app = express();
const projectRoutes = require('./routes/projectRoutes');
require('dotenv').config();

app.use(express.json());

// 라우트 등록
app.use('/api/projects', projectRoutes);

app.get('/', (request, response) => {
    response.send({message: "hello world"})
})

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});-