require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

const Profile = require('./models/Profile');
const Item = require('./models/Item');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connect
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/quanly';
mongoose.connect(MONGODB_URI)
  .then(()=>console.log('✅ MongoDB connected'))
  .catch(err=>console.error('MongoDB connect error:', err));

// Home page (render index)
app.get('/', async (req, res) => {
  let profile = await Profile.findOne();
  if (!profile) profile = await Profile.create({ name:'', faculty:'', department:'' });
  res.render('index', { profile });
});

// API: Update profile
app.post('/api/profile', async (req, res) => {
  const { name, faculty, department } = req.body;
  let profile = await Profile.findOne();
  if (!profile) profile = new Profile();
  profile.name = name || '';
  profile.faculty = faculty || '';
  profile.department = department || '';
  await profile.save();
  res.json({ ok: true, profile });
});

// API: List items (filter by type)
app.get('/api/items', async (req, res) => {
  const type = req.query.type;
  const q = type ? { type } : {};
  const items = await Item.find(q).sort({ createdAt: -1 }).lean();
  res.json(items);
});

// API: Create item
app.post('/api/items', async (req, res) => {
  const { type, title, kind, members, notes, extra } = req.body;
  const membersArr = Array.isArray(members) ? members : (members ? members.split(',').map(s=>s.trim()) : []);
  const item = await Item.create({ type, title, kind, members: membersArr, notes, extra });
  res.json({ ok: true, item });
});

// API: Delete item
app.delete('/api/items/:id', async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`https://github.com/dotronggiap10-netizen/quanly.git ${PORT}`));
