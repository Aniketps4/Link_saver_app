
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const bookmarkRoutes = require('./routes/bookmarks');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/bookmarks', bookmarkRoutes);

app.listen(3001, () => console.log('Server running on port 3001'));