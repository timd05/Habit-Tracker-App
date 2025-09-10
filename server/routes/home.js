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

/* Routes to get habits */

router.get('/gethabit/:id', async (req,res) => {
    if (!req.session.userId) return res.status(401).json({ success: false, message: "Nicht eingeloggt"});
    const habit_id = req.params.id;
    try{
        const habit = await Habit.findById(habit_id);
        if (!habit) return res.status(404).json({ success: false, message: "Habit nicht gefunden"});
        res.json({ success: true, habit: habit });
    }catch(err){
        res.status(500).json({ success: false, message: err.message});
    }
});

router.get('/getDaily/:dayName', async (req,res) => {
    if (!req.session.userId) return res.status(401).json({ success: false, message: "Nicht eingeloggt"});
    const dayName = req.params.dayName;
    try{
        const user = await User.findById(req.session.userId);
        if (!user) return res.status(401).json({ success: false, message: 'User not found'});
        const habits = await Habit.find({ user: req.session.userId, $or: [
            { frequency: "daily" },
            { frequency: "weekly", days: dayName }
        ] });
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

router.get('/getAllHabits', async (req,res) => {
    if (!req.session.userId) return res.status(401).json({ success: false, message: "Nicht eingeloggt"});
    try{
        const user = await User.findById(req.session.userId);
        if (!user) return res.status(401).json({ success: false, message: 'User not found'});
        const habits = await Habit.find({ user: req.session.userId});
        res.json({ success: true, habits: habits})
    }catch(err){
        res.status(500).json({ success: false, message: err.message});
    }
});

/* Routes for setting the view */

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

/* Route for logging out */

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

/* Routes for adding, editing and deleting a habit */

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
        const { id, habitName, habitFrequency, habitDescription, counterForHabit, counterValue, actualCounter, selectedDays, streak, done } = req.body;
        if (!req.session.userId) return res.status(401).json({ success: false, message: "Nicht eingeloggt"});
        const userId = req.session.userId;
        if (!userId) return res.status(401).json({ success: false, message: 'User not found'});
        const habit = await Habit.findById(id);
        if (!habit) return res.status(404).json({ success: false, message: 'Habit not found'});
        habit.name = habitName || habit.name;
        habit.frequency = habitFrequency || habit.frequency;
        habit.description = habitDescription || habit.description;
        habit.counter = counterForHabit !== undefined ? counterForHabit : habit.counter;
        habit.counterValue = counterValue || habit.counterValue;
        habit.actualCounter = actualCounter || habit.actualCounter;
        habit.days = selectedDays.length ? selectedDays : habit.days;
        habit.streak = streak || habit.streak;
        habit.done = done !== undefined ? done : habit.done;
        await habit.save();
        res.json({ success: true, message: 'Habit erfolgreich editiert', habit });
        console.log('Habit editiert:', habit);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
        console.log('Fehler beim Editieren des Habits:', err);
    }
});

router.delete('/deletehabit/:id', async (req,res) => {
    const id = req.params.id;
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

router.put('/updateHabits', async (req,res) => {
    const { habits } = req.body;
    if (!req.session.userId) return res.status(401).json({ success: false, message: "Nicht eingeloggt"});
    try{
        const user = await User.findById(req.session.userId);
        if (!user) return res.status(401).json({ success: false, message: 'User not found'});
        for (const habit of habits) {
            await Habit.findByIdAndUpdate(habit._id, habit, { new: true });
        }
        res.json({ success: true, message: 'Habits erfolgreich aktualisiert' });
    }catch(err){
        res.status(500).json({ success: false, message: err.message});
    }
});

/* Routes for checking and unchecking habits  */

router.get('/checkhabit/:id', async (req, res) => {
    const id = req.params.id;
    if (!req.session.userId) return res.status(401).json({ success: false, message: "Nicht eingeloggt"});
    try{
        const user = await User.findById(req.session.userId);
        if (!user) return res.status(401).json({ success: false, message: 'User not found'});
        const habit = await Habit.findById(id);
        if (!habit) return res.status(404).json({ success: false, message: 'Habit not found'});
        habit.done = !habit.done;
        if (habit.done) {
            habit.date = new Date();
        }
        await habit.save();
        res.json({ success: true, message: 'Habit erfolgreich aktualisiert', habit });
        console.log(`habit_done: ${habit.done}`);
    }catch(err){
        res.status(500).json({ success: false, message: err.message});
    }
});

/* Routes for habits with counters */

router.get('/incrementCounter/:id', async (req,res) => {
    const id = req.params.id;
    try{
        const user = await User.findById(req.session.userId);
        if (!user) return res.status(401).json({ success: false, message: 'User not found'});
        const habit = await Habit.findById(id);
        if (!habit) return res.status(404).json({ success: false, message: 'Habit not found'});
        if (habit.actualCounter === habit.counterValue) return res.status(400).json({ success: false, message: 'Counter already at maximum value'});
        habit.actualCounter = habit.actualCounter + 1;
        if (habit.actualCounter === habit.counterValue) {
            habit.done = true;
            habit.date = new Date();
        }
        await habit.save();
        res.json({ success: true, message: 'Habit erfolgreich aktualisiert', habit });
        console.log(`habit_done: ${habit.actualCounter}`);
        console.log(`habit_done: ${habit.done}`);
    }catch(err){
        res.status(500).json({ success: false, message: err.message});
    }
});

router.get('/decrementCounter/:id', async (req,res) => {
        const id = req.params.id;
    try{
        const user = await User.findById(req.session.userId);
        if (!user) return res.status(401).json({ success: false, message: 'User not found'});
        const habit = await Habit.findById(id);
        if (!habit) return res.status(404).json({ success: false, message: 'Habit not found'});
        if (habit.actualCounter === 0) return res.status(400).json({ success: false, message: 'Counter already at minimum value'});
        if (habit.actualCounter === habit.counterValue) {
            habit.done = false;
        }
        habit.actualCounter = habit.actualCounter - 1;
        await habit.save();
        res.json({ success: true, message: 'Habit erfolgreich aktualisiert', habit });
        console.log(`habit_done: ${habit.actualCounter}`);
        console.log(`habit_done: ${habit.done}`);
    }catch(err){
        res.status(500).json({ success: false, message: err.message});
    }
});

module.exports = router;