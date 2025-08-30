import { useState } from 'react';
import { useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Home.css';

function Home(){
    
    const [username, setUsername] = useState('');
    const [habitName, setHabitName] = useState('');
    const [habits, setHabits] = useState([]);
    const [message, setMessage] = useState('');
    const [selectedView, setSelectedView] = useState('');
    const [view, setView] = useState('');
    const navigate = useNavigate();

    const handleClick = async () => {
        const res = await fetch('http://localhost:501/home/logout');
        const data = await res.json();
        setMessage(data.message);
    };

    const handleAddHabit = async () => {
        console.log("Habit adden...")
    }

    async function setDaily() {
        const res = await fetch('http://localhost:501/home/setDaily', {
            method: 'POST',
            credentials: 'include'
        });
        const data = await res.json();
        console.log(data.message);
        setSelectedView("daily");
    }
    async function setWeekly() {
        const res = await fetch('http://localhost:501/home/setWeekly', {
            method: 'POST',
            credentials: 'include'
        });
        const data = await res.json();
        console.log(data.message);
        setSelectedView("weekly");
    }
    async function setCalendar() {
        const res = await fetch('http://localhost:501/home/setCalendar', {
            method: 'POST',
            credentials: 'include'
        });
        const data = await res.json();
        console.log(data.message);
        setSelectedView("calendar");
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

    useEffect(() => {
        async function getDaily(){
            const res = await fetch('http://localhost:501/home/getDaily', {
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
        async function getView(){
            const resView = await fetch('http://localhost:501/home/getView', {
            method : 'GET',
            credentials: 'include'
            });
            const view = await resView.json();
            setView(view.view);
        }
        getView()
        if (view === "daily"){
            getDaily();
        } else {
            setSelectedView("daily");
            getDaily();
        }

    }, [view]);

    useEffect(() => {
        if (message === "Logout erfolgreich"){
            navigate('/');
        }
    }, [message, navigate]);

    return(
        <>
            <div className="home_background">
                <button id="bottone4" className="ubuntu-medium" onClick={handleClick}>Log Out</button>
                <h1 className={`ubuntu-bold view-title ${selectedView === "daily" ? "selected" : ""} `}>Daily View</h1>
                <h1 className={`ubuntu-bold view-title ${selectedView === "weekly" ? "selected" : ""} `}>Weekly View</h1>
                <h1 className={`ubuntu-bold view-title ${selectedView === "calendar" ? "selected" : ""} `}>Calendar View</h1>
                <div className="mainHabit-container">
                    <div className='add-container'>
                        <form className="add-Form" onSubmit={handleAddHabit}>
                            <input type="text" className='habit-input ubuntu-medium' value={habitName} placeholder='Enter a new habit...' onChange={(e) => setHabitName(e.target.value)}/>
                            <button  type="submit" id="bottone3" className="add-btn ubuntu-medium">+</button>
                        </form>
                        <button id="bottone3" className="ubuntu-medium" onClick={handleClick}>Browse</button>
                    </div>
                    <div className="view-container">
                        <button className={`ubuntu-medium view-btn ${selectedView === "daily" ? "selected" : ''}`} onClick={setDaily}>Daily View</button>
                        <button className={`ubuntu-medium view-btn ${selectedView === "weekly" ? "selected" : ''}`} onClick={setWeekly}>Weekly View</button>
                        <button className={`ubuntu-medium view-btn ${selectedView === "calendar" ? "selected" : ''}`} onClick={setCalendar}>Calendar View</button>
                    </div>
                    <div className="habits-list">
                        {habits.map((habit)=>
                            (<p>{habit.name}</p> 
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home
