import axios from 'axios';
import React, {useState} from 'react'
import { Link , useNavigate} from 'react-router-dom'
import './Auth.css';

function Validation(values) {
    let error = {}
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/

    if(values.name === "") {
        error.name = "Name should not be empty"
    }
    else {
        error.name = ""
    }
    
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
        error.password = "Password should be 8 characters long, with 1 Upercase, 1 lowercase and 1 number"
    } else {
        error.password = ""
    }
    return error;
}

function SignUp() {
    const [values, setValues] = useState({
        name: '',
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
        const validationErrors = Validation(values);
        setErrors(validationErrors);

        if(validationErrors.name === "" && validationErrors.email === "" && validationErrors.password === "") {
            axios.post('http://localhost:3001/signup', values)
            .then(res => {
                navigate('/');
            })
            .catch(err => console.log(err));
        }
    }

    return (
        <div className='auth-container'>
            <div className='auth-box'>
                <h2>Sign Up</h2>
                <form className='auth-form' onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            placeholder='Enter Name'
                            name='name'
                            onChange={handleInput}
                        />
                        {errors.name && <span className='error-text'>{errors.name}</span>}
                    </div>

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

                    <button className='auth-button'>Sign Up</button>
                    <p className='auth-text'>You agree to our terms and policies</p>
                    <Link to="/" className='auth-link'>Back to Login</Link>
                </form>
            </div>
        </div>
    )
}

export default SignUp