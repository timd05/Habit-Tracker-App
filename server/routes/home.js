const express = require('express');
const router = express.Router();
const User = require('../modules/user');
const Habit = require('../modules/habit');

router.get('/', async (req,res) => {
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
    if (!req.session.userId) return res.status(401).json({ success: false, message: "Nicht eingeloggt"});
    try{
        const user = await User.findById(req.session.userId);
        if (!user) return res.status(401).json({ success: false, message: 'User not found'});
        const habits = await Habit.find({ user: req.session.userId, frequency: "daily" });
        res.json({ success: true, habits: habits})
    }catch(err){
        res.status(500).json({ success: false, message: err.message});
    }
});

router.get('/getWeekly', async (req,res) => {
    if (!req.session.userId) return res.status(401).json({ success: false, message: "Nicht eingeloggt"});
    try{
        const user = await User.findById(req.session.userId);
        if (!user) return res.status(401).json({ success: false, message: 'User not found'});
        const habits = await Habit.find({ user: req.session.userId, frequency: "weekly" });
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
    res.json({ success: true, message: 'Daily erfolgreich gesetzt' });
});

router.post('/setWeekly', (req,res) => {
    req.session.habits = weekly;
    res.json({ success: true, message: 'Weekly erfolgreich gesetzt' });
});

router.post('/setCalendar', (req,res) => {
    req.session.habits = calendar;
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
        const { habitName, habitFrequency, habitDescription, counterForHabit, counterValue, actualCounter, streak, selectedDays, done } = req.body;
        if (!req.session.userId) return res.status(401).json({ success: false, message: "Nicht eingeloggt"});
        const userId = req.session.userId;
        if (!userId) return res.status(401).json({ success: false, message: 'User not found'});
        const habit = new Habit({ name:habitName, user:userId, frequency: habitFrequency, description: habitDescription, counter: counterForHabit, counterValue: counterValue, actualCounter: actualCounter, streak: streak, days: selectedDays, done: done });
        await habit.save();
        res.json({ success: true, message: 'Habit erfolgreich erstellt' });
        console.log('Neuer Habit erstellt:', habit);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
        console.log('Fehler beim Erstellen des Habits:', err);
    }
});

router.put('/edithabit', async (req,res) => {
    try {
        const { editingHabitId, habitName, habitFrequency, habitDescription, counterForHabit, counterValue, actualCounter, selectedDays, streak, done } = req.body;
        if (!req.session.userId) return res.status(401).json({ success: false, message: "Nicht eingeloggt"});
        const userId = req.session.userId;
        if (!userId) return res.status(401).json({ success: false, message: 'User not found'});
        const habit = await Habit.findById(editingHabitId);
        if (!habit) return res.status(404).json({ success: false, message: 'Habit not found'});
        habit.name = habitName;
        habit.frequency = habitFrequency;
        habit.description = habitDescription;
        habit.counter = counterForHabit;
        habit.counterValue = counterValue;
        habit.actualCounter = actualCounter;
        habit.days = selectedDays;
        habit.streak = streak;
        habit.done = done;
        await habit.save();
        res.json({ success: true, message: 'Habit erfolgreich editiert', habit });
        console.log('Habit editiert:', habit);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
        console.log('Fehler beim Editieren des Habits:', err);
    }
});

router.delete('/deletehabit', async (req,res) => {
    const { id } = req.body;
    if (!req.session.userId) return res.status(401).json({ success: false, message: "Nicht eingeloggt"});
    try{
        const user = await User.findById(req.session.userId);
        if (!user) return res.status(401).json({ success: false, message: 'User not found'});
        await Habit.findByIdAndDelete(id);
        res.json({ success: true, message: 'Habit erfolgreich gelöscht' });
    }catch(err){
        res.status(500).json({ success: false, message: err.message});
    }
});

module.exports = router;