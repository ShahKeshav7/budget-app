import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebase';
import Swal from 'sweetalert2';
import "./form.css";
import {  signInWithEmailAndPassword   } from 'firebase/auth';


const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
       
    const handleLogin = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            navigate("/")
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            Swal.fire({
                title: "Error " + errorCode,
                text: errorMessage,
                icon: "error"
            })
        });
       
    }
    return (
        <main >
            <div className="container">
                <div className="signin-signup">
                    {/* Sign-up Form */}
                    <form action="" className="sign-in-form">
                        <h2 className="title">Sign in</h2>
                        <div className="input-field">
                            <i className="fas fa-envelope" />
                            <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                        </div>
                        <div className="input-field">
                            <i className="fas fa-lock" />
                            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                        </div>
                        <a href="#" className="forgot-password">
                            Forgot password?
                        </a>
                        <input type="submit" defaultValue="Login" className="btn1" onClick={handleLogin}/>
                        <p>
                            Don't have an account?{" "}
                            <Link to="/signup" className="account-text" id="sign-up-link">
                                Sign up
                            </Link>
                        </p>
                    </form>

                </div>
            </div>
        </main>
    )
}

export default Login;
