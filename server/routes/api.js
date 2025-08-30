const express = require('express');
const router = express.Router();
const User = require('../modules/user');
const bcrypt = require('bcrypt');


router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Login attempt:', { username, password: password ? '[REDACTED]' : undefined });

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ success: false, message: 'User nicht gefunden' });

    console.log('DB hash (prefix):', user.password && user.password.slice(0,4));

    if (!user.password || typeof user.password !== 'string' || !user.password.startsWith('$2')) {
      console.warn('Ungewöhnlicher Hash in DB:', user.password);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('bcrypt.compare result:', isMatch);

    if (!isMatch) return res.status(401).json({ success: false, message: 'Falsches Passwort' });

    console.log('Login: setting session for user', user._id);
    req.session.userId = user._id;
    console.log('Session after setting:', req.session);
    await req.session.save();
    res.json({ success: true, message: 'Login erfolgreich' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/addUser', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    await user.save();
    res.json({ success: true, message: 'User erfolgreich erstellt' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/loggedIn', async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ success: false, message: "Nicht eingeloggt"});
  return res.json({success: true, message: "eingeloggt"});
});

module.exports = router;