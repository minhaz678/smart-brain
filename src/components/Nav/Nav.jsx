import React from 'react';

const Nav = ({ onRouteChange, isSignedIn}) => {

  if (isSignedIn) {

    return (
    <nav style={{display: 'flex', 
      justifyContent: 'flex-end'}}>
        <p 
        className='f3 link dim black underline pa3 pointer mt0'
        onClick={() => onRouteChange('signout')}
        >Sign out</p>
    </nav>
    )
  } else {

    return (
      <nav style={{display: 'flex', 
      justifyContent: 'flex-end'}}>
          <p 
          className='f3 link dim black underline pa3 pointer mt0'
          onClick={() => onRouteChange('signIn')}
          >Sign in</p>
          <p 
          className='f3 link dim black underline pa3 pointer mt0'
          onClick={() => onRouteChange('register')}
          >Register</p>
        
    </nav>
  )
 }

}

export default Nav;