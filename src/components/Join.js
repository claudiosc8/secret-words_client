import React, {useState} from 'react';
import {Link} from 'react-router-dom'
import Switch from "react-switch";
import Logo from '../img/logo.svg'
import Button from './Button'

const Join = () => {

	const [name, setName] = useState('')
	const [room, setRoom] = useState('')
	const [spymaster, setSpymaster] = useState(false)

	const handleSubmit = (e) => {
		console.log('form')
		if(!name || !room) {
			e.preventDefault()
		}  else {

			const game = {name, room, spymaster}
			sessionStorage.setItem('game', JSON.stringify(game));
			
			return null
		}
	}

	const switchProps = {
		onColor : '#8bc34a',
		offColor : '#cfd8dc',
		activeBoxShadow : '0 0 0px 3px #1d1d32'
	}

	return (


		<div className="page-container">
		<div>
		<div className="title"><div className="logo-wrapper"><img src={Logo} alt="logo" className="logo" /></div></div>
		<div className={'form-wrapper'}>
			<form onSubmit={handleSubmit} className="form">

				<label htmlFor='name-input'>Your Name</label>
			 	<input type="text" id='name-input' placeholder="Your name" onChange={(e) => setName(e.target.value)} />
			  	<label htmlFor='room-input'>Room Name</label>
			  	<input type="text" id='room-input' placeholder="Room name" onChange={(e) => setRoom(e.target.value)} />

			  	<div className="form-row">
				  	<label htmlFor='spymaster-switch'>Spymaster</label>
				  	<Switch id='spymaster-switch' onChange={(e) => setSpymaster(e)} checked={spymaster} {...switchProps}/>
			  	</div>
			  	<div className='space'></div>
			  	<Link onClick={handleSubmit} to={`/play/${room}`}>
			  		<Button submit={name && room} className="fullwidth" text={'Sign In'} />
			  	</Link>
			  	
			  	
			</form>
			
		</div>
		</div>
		<div className='copyright-section'>
			<a href='http://claudioscotto.it' rel="noopener noreferrer" target="_blank" className='copyright'>©2020 - Claudio Scotto</a>
		</div>
		</div>


		)
}

export default Join