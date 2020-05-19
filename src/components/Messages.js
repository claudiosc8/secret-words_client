import React from 'react';
import * as moment from 'moment';

const Messages = ({messages}) => {


	return (

		<div>

			{messages.map((e,i) => {
				return(
					<div key={i} className="message">
						<span className="time">{moment(e.time).format('LT')}</span>
						<span className="text">{e.text}</span>
					</div>

					) 
			})}

		</div>

		)
}

export default Messages