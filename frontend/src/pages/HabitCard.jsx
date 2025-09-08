import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function HabitCard({habit:initialHabit}){

    const [message, setMessage] = useState('');
    const [isDeleted, setIsDeleted] = useState(false);
    const [habit, setHabit] = useState(initialHabit);

    const navigate = useNavigate();

    async function deleteHabit(id) {
        const res = await fetch(`http://localhost:501/home/deletehabit/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        });
        const data = await res.json();
        if (data.success) {
            setMessage("Habit deleted successfully!");
            setIsDeleted(true);
        } else {
            setMessage("Failed to delete habit.");
        }
    }

    async function editHabit(habit) {
        navigate(`/editHabit/${habit._id}`);
    }

    async function checkHabit(id) {
        setHabit((prev) => ({ ...prev, done: !prev.done }));
        const res = await fetch(`http://localhost:501/home/checkhabit/${id}`, {
            method : 'GET',
            credentials: 'include',
        });
        const data = await res.json();
        if (data.success) {
            setMessage("Habit updated successfully!");
        } else {
            setMessage("Failed to update habit.");
            setHabit((prev) => ({ ...prev, done: !prev.done }));
        }
    };

    async function decrementCounter(id){
        if (habit.actualCounter === 0) return;
        const newCounter = habit.actualCounter - 1;
        setHabit(prev => ({
            ...prev,
            actualCounter: newCounter,
            done: newCounter >= prev.counterValue
        }));
        const res = await fetch(`http://localhost:501/home/decrementCounter/${id}`, {
            method : 'GET',
            credentials: 'include',
        });
        const data = await res.json();
        if (data.success) {
            setMessage("Habit updated successfully!");
        } else {
            setMessage("Failed to update habit.");
            setHabit(prev => ({
                ...prev,
                actualCounter: prev.actualCounter + 1
            }));
        }
    };

    async function incrementCounter(id){
        if (habit.actualCounter === habit.counterValue) return;
        const newCounter = habit.actualCounter + 1;
        setHabit(prev => ({
            ...prev,
            actualCounter: newCounter,
            done: newCounter >= prev.counterValue
        }));
        const res = await fetch(`http://localhost:501/home/incrementCounter/${id}`, {
            method : 'GET',
            credentials: 'include',
        });
        const data = await res.json();
        if (data.success) {
            setMessage("Habit updated successfully!");
        } else {
            setMessage("Failed to update habit.");
            setHabit(prev => ({
                ...prev,
                actualCounter: prev.actualCounter - 1
            }));
        }
    };

    if (isDeleted) return null;

    if (habit.counter === false) {
        return (
            <>
                <div className="habit-container">
                    <div className="habit-info-container">
                        <div className="first-row-habit">
                            <div className="counter-container">
                                <input type="checkbox" className={`no-counter-btn ${habit.done ? 'checked' : ''}`} checked={habit.done} onChange={() => {checkHabit(habit._id)}} />
                            </div>
                            <p className="habit-title ubuntu-bold">{habit.name}</p>
                        </div>
                        <div className="streak-container">
                            <p className="streak-font">Streak: {habit.streak} days</p>
                        </div>
                        <div className="progress-line-container">
                            <div 
                                className="progress-bar"
                                style={{
                                width: habit.counter
                                    ? `${(habit.actualCounter / habit.counterValue) * 100}%`
                                    : habit.done 
                                    ? "100%" 
                                    : "0%",
                                backgroundColor: habit.done ? "#4caf50" : "#2196f3",
                                }}
                            />
                        </div>
                    </div>
                    <div className="habit-btn-container">
                        <button className="habit-list-edit-btn" onClick={() => editHabit(habit)}></button>
                        <button className="habit-list-del-btn" onClick={() => deleteHabit(habit._id)}></button>
                    </div>
                </div>
            </>
        );
    }else{
        return (
            <>
                <div className="habit-container">
                    <div className="habit-info-container">
                        <div className="first-row-habit">
                            <div className="counter-card-container">
                                <button id="bottone3" className="counter-sub-btn add-btn" onClick={() => {decrementCounter(habit._id)}}></button>
                                <p className="counter-font">{habit.actualCounter}/{habit.counterValue}</p>
                                <button id="bottone3" className="counter-add-btn add-btn" onClick={() => {incrementCounter(habit._id)}}></button>
                            </div>
                            <p className="habit-title ubuntu-bold">{habit.name}</p>
                        </div>
                        <div className="streak-container">
                            <p className="streak-font">Streak: {habit.streak} days</p>
                        </div>
                        <div className="progress-line-container">
                            <div 
                                className="progress-bar"
                                style={{
                                width: habit.counter
                                    ? `${(habit.actualCounter / habit.counterValue) * 100}%`
                                    : habit.done 
                                    ? "100%" 
                                    : "0%",
                                backgroundColor: habit.done ? "#4caf50" : "#2196f3",
                                }}
                            />
                        </div>
                    </div>
                    <div className="habit-btn-container">
                        <button className="habit-list-edit-btn" onClick={() => editHabit(habit)}></button>
                        <button className="habit-list-del-btn" onClick={() => deleteHabit(habit._id)}></button>
                    </div>
                </div>
            </>
        );
    }
}

export default HabitCard;
