const express = require('express');
const router = express.Router();
const User = require('../modules/user');
const Habit = require('../modules/habit');

router.get('/', async (req,res) => {
    console.log('Session bei /home:', req.session);
    if (!req.session.userId) return res.status(401).json({ success: false, message: 'Nicht eingeloggt' });
    try {
        const user = await User.findById(req.session.userId);
        if (!user) return res.status(401).json({ success: false, message: 'User nicht gefunden' });
        res.json({ success: true, username: user.username });
    } catch(err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.get('/getDaily', async (req,res) => {
    console.log('Session bei /home:', req.session);
    if (!req.session.userId) return res.status(401).json({ success: false, message: "Nicht eingeloggt"});
    try{
        const user = await User.findById(req.session.userId);
        if (!user) return res.status(401).json({ success: false, message: 'User not found'});
        const habits = await Habit.find({ user: req.session.userId });
        res.json({ success: true, habits: habits})
    }catch(err){
        res.status(500).json({ success: false, message: err.message});
    }
});

const daily = "daily";
const weekly = "weekly";
const calendar = "calendar";

router.post('/setDaily', (req, res) => {
    req.session.habits = daily;
    console.log('Session nach setDaily:', req.session);
    res.json({ success: true, message: 'Daily erfolgreich gesetzt' });
});

router.post('/setWeekly', (req,res) => {
    req.session.habits = weekly;
    console.log('Session nach setWeekly:', req.session);
    res.json({ success: true, message: 'Weekly erfolgreich gesetzt' });
});

router.post('/setCalendar', (req,res) => {
    req.session.habits = calendar;
    console.log('Session nach setCalendar:', req.session);
    res.json({ success: true, message: 'Calendar erfolgreich gesetzt' });
});

router.get('/getView', (req,res) => {
    try{
        const view = req.session.habits;
        res.json({view:view, message: 'View succesfully found!'});
    }catch(err){
        res.json({view:"null", message : err});
    }
})

router.get('/logout', (req,res) => {
    if (!req.session) {
        res.clearCookie('connect.sid', {
        path: '/',
        httpOnly: true,
        sameSite: 'none',
        secure: false
        });
        return res.json({ success: true, message: 'Logout erfolgreich' });
    }
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Logout fehlgeschlagen' });
        }
        res.clearCookie('connect.sid', {
        path: '/',
        httpOnly: true,
        sameSite: 'none',
        secure: false
        });
        res.json({ success: true, message: 'Logout erfolgreich' });
    });
});

router.post('/addhabit', async (req,res) => {
    try {
        const { name } = req.body;
        if (!req.session.userId) return res.status(401).json({ success: false, message: "Nicht eingeloggt"});
        const userId = req.session.userId;
        if (!userId) return res.status(401).json({ success: false, message: 'User not found'});
        const habit = new Habit({ name:name, user:userId });
        await habit.save();
        res.json({ success: true, message: 'Habit erfolgreich erstellt' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;