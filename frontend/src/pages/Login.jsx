import { useState } from 'react';
import { useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css';

function Login(){
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('http://localhost:501/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({username, password})
        });
        const data = await res.json();
        setMessage(data.message);
    };

    useEffect(() => {
        if (message === "Login erfolgreich"){
            navigate('/home');
        }
    }, [message, navigate]);

    const handleSignUp = () => {
        navigate('/addUser');
    };

    return (
    <>
        <div className="main-container">
            <h1 className="title ubuntu-bold">Start tracking your habits now...</h1>
            <div className="login-container">

                <h3 className="login-title ubuntu-medium">Login</h3>

                <form className="login-form" onSubmit={handleSubmit}>

                    <input type="text" className="input ubuntu-regular user-input" placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} />

                    <input type="password" className="input ubuntu-regular pwd-input" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />

                    <button type="submit" className="login-btn ubuntu-regular">Login</button>

                    <div className="register-form ubuntu-regular">
                        <p>Don't have an account? </p>
                        <button className="register-btn" onClick={handleSignUp}>Register</button>
                    </div>
                </form>
            </div>
            {message &&
            <div class="error-message">
                <strong>Fehler:</strong> {message}.
            </div>}
        </div>
    </>
    );
}

export default Login
