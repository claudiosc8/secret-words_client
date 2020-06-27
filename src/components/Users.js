import React from 'react';
import SpymasterFill from '../img/crown.png'

const Users = ({users, me}) => {


	return (

		<div>
			<ul>
				{
					users.map((e,i) => {
					return(		
							<li key={i}>
							{e.name.charAt(0).toUpperCase() + e.name.slice(1) } 
							{e.name === me && <span>(you)</span>}
							{e.spymaster && <img src={SpymasterFill} alt='spymaster' />}
							</li>
						) 
				})
				}
			</ul>
		</div>

		)
}

export default Users