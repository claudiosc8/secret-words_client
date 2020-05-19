import React from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';

const SidebarSection = ({title, className, children, variant, scroll}) => {


	return (

		<React.Fragment>
			<div className={`sidebar-section ${variant || ''}`}>
				<h4>{title}</h4>

						{scroll ? <ScrollToBottom className={className}>
									{children}
									</ScrollToBottom> 	
								: <div className={className}>{children}</div>
								}
					
				
			</div>
			<hr />
		</React.Fragment>
		)
}

export default SidebarSection