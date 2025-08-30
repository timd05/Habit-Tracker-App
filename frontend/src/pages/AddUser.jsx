import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/AddUser.css';

function AddUser(){
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [e_mail, setE_mail] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('http://localhost:501/api/addUser', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({username, password, e_mail})
        });
        const data = await res.json();
        setMessage(data.message);

        if (data.message === "User erfolgreich erstellt") {
            const loginRes = await fetch('http://localhost:501/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ username, password })
            });
            const loginData = await loginRes.json();

            if (loginData.message === "Login erfolgreich") {
                navigate('/home');
            } else {
                setMessage(loginData.message);
                navigate('/');
            }
        }
    };

    const backLogin = () => {
        navigate('/');
    };

    return (
    <>
        <div className="main-container">
            <button id="bottone5" onClick={backLogin}>Back to Login</button>
            <div className="login-container">

                <h3 className="login-title ubuntu-medium">Register</h3>

                <form className="login-form" onSubmit={handleSubmit}>

                    <input type="text" className="input ubuntu-regular user-input" placeholder='Username*' value={username} onChange={(e) => setUsername(e.target.value)} />

                    <input type="password" className="input ubuntu-regular pwd-input" placeholder='Password*' value={password} onChange={(e) => setPassword(e.target.value)} />

                    <input type="text" className="input ubuntu-regular mail-input" placeholder='E-mail' value={e_mail} onChange={(e) => setE_mail(e.target.value)} />

                    <button type="submit" className="login-btn ubuntu-regular">Sign up</button>

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

export default AddUser
