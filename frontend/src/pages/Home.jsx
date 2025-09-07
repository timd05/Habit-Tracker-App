import { useState } from 'react';
import { useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from "date-fns";
import { enGB } from "date-fns/locale";
import HabitCard from './HabitCard';
import '../css/Home.css';

function Home(){
    
    const [username, setUsername] = useState('');
    const [habitName, setHabitName] = useState('');
    const [habits, setHabits] = useState([]);
    const [message, setMessage] = useState('');
    const [selectedView, setSelectedView] = useState('');
    const [view, setView] = useState('');
    const navigate = useNavigate();
    const [showAddHabitForm, setShowAddHabitForm] = useState(false);
    const [habitFrequency, setHabitFrequency] = useState('daily');
    const [habitDescription, setHabitDescription] = useState('');
    const [counterForHabit, setCounterForHabit] = useState(false);
    const [counterValue, setCounterValue] = useState('');
    const [selectedDays, setSelectedDays] = useState([]);

    const handleLogout = async () => {
        const res = await fetch('http://localhost:501/home/logout');
        const data = await res.json();
        setMessage(data.message);
    };

    async function refreshHabits() {
        if (selectedView === "daily") {
            const date = new Date();
            const dayName = format(date, "EEEE", { locale: enGB });
            await getDaily(dayName);
        } else if (selectedView === "weekly") {
            await getWeekly();
        }else if (selectedView === "calendar") {
            await getCalendar();
        }
    }

    async function handleAddHabit() {
        const res = await fetch('http://localhost:501/home/addhabit', {
            method: 'POST',
            credentials: 'include',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({habitName, habitFrequency, habitDescription, counterForHabit,counterValue, selectedDays})
        });
        const data = await res.json();
        if (data.success) {
            setMessage("Habit added successfully!");
            setHabitName('');
            setHabitDescription('');
            setCounterForHabit(false);
            setCounterValue('');
            setSelectedDays([]);
            refreshHabits();
        } else {
            setMessage("Failed to add habit.");
        }
    }

    function showAddHabit(e){
        e.preventDefault();
        if (showAddHabitForm === true){
            setShowAddHabitForm(false);
        }else{
            setShowAddHabitForm(true);
        }
    }

    const toggleDay = (day) => {
        setSelectedDays((prevDays) => {
            return prevDays.includes(day)
            ? prevDays.filter((d) => d !== day)
            : [...prevDays, day];
        });
    };

    async function setDaily() {
        const res = await fetch('http://localhost:501/home/setDaily', {
            method: 'POST',
            credentials: 'include'
        });
        const data = await res.json();
        console.log(data.message);
        setSelectedView("daily");
        const date = new Date();
        const dayName = format(date, "EEEE", { locale: enGB });
        await getDaily(dayName);
    }
    async function setWeekly() {
        const res = await fetch('http://localhost:501/home/setWeekly', {
            method: 'POST',
            credentials: 'include'
        });
        const data = await res.json();
        console.log(data.message);
        setSelectedView("weekly");
        await getWeekly();
    }
    async function setCalendar() {
        const res = await fetch('http://localhost:501/home/setCalendar', {
            method: 'POST',
            credentials: 'include'
        });
        const data = await res.json();
        console.log(data.message);
        setSelectedView("calendar");
        await getCalendar();
    }

    useEffect(() => {
        async function loggedIn(){
            try{
                const res = await fetch('http://localhost:501/api/loggedIn', {
                method: 'GET',
                credentials: 'include'
            });
                const data = await res.json();
                if (!data.success){
                    const logOutRes = await fetch('http://localhost:501/home/logout', {
                        method: 'GET',
                        credentials: 'include'
                    });
                    const logOutData = await logOutRes.json();
                    if (logOutData.success){
                        navigate('/');
                    }
                }
            }catch(err){
                console.error('Fehler bei der Session-Prüfung:', err);
            }
        }
        loggedIn();
    }, [navigate]);

    useEffect(() => {
        async function getUser() {
            const res = await fetch('http://localhost:501/home', {
            method: 'GET',
            credentials: 'include'
        });
            const data = await res.json();
            if (data.success) {
                setUsername(data.username);
            }
        }
        getUser();
    }, []);

    async function getDaily(dayName){
        const res = await fetch(`http://localhost:501/home/getDaily/${dayName}`, {
        method: 'GET',
        credentials: 'include'
    });
        const data = await res.json();
        if (data.success) {
            if (data.habits.length === 0){
                setHabits([{ name: "Here are no habits..."}]);
            }else {
                setHabits(data.habits);
            }
        }
    }

    async function getWeekly(){
        const res = await fetch('http://localhost:501/home/getWeekly', {
        method: 'GET',
        credentials: 'include'
    });
        const data = await res.json();
        if (data.success) {
            if (data.habits.length === 0){
                setHabits([{ name: "Here are no habits..."}]);
            }else {
                setHabits(data.habits);
            }
        }
    }

    async function getCalendar(){
        const res = await fetch('http://localhost:501/home/getAllHabits', {
            method : 'GET',
            credentials: 'include'
        });
        const data = await res.json();
        if (data.success) {
            if (data.habits.length === 0){
                setHabits([{ name: "Here are no habits..."}]);
            }else {
                setHabits(data.habits);
            }
        }
    };

    useEffect(() => {
    async function loadData(){
        const resView = await fetch('http://localhost:501/home/getView', {
            method : 'GET',
            credentials: 'include'
        });
        const viewData = await resView.json();
        setView(viewData.view || "daily");

        const date = new Date();
        const dayName = format(date, "EEEE");

        if (viewData.view === "daily" || !viewData.view){
            await getDaily(dayName);
            setSelectedView("daily");
        } else if (viewData.view === "weekly") {
            await getWeekly();
            setSelectedView("weekly");
        } else if (viewData.view === "calendar") {
            setSelectedView("calendar");
            getCalendar();
        }
    }
    loadData();
}, []);


    useEffect(() => {
        if (message === "Logout erfolgreich"){
            navigate('/');
        }
    }, [message, navigate]);

    return(
        <>
            <div className="home_background">
                <button id="bottone4" className="ubuntu-medium" onClick={handleLogout}>Log Out</button>
                <h1 className={`ubuntu-bold view-title ${selectedView === "daily" ? "selected" : ""} `}>Daily View</h1>
                <h1 className={`ubuntu-bold view-title ${selectedView === "weekly" ? "selected" : ""} `}>Weekly View</h1>
                <h1 className={`ubuntu-bold view-title ${selectedView === "calendar" ? "selected" : ""} `}>Calendar View</h1>
                <div className="mainHabit-container">
                    <div className='add-container'>
                        <form className="add-Form" onSubmit={showAddHabit}>
                            <input type="text" className='habit-input ubuntu-medium' value={habitName} placeholder='Enter a new habit...' onChange={(e) => setHabitName(e.target.value)}/>
                            <button  type="submit" id="bottone3" className="add-btn ubuntu-medium">+</button>
                        </form>
                        <button id="bottone3" className="ubuntu-medium" onClick={handleLogout}>Browse</button>
                    </div>
                    <div className="view-container">
                        <button className={`ubuntu-medium view-btn ${selectedView === "daily" ? "selected" : ''}`} onClick={setDaily}>Daily View</button>
                        <button className={`ubuntu-medium view-btn ${selectedView === "weekly" ? "selected" : ''}`} onClick={setWeekly}>Weekly View</button>
                        <button className={`ubuntu-medium view-btn ${selectedView === "calendar" ? "selected" : ''}`} onClick={setCalendar}>Calendar View</button>
                    </div>
                    <div className="habits-list ubuntu-medium">
                        {habits.map((habit)=>
                            (<HabitCard key={habit._id} habit={habit} />)
                        )}
                    </div>
                </div>
            </div>
            <div className={`addHabit-container ${showAddHabitForm === true ? "add-open" : ''}`}>
                <form className="addHabit-form" onSubmit={handleAddHabit}>
                    <div className="add-input-row">
                        <div className="title-container">
                            <label className="ubuntu-medium">Titel:</label>
                            <input type="text" className="ubuntu-medium" value={habitName} onChange={(e) => setHabitName(e.target.value)} />
                        </div>
                        <div>
                            <label className='ubuntu-medium'>Frequency:</label>
                            <div className='frequency-container'>
                                <input type="radio" id='daily' name='frequency' value='daily' checked={habitFrequency === 'daily'} onChange={(e) => setHabitFrequency(e.target.value)} />
                                <label htmlFor="daily">Daily</label>
                                <input type="radio" id='weekly' name='frequency' value='weekly' checked={habitFrequency === 'weekly'} onChange={(e) => setHabitFrequency(e.target.value)} />
                                <label htmlFor="weekly">Weekly</label>
                            </div>
                            {habitFrequency === "weekly" && (
                                <div className="weekly-container">
                                    {[
                                    { value: "Monday", label: "Mo" },
                                    { value: "Tuesday", label: "Tu" },
                                    { value: "Wednesday", label: "We" },
                                    { value: "Thursday", label: "Th" },
                                    { value: "Friday", label: "Fr" },
                                    { value: "Saturday", label: "Sa" },
                                    { value: "Sunday", label: "Su" },
                                    ].map((day) => (
                                    <label key={day.value} className="ubuntu-medium">
                                        <input
                                        type="checkbox"
                                        value={day.value}
                                        checked={selectedDays.includes(day.value)}
                                        onChange={() => toggleDay(day.value)}
                                        />
                                        {day.label}
                                    </label>
                                    ))}
                                </div>
                                )}
                        </div>
                    </div>
                    <div className="add-input-row">
                        <div className="description-container">
                            <input type="text" className="ubuntu-medium" value={habitDescription} onChange={(e) => setHabitDescription(e.target.value)} placeholder="Enter habit description..." />
                        </div>
                    </div>
                    <div className="add-input-row">
                        <div className='counter-container'>
                            <label>Counter:</label>

                            <input 
                                type='radio' 
                                id='counterYes' 
                                name='counter' 
                                value='yes' 
                                checked={counterForHabit === true}
                                onChange={() => setCounterForHabit(true)} 
                            />
                            <label htmlFor='counterYes'>Yes</label>

                            <input 
                                type='radio' 
                                id='counterNo' 
                                name='counter' 
                                value='no' 
                                checked={counterForHabit === false}
                                onChange={() => setCounterForHabit(false)} 
                            />
                            <label htmlFor='counterNo'>No</label>

                            {counterForHabit && (
                                <div className="counterForHabit counter-active">
                                <input 
                                    type="number" 
                                    className="ubuntu-medium" 
                                    value={counterValue} 
                                    onChange={(e) => setCounterValue(e.target.value)} 
                                    placeholder="Enter counter value..." 
                                />
                                </div>
                            )}
                            </div>

                    </div>
                    <button type="submit">Add Habit</button>
                </form>
            </div>
        </>
    )
}

export default Home
