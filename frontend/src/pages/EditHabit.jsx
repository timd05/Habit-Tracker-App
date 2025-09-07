import { useParams } from "react-router-dom";
import { useState,useEffect } from "react";
import { useNavigate } from 'react-router-dom';

function EditHabit() {
    
    const navigate = useNavigate();
    const { id } = useParams();
    const [habit, setHabit] = useState(null);
    const [habitFrequency, setHabitFrequency] = useState('daily');
    const [habitDescription, setHabitDescription] = useState('');
    const [counterForHabit, setCounterForHabit] = useState(false);
    const [counterValue, setCounterValue] = useState('');
    const [selectedDays, setSelectedDays] = useState([]);
    const [habitName, setHabitName] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        async function fetchHabit() {
            const res = await fetch(`http://localhost:501/home/gethabit/${id}`, {
                method: 'GET',
                credentials: 'include',
            });
            const data = await res.json();
            if (data.success) {
                const h = data.habit;
                setHabit(h);
                setHabitName(h.name);
                setHabitDescription(h.description || '');
                setHabitFrequency(h.frequency || 'daily');
                setCounterForHabit(h.counterForHabit || false);
                setCounterValue(h.counterValue || '');
                setSelectedDays(h.days || []);
            }
        }
        fetchHabit();
    }, [id]);

    const toggleDay = (day) => {
        setSelectedDays((prevDays) => {
            return prevDays.includes(day)
            ? prevDays.filter((d) => d !== day)
            : [...prevDays, day];
        });
    };

    async function handleEditHabit(e) {
        e.preventDefault();
        const res = await fetch('http://localhost:501/home/edithabit', {
            method: 'PUT',
            credentials: 'include',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({id, habitName, habitFrequency, habitDescription, counterForHabit,counterValue, selectedDays})
        });
        const data = await res.json();
        if (data.message === "Habit erfolgreich editiert") {
            setMessage("Habit edited successfully!");
            setHabitName('');
            setHabitDescription('');
            setCounterForHabit(false);
            setCounterValue('');
            setSelectedDays([]);
            navigate('/home');
        } else {
            setMessage("Failed to edit habit.");
        }
    }

    return (
        <div className="addHabit-container add-open">
            <form className="addHabit-form" onSubmit={handleEditHabit}>
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
                <button type="submit">Edit Habit</button>
            </form>
        </div>
    )
}

export default EditHabit;