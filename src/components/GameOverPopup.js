import React, {useState, useEffect} from 'react';
import Trophie from '../img/trophie.svg'
import useWindowSize from '../utils/WindowSize'
import Confetti from 'react-confetti'
import Button from './Button'

const GameOverPopup = ({winner, blackCard}) => {

	const [active, setActive] = useState(true)
	const [show, setShow] = useState(false)
	const { width, height } = useWindowSize()

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
		setTimeout(function(){ setActive(false); document.body.style.overflowY = 'unset'; }, 1000);
		
	}

	return (
		<React.Fragment>
		<div 
		style={{display: active ? 'block' : 'none'}} 
		className={`popup-wrapper ${show ? 'active' : ''}`}
		>
			 <div className={'popup'}>
				<div className={'popup-inner'}>
				<img src={Trophie} alt='trophie' className="popup-image"/>
				<h2 className={winner}>{winner && winner.toUpperCase()} team wins!</h2>
				<p>{blackCard ? 'The assassin has been found' : 'All words found'}</p>

				<Button text={'New Game'} />

				<Button className="close-btn" onClick={handleHide} />
				</div>
			</div>
			<div className={'background'} onClick={handleHide}></div>
		</div>

		<Confetti
	      width={width}
	      height={height}
	      recycle={false}
	    />

		</React.Fragment>
		)
}



export default GameOverPopup