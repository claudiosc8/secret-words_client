import React from 'react';
import '../css/Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import Logo from '../img/logo.svg'

const Navbar = ({active, onMenuClick}) => {


	return (

		<header>
			<div className="logo-wrapper"><img src={Logo} alt="logo" className="logo" /></div>


			<div id="menu" onClick={() => onMenuClick(!active)}>
			<FontAwesomeIcon icon={faBars} />
			</div>
		</header>

		)
}

export default Navbar