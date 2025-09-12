import { useEffect, useState } from 'react';
import { format, lastDayOfMonth, differenceInCalendarDays } from "date-fns";
import { enGB } from "date-fns/locale";
import '../css/Calendar.css';

function Calendar(){
    const [selectedDay, setSelectedDay] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [habits, setHabits] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(format(new Date(), "LLLL", { locale: enGB }));
    const today = new Date();
    const startOfMonth = format(today, "yyyy-MM-01", { locale: enGB });
    const endOfMonth = format(lastDayOfMonth(today), "yyyy-MM-dd", { locale: enGB });
    const weekDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
    const days = [];

    for (let d = new Date(startOfMonth); d <= new Date(endOfMonth); d.setDate(d.getDate() + 1)) {
        days.push(format(d, "yyyy-MM-dd", { locale: enGB }));
    }

    useEffect(() => {
        const day = new Date();
        const month = format(day, "LLLL", { locale: enGB });
        setCurrentMonth(month);
        const todayFormatted = format(new Date(), "yyyy-MM-dd", { locale: enGB });
        dayClicked(todayFormatted);
    }, []);

    function checkDate(day){
        const diff = differenceInCalendarDays(new Date(), new Date(day));
        if (diff >= 1){
            return "past";
        }else if (diff === 0){
            return "today";
        }else{
            return "future";
        }
    }

    async function dayClicked(day) {
        const dayDate = new Date(day);
        const dayName = format(dayDate, "EEEE", { locale: enGB });
        setSelectedDay(dayName);
        setCurrentDate(day);
        const res = await fetch(`http://localhost:501/home/getDaily/${dayName}`, {
            method: 'GET',
            credentials: 'include'
        });
        const data = await res.json();
        if (data.success) {
            setHabits(data.habits);
        }else{
            console.log(data.message);
        }
    }

    return (
        <div className='calendar-main-container ubuntu-regular'>
            <div className='dayInfo-container'>
                <h2>{selectedDay}</h2>
                <hr></hr>
                <div className='habits-list-calendar'>
                    {habits.map(habit => (
                        <div key={habit.id}>
                            <h4>{habit.name}</h4>
                        </div>
                    ))}
                </div>
            </div>
            <div className='calendar-container'>
                <h2>{currentMonth}</h2>
                <div className='week-days'>
                    {weekDays.map((day) => (
                        <div key={day} className='week-day'>
                            {day}
                        </div>
                    ))}
                </div>
                <hr></hr>
                <div className='days-container'>
                    {days.map(day => (
                        <div key={day}>
                            <button className={`calendar-button ${checkDate(day)} ${currentDate === day ? "select" : ""}`} onClick={() => dayClicked(day)}>
                                {day}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Calendar;