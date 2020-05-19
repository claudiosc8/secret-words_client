import React, {useState, useEffect} from 'react';
import Button from './Button'

const Popup = ({children, handleClose}) => {

	const [show, setShow] = useState(false)


	useEffect( () => {
		setShow(true)
	}, [])

	useEffect( () => {
		if(show) {
			document.body.style.overflow = 'hidden';
		} 
	}, [show])

	const handleHide = () => {
		setShow(false);
		setTimeout(function(){ handleClose(); document.body.style.overflowY = 'unset'; }, 1000);
		
	}

	return (

		<div className={`popup-wrapper ${show ? 'active' : ''}`}>
			 <div className={'popup'}>
				<div className={'popup-inner'}>
				<Button className="close-btn" onClick={handleHide} />
					{children}
				</div>
			</div>
			<div className={'background'} onClick={handleHide}></div>
		</div>



		)
}



export default Popup