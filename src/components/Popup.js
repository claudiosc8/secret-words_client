import React, {useState, useEffect} from 'react';
import Button from './Button'

const Popup = ({children, handleClose}) => {

	const [show, setShow] = useState(false)


	useEffect( () => {
		setShow(true)
	}, [])

	// useEffect( () => {
	// 	if(show) {
	// 		document.body.className = 'modal-open';
	// 		window.scrollTo(0, 0);
	// 	} 
	// }, [show])

	const handleHide = () => {
		setShow(false);
		setTimeout(function(){ 
			handleClose(); 
			// document.body.className = ''; 
		}, 1000);
		
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