import React, {useRef, useState} from 'react';
import axios from 'axios';
import '../css/Forms.css';
import Logo from '../img/logo.svg'
import Button from './Button'
import {Redirect} from 'react-router-dom'

const URL = process.env.NODE_ENV !== 'production' ? process.env.REACT_APP_SERVER_URL_DEV : process.env.REACT_APP_SERVER_URL_PRODUCTION

const Login = () => {

	const emailRef = useRef(null)
	const passwordRef = useRef(null)
	const [success, setSuccess] = useState(false)

	const onSubmit = (e) => {
		e.preventDefault();

		const email = emailRef.current.value
		const password = passwordRef.current.value

		axios.post(`${URL}/api/authenticate`, {
		    email, 
		    password
		  })
		  .then(res => {
		    if (res.status === 200) {
		      console.log('login success', res)
		      sessionStorage.setItem('token', res.data.token);
		      setSuccess(true)
		    } else {
		      console.error('login error')
		    }
		  })
		  .catch(err => {
		    console.error(err);
		  });

	}

	if(success) {
		return <Redirect to='dashboard' />
	}

	return (


		<div className="page-container">
		<div>
		<div className="title"><div className="logo-wrapper"><img src={Logo} alt="logo" className="logo" /></div></div>
		<div className={'form-wrapper'}>
			<form onSubmit={onSubmit} className="form">

				<label htmlFor='email-input'>Email</label>
			 	<input type="text" id='email-input' placeholder="Email" ref={emailRef}/>
			  	<label htmlFor='password-input'>Password</label>
			  	<input type="password" id='password-input' placeholder="Password" ref={passwordRef}/>
			  	<Button submit className="fullwidth" text={'Login'} />
			  	
			</form>
			
		</div>
		</div>
		<div className='copyright-section'>
			<a href='http://claudioscotto.it' rel="noopener noreferrer" target="_blank" className='copyright'>©2020 - Claudio Scotto</a>
		</div>
		</div>

		)
}

export default Login