import { useState } from 'react';
import { useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';

function AddHabit(){
    
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('http://localhost:501/home/addhabit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({name})
        });
        const data = await res.json();
        setMessage(data.message);
    };

    useEffect(() => {
        if (message === "Habit erfolgreich erstellt"){
            navigate('/home');
        }
    }, [message, navigate]);

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

    return (
    <>
      <NavBar />
      <p>This is the add habit page!</p>
      <form onSubmit={handleSubmit}>
        <label>Titel:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

        <button type="submit">Add Habit</button>
      </form>
      {message && <p>{message}</p>}
    </>
  );
}

export default AddHabit
