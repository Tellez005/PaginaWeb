import axios from 'axios';
import React, { useState } from 'react'
import { Link , useNavigate} from 'react-router-dom'
import './Auth.css';

function Validation(values) {
    let error = {}
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/

    if(values.email === "") {
        error.email = "Email should not be empty"
    }
    else if (!email_pattern.test(values.email)) {
        error.email = "This is not an email"
    } else {
        error.email = ""
    }

    if(values.password === "") {
        error.password = "Password should not be empty"
    }
    else if (!password_pattern.test(values.password)) {
        error.password = "Password didn't match"
    } else {
        error.password = ""
    }
    return error;
}

function Login() {
    const [values, setValues] = useState({
        email: '',
        password: ''
    })

    const navigate = useNavigate();
    const [errors, setErrors] = useState({})

    const handleInput = (event) => {
        setValues(prev => ({...prev, [event.target.name]: event.target.value}))
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const validationErrors = Validation(values)
        setErrors(validationErrors);

        if(validationErrors.email === "" && validationErrors.password === "") {
            axios.post('http://localhost:3001/login', values)
            .then(res => {
                if (res.data === "Success") {
                    navigate('/');
                } else {
                    alert("Account does not exist or wrong password entered")
                }
            })
            .catch(err => {
                console.log("Error de conexion",err)
                alert("No se pudo conectar con el servidor")
            });
        }
    }

    return(
        <div className='auth-container'>
            <div className='auth-box'>
                <h2>Login</h2>
                <form className='auth-form' onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            placeholder='Enter Email'
                            name='email'
                            onChange={handleInput}
                        />
                        {errors.email && <span className='error-text'>{errors.email}</span>}
                    </div>

                    <div className='form-group'>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            placeholder='Enter Password'
                            name='password'
                            onChange={handleInput}
                        />
                        {errors.password && <span className='error-text'>{errors.password}</span>}
                    </div>

                    <button type='submit' className='auth-button'>Log in</button>
                    <p className='auth-text'>You agree to our terms and policies</p>
                    <Link to="/signup" className='auth-link'>Create Account</Link>
                </form>
            </div>
        </div>
    )
}

export default Login