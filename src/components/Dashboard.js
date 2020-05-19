import React, {useState, useEffect, useRef} from 'react';
import {Redirect} from 'react-router-dom'
import axios from 'axios';
import '../css/Dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faSave, faChevronRight, faChevronLeft, faPlus } from '@fortawesome/free-solid-svg-icons'
import Button from './Button'
import Popup from './Popup'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const URL = process.env.NODE_ENV !== 'production' ? process.env.REACT_APP_SERVER_URL_DEV : process.env.REACT_APP_SERVER_URL_PRODUCTION

const Dashboard = () => {

	const [error, setError] = useState(false)
	const [loading, setLoading] = useState(true)
	const textRef = useRef(null)
	const searchRef = useRef(null)
	const [pager, setPager] = useState({})
	const [words, setWords] = useState([])
	const [selected, setSelected] = useState([])
	const [showPopup, setShowPopup] = useState(false)

	const getData = (page) => {

		const token = sessionStorage.getItem('token');

		if(token){

		axios.get(`${URL}/dashboard?page=${page || 1}`, {
		    headers: {
		      Authorization: 'Bearer ' + token
		    }
		  })
		  .then(function (response) {
		    console.log(response);
		    if(response.status === 200) {
		    	setLoading(false)
		    	setSelected([])
		    	setWords(response.data.pageOfItems)
		    	setPager(response.data.pager)   
		    	searchRef.current.value = '';        
		    } else {
		    	sessionStorage.removeItem('image');
		    	setError(true)
		    }
		  })
		  .catch(function (error) {
		  	sessionStorage.removeItem('image');
		    setError(true)
		  })

		} else {
			setError(true)
		}

	}

	useEffect(() => {

		getData()

	}, [])

	const sendWords = () => {

		const words = textRef.current.value.split(", ").map(e => {return {name: e.toLowerCase()}})

		const token = sessionStorage.getItem('token');

		axios.post(`${URL}/words`, words, {
		    headers: {
		      Authorization: 'Bearer ' + token
		    }
		  })
		  .then((response) => {

		  	
		  		if(response.status === 200) {


				const {insertedCount, mongoose} = response.data;

		  		getData(pager.totalPages)
			  	setShowPopup(false)

			  	if(insertedCount) {
			  		toast.success(`inserted ${insertedCount} new word/s`, toastOptions)
			  	}

			    if(mongoose.validationErrors) {
			    	mongoose.validationErrors.map(e => {
				    	return toast.error(e.errors.name.message, toastOptions)
				    })
				}

				} else {
			  		toast.error('Some errors occurred', toastOptions);
			  	}


		  })
		  .catch((error) => {
		    console.log(error)
		    toast.error('Some errors occurred', toastOptions);
		  })

	}

	const deleteWord = () => {

		const token = sessionStorage.getItem('token');

		axios.delete(`${URL}/words`, {
		    headers: {
		      Authorization: 'Bearer ' + token
		    },
		    data: {selected}
		  })
		  .then((response) => {
		  	
		  	if(response.status === 200) {
		  		getData(pager.currentPage)
		  		setSelected([])
			    toast.success(response.data.message, toastOptions);
		  	} else {
		  		toast.error('Some errors occurred', toastOptions);
		  	}

		  })
		  .catch((error) => {
		    console.log(error)
		  })
	}

	const handleUpdate = () => {

		const token = sessionStorage.getItem('token');

		const items = words.filter(e => e.edited === true)
		console.log(items)
		axios.patch(`${URL}/words`, items, {
		    headers: {
		      Authorization: 'Bearer ' + token
		    }
		  })
		  .then((response) => {

		  	if(response.status === 200) {
		  		getData(pager.currentPage)
		  		toast.success(response.data.message, toastOptions);
		  	} else {
		  		toast.error('Some errors occurred', toastOptions);
		  	}
		  	
		  })
		  .catch((error) => {
		  	console.log(error)
		    toast.error('Some errors occurred', toastOptions);
		  })
	}

	const handleSearch = value => {

		if(value) {

			const token = sessionStorage.getItem('token');

			if(token){

			axios.get(`${URL}/words/${value}`, {
			    headers: {
			      Authorization: 'Bearer ' + token
			    }
			  })
			  .then(function (response) {
			     if(response.status === 200) {

			    	setLoading(false)
			    	setWords(response.data.pageOfItems)
			    	setPager(response.data.pager)   

			    }
			  })
			  .catch(function (error) {
			    setError(true)
			  })

			} else {
				setError(true)
			}

		} else {
			getData(1)
		}
		

	}

	const handleChange = (value, index, category) => {
		const copy = Object.assign([], words);
		copy[index][category] = value;
		copy[index].edited = true;

		setWords(copy)
	}

	const handleSelect = (id) => {
    
	    if(selected.includes(id)) {
	    	const array = selected.filter(e => e !== id)
	    	setSelected(array)
	    } else {
	    	setSelected([...selected, id])
	    }

	  }

	const toastOptions = {
		position: "bottom-right",
		autoClose: 5000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
	}

	if(error) {
	return <Redirect to='/' />
	}

	if(loading) {
		return <div>Loading</div>
	}
	return (

		<div className="page-container">


            {
            	showPopup && <Popup handleClose={() => setShowPopup(false)}>
		            			<textarea type='text' ref={textRef} placeholder={'Add words separated by comma'} className='input'/>
		            			<Button icon={faPlus} text="Add words" onClick={() => sendWords()} />
	            			</Popup>

            }

		<div className='table-wrapper'>

			<div className="toolbar">
			<div><input type='text' ref={searchRef} onChange={e => handleSearch(e.target.value)} placeholder={'Search'} className='input search'/></div>
			<div>
				<Button icon={faPlus} onClick={() => setShowPopup(true)} />
				<Button icon={faTrash} onClick={deleteWord} disabled={selected.length === 0}/>
				<Button icon={faSave} onClick={handleUpdate} disabled={!words.some(e => e.edited === true)} />
			</div>
			</div>

			
			<table id="table">
			<tbody>
			<tr>
			<th></th>
			<th>#</th>
			<th>Name</th>
			<th>It</th>
			<th>Es</th>
			</tr>
			{
				words && words.map((e,i) => 
				<tr key={i} className={`${selected.includes(e._id) ? 'selected' : ''}`}>
				<td><input type="checkbox" checked={selected.includes(e._id)} onChange={() => handleSelect(e._id)} /> </td>
				<td>{ ((i+1)+(pager.pageSize*(pager.currentPage-1))).toString() }</td>
				<td className='input-field'><input type="text" value={e.name} onChange={(e) => handleChange(e.target.value, i, 'name')} /></td>
				<td className='input-field'><input type="text" value={e.it || ''} onChange={(e) => handleChange(e.target.value, i, 'it')} /></td>
				<td className='input-field'><input type="text" value={e.es || ''} onChange={(e) => handleChange(e.target.value, i, 'es')} /></td>
				</tr>) 
			}
			</tbody>
			</table>

			{pager && pager.pages && pager.pages.length > 1 &&
                        <ul className="pagination">
                            <li className={`page-item first-item ${pager.currentPage === 1 ? 'disabled' : ''}`}>
                                <span onClick={() => getData(1)} className="page-link">First</span>
                            </li>
                            <li className={`page-item previous-item ${pager.currentPage === 1 ? 'disabled' : ''}`}>
                                <span onClick={() => getData(pager.currentPage - 1)} className="page-link"><FontAwesomeIcon icon={faChevronLeft} /></span>
                            </li>
                            {pager.pages.map(page =>
                                <li key={page} className={`page-item number-item ${pager.currentPage === page ? 'active' : ''}`}>
                                    <span onClick={() => getData(page)} className="page-link">{page}</span>
                                </li>
                            )}
                            <li className={`page-item next-item ${pager.currentPage === pager.totalPages ? 'disabled' : ''}`}>
                                <span onClick={() => getData(pager.currentPage + 1)} className="page-link"><FontAwesomeIcon icon={faChevronRight} /></span>
                            </li>
                            <li className={`page-item last-item ${pager.currentPage === pager.totalPages ? 'disabled' : ''}`}>
                                <span onClick={() => getData(pager.totalPages)} className="page-link">Last</span>
                            </li>
                        </ul>
                    }


		</div>

		<ToastContainer />
		</div>

		)
}

export default Dashboard