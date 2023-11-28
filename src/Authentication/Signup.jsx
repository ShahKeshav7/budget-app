import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import Swal from 'sweetalert2';
import "./form.css";
import {Link} from 'react-router-dom';


const Signup = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault()

        await createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                navigate("/login")
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                Swal.fire({
                    title: "Error " + errorCode,
                    text: errorMessage,
                    icon: "error"
                })
                // ..
            });


    }

    return (
        <main >
            <div className="container">
                <div className="signin-signup">
                    {/* Sign-up Form */}
                    <form action="" className="sign-up-form">
                        <h2 className="title">Sign up</h2>
                        <div className="input-field">
                            <i className="fas fa-envelope" />
                            <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                        </div>
                        <div className="input-field">
                            <i className="fas fa-lock" />
                            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <input type="submit" defaultValue="Sign up" className="btn1" onClick={handleSubmit} />
                        <p>
                            Already have an account?{" "}
                            <Link to="/login" className="account-text" id="sign-in-link">
                                Sign in
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </main>
    )
}

export default Signup;
