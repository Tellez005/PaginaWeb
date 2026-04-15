import axios from 'axios';
import React, {useState} from 'react'
import { Link , useNavigate} from 'react-router-dom'


function Validation(values) {
    let error = {}
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/
    //Tiene que tener una Mayuscula, Minuscula y Numero

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
    const [errors, setErrors] = useState([])
    
    const handleInput = (event) => {
        setValues(prev => ({...prev, [event.target.name]: event.target.value}))
    }
    
    const handleSubmit = (event) => {
        event.preventDefault();
        setErrors(Validation(values));
        if(errors.name === "" && errors.email === "" && errors.password === "") {
            axios.post('http://localhost:3001/signup', values)
            .then(res => {
                navigate('/');
            })
            .catch(err => console.log(err));
        }
    }

    return (
        <div className='d-flex justify content-center align items-center bg-primary vh-100'>
            <div className='bg-white p-3 rounded w-25'>
                <h2>Sign Up</h2>
                <form action="" onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor="name">Name</label>
                        <input type="name" placeholder='Enter Name' name='name'
                        onChange={handleInput}/>
                        {errors.name && <span className='text-danger'>{errors.name}</span>}
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="email">Email</label>
                        <input type="email" placeholder='Enter Email' name='email'
                        onChange={handleInput}/>
                        {errors.email && <span className='text-danger'>{errors.email}</span>}
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="password">Password</label>
                        <input type="password" placeholder='Enter Password' name='password'
                        onChange={handleInput}/>
                        {errors.password && <span className='text-danger'>{errors.password}</span>}

                    </div>
                    <button className='btn btn-success'>Sign Up</button>
                    <p>You agree to our terms and policies</p>
                    <Link to="/" className='btn btn-default border text-decoration-none'>Back to Login</Link>
                </form>
            </div>
        </div>
    )
}

export default SignUp