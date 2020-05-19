import React, {useEffect, useState} from 'react';
import io from 'socket.io-client';
import InfoBar from './InfoBar'
import Messages from './Messages'
import Users from './Users'
import Navbar from './Navbar'
import Button from './Button'
import SidebarSection from './SidebarSection'
import {useParams, Redirect } from 'react-router-dom'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import Switch from "react-switch";
import { TailSpin } from 'svg-loaders-react'
import '../css/Popup.css';
import '../css/Game.css';
import '../css/Sidebar.css';
import Trophie from '../img/trophie.svg'
import {getSize} from '../utils/WindowSize'
import Confetti from 'react-confetti'
import Popup from './Popup'
import Logo from '../img/logo.svg'

let socket;
const ENDPOINT = process.env.NODE_ENV !== 'production' ? process.env.REACT_APP_SERVER_URL_DEV : process.env.REACT_APP_SERVER_URL_PRODUCTION

const switchProps = {
		onColor : '#009688',
		offColor : '#1c1f38',
		activeBoxShadow : '0 0 0px 3px #1d1d32',
		boxShadow: '0 0 5px 3px #1d1d3233',
	}

const Game = ({location}) => {

	let { room } = useParams();
	const [puzzle, setPuzzle] = useState({})
	const [user, setUser] = useState('')
	const [users, setUsers] = useState([]);
	const [error, setError] = useState(false)
	const [loading, setLoading] = useState(true)
	const [showSidebar, setShowSidebar] = useState(false)
	const [spymasterView, setSpymasterView] = useState(false)
	const [language, setlanguage] = useState('en')
	const [showPopup, setShowPopup] = useState(true)

	//SETUP SOCKET
	useEffect( () => {

		// const {name} = queryString.parse(location.search);

		const game = JSON.parse(sessionStorage.getItem('game'));

		if(!game) {
			setError(true)
			return 
		}


		if(game) {

			const {name, spymaster} = game;

			socket = io(ENDPOINT);
			socket.emit('join', {name, room, spymaster}, (response) => {
				if(response.error) {
					setError(true)
				} else {
					setUser(response)
				}
				
			});

			return () => {
				socket.emit('disconnect');
				socket.off();
			}

		} else {
			setError(true)
		}

		

	}, [location.search, room])

	//HANDLING ONLINE USERS
	useEffect( () => {

		if(socket) {
			socket.on("onlineUsers", ({ users }) => {
		      setUsers(users);
		    });
		}

	}, [users])


	useEffect( () => {

		if(socket) {
			socket.on("getPuzzle", (puzzle) => {
		      setPuzzle(puzzle);
		      setLoading(false)
		    });
		}

	}, [])


	const endTurn = (e) => {
		e.preventDefault(); 
		socket.emit('endTurn')
	}

	const newGame = (e) => {
		e.preventDefault(); 
		setShowPopup(false)
		socket.emit('newGame')
	}

	const selectWord = (word) => {

		if(!puzzle.winner) {
			if(puzzle.selected === word) {
				socket.emit('guessWord', word)
			} else {
				socket.emit('selectWord', word)
			}
		}

	}


	if(error) {
		return <Redirect to='/' />
	}

	return (

		<React.Fragment>
		
		<div className={`container ${puzzle.currentTurn}`}>



			<div className={`contents`}>

				<Navbar onMenuClick={setShowSidebar} active={showSidebar} />

				{puzzle.winner && showPopup &&

							<Popup handleClose={() => setShowPopup(false)}>
		            			<img src={Trophie} alt='trophie' className="popup-image"/>
								<h2 className={puzzle.winner}>{puzzle.winner && puzzle.winner.toUpperCase()} team wins!</h2>
								<p>{puzzle.black ? 'The assassin has been found' : 'All words found'}</p>
								<Button text={'New Game'} onClick={newGame} />
	            			</Popup>

							}

				{puzzle.winner && <Confetti
								      width={getSize().width}
								      height={getSize().height}
								      recycle={false}
								    />
				}

				{loading ? 

					<TailSpin stroke="#FFF" strokeOpacity="1" /> 

					: <div className={`gameContainer`}>
				
					<div className="top-bar">
					
					<div>
					{puzzle.currentTurn && !puzzle.winner && 
						<span className={`currentTurn ${puzzle.currentTurn}`}>
						{puzzle.currentTurn.toUpperCase()} team's turn
						</span>
						
					}
					</div>

							{puzzle.points && <div className="scores">

									<svg xmlns="http://www.w3.org/2000/svg">  

										<defs>
										    <linearGradient id="redGradient" x1="0" x2="0" y1="0" y2="1">
										        <stop offset="0"  stopColor='#f44336'/>
										        <stop offset="100%" stopColor="#d32f2f"/>
										    </linearGradient>
										    <linearGradient id="blueGradient" x1="0" x2="0" y1="0" y2="1">
										        <stop offset="0%"  stopColor='#4fc3f7'/>
										        <stop offset="100%" stopColor='#03a9f4'/>
										    </linearGradient>
										</defs>

					
										<text className={`score red`} x="20%" y="94%">{puzzle.points.red}</text>  
										<text className={`score neutral`} x="50%" y="94%">-</text>  
										<text className={`score blue`} x="80%" y="94%">{puzzle.points.blue}</text>  
									</svg>  
									
								</div>

						}

					<div>
						

					</div>

					</div>
					

					<div id='game'>{puzzle.words && puzzle.words.map((e,i) => {
						return (
							<div 
								key={i} 
								className={`card ${e.color ? e.color : 'hidden'} ${e.value === puzzle.selected ? 'selected team-' + puzzle.currentTurn  : ''} ${(puzzle.winner || spymasterView) || !e.value === puzzle.selected ? puzzle.key[i] : ''}`}
								onClick={e.color ? null : () => selectWord(e.value)}
								>
								{e.label[language]}
								{e.value === puzzle.selected && 
									<span className='confirm-selection' 
										data-text='Click again to confirm your choice' 
										data-text-short='Click to confirm your choice'
									></span>}
							</div>
							)
					})}
					</div>

					<div className="bottom-bar">
					<div>
					 <div className="setting">
													<label htmlFor="spymaster-switch">Spymaster's view</label> 
													<Switch id='spymaster-switch' onChange={(e) => setSpymasterView(e)} checked={spymasterView} {...switchProps}/>
												</div>
					</div>

					<div className="center">
						 <Button text={'End Turn'} onClick={endTurn} icon={faChevronRight} />
					</div>
					<div></div>
					</div>
				</div>


				}

			</div>

			<div className={`close-menu ${showSidebar ? 'show' : ''}`} onClick={() => setShowSidebar(false)}></div>
			<div id={"sidebar"} className={`${showSidebar ? 'show' : ''}`}>


				<div className="logo-wrapper"><img src={Logo} alt="logo" className="logo" /></div>
				<div className="sidebar-content">
				<div>

					<SidebarSection title='Room' variant='space-between'>
						{room}
					</SidebarSection>

					<SidebarSection title='Online players' className='online-users' scroll>
						<Users users={users} me={user.name}/>
					</SidebarSection>
					<SidebarSection title='Game log' className='log-messages' scroll>
						<Messages messages={puzzle.messages ? puzzle.messages : []} />
					</SidebarSection>

					<SidebarSection title='Language' variant='space-between' className="language-wrapper">
						<select id="languages" className="select-css" defaultValue={language} onChange={e => setlanguage(e.target.value)}>
						  <option value="en">🇬🇧</option>
						  <option value="it">🇮🇹</option>
						  <option value="es">🇪🇸</option>
						</select>
					</SidebarSection>

				</div>
				
				<div>
					<div className={'sidebar-section'}>
					<Button text={'New game'} onClick={newGame} className='fullwidth outline' />
					
					<a href='/'><Button className='fullwidth outline' text={'Leave room'} /></a>
					</div>
					<div className='sidebar-section copyright-section'>
						<a href='http://claudioscotto.it' rel="noopener noreferrer" target="_blank" className='copyright'>©2020 - Claudio Scotto</a>
					</div>
				</div>
				
				</div>
			</div>

		</div>
		</React.Fragment>
		)
}

export default Game