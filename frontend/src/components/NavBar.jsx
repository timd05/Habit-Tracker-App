import '../css/NavBar.css';

function NavBar() {

    const handleDaily = async () => {
        await fetch('http://localhost:501/home/setDaily');
    };
    const handleWeekly = async () => {
        await fetch('http://localhost:501/home/setDaily');
    };
    const handleMonthly = async () => {
        await fetch('http://localhost:501/home/setDaily');
    };
    const handleCalendar = async () => {
        await fetch('http://localhost:501/home/setDaily');
    };


    return (
        <>
            <div className="nav-container">
                <button className="btn" onClick={handleDaily}>Daily</button>
                <button className="btn" onClick={handleWeekly}>Weekly</button>
                <button className="btn" onClick={handleMonthly}>Monthly</button>
                <button className="btn" onClick={handleCalendar}>Calendar View</button>
            </div>
        </>
    );
}

export default NavBar;