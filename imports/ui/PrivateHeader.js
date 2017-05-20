import React from 'react';
import { Accounts } from 'meteor/accounts-base';
import PropTypes from 'prop-types';
import { Session } from 'meteor/session';

// need to install 'react-addons-pure-render-mixin' (npm package)
// before install 'react-meteor-data' (atmosphere package)
// 'react-meteor-data' is kind of connect function in redux
// we need this for testing purpose so that we can inject spy to certain function
import { createContainer } from 'meteor/react-meteor-data';

export const PrivateHeader = (props) => {
    const navImageSrc = props.isNavOpen ? '/images/x.svg' : '/images/bars.svg';

    return (
      <div className="header">
        <div className="header__content">
          <img className="header__nav-toggle" src={navImageSrc} onClick={props.handleNavToggle} />
          <h1 className="header__title">{props.title}</h1>
          <button className="button button--link-text" onClick={() => props.handleLogout()}>Logout</button>
        </div>
      </div>
    );
};

PrivateHeader.propTypes = {
  title: PropTypes.string.isRequired,
  handleLogout: PropTypes.func.isRequired,
  isNavOpen: PropTypes.bool.isRequired,
  handleNavToggle: PropTypes.func.isRequired
};

// createContainer take two argument
// 1. function to run whenever there is something change in the props
// The function act like 'traker.autorun' function
// 2. Component to render
export default createContainer(() => {
  // initially: 'onClick={() => Accounts.logout()}'
  // change to 'onClick={() => props.handleLogout()}'
  // so that we can inject spy to the props for testing
  return {
    // we use the first style because Accounts.logout didn't require any argument
    // to make it consistent with Login.js and Signup.js, we use 2nd style here
    handleLogout: () => Accounts.logout(),
    // handleLogout: Accounts.logout // this one not working

    handleNavToggle: () => Session.set('isNavOpen', !Session.get('isNavOpen')),
    isNavOpen: Session.get('isNavOpen')
  };
}, PrivateHeader);

// export default PrivateHeader;

/*
// redux or react-meteor-data?
Andrew: I was deciding between redux or react-meteor-data.
I put together an example app of both to see how they played out.
In the end, I went with react-meteor-data to take advantage of DDP
and the fact that the entire application state is already synchronously
available on the client. The redux solution didn't work as well as
the highly integrated meteor-react-data solution.
They both worked, but meteor-react-data had less code
and took advantage of the existing meteor features.
*/
