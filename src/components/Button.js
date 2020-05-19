import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'



const Button = ({onClick, text, className, icon, submit, disabled}) => {

	const options = submit ? {type:'submit'} : {}

	return (

		<div className={`button-outer ${className || ''} ${text ? '' : 'empty' } ${!text && icon ? 'icon-only' : ''} ${disabled ? 'disabled' : ''}`}>
			<button {...options} className={`button-inner`} onClick={disabled ? null : onClick}>
				{text} {icon && <FontAwesomeIcon icon={icon} />}
			</button>
		</div>

		)
}

export default Button