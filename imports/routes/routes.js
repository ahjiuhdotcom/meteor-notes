import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Router, Route, browserHistory } from 'react-router';
import { Session } from 'meteor/session';

import Signup from '../ui/Signup';
import Dashboard from '../ui/Dashboard';
import NotFound from '../ui/NotFound';
import Login from '../ui/Login';

// check for github 'mjackson history' for details of
// navigating history method using js

/*
// Change to use 'privacy' props to each route
const unauthenticatedPages = ['/', '/signup'];
const authenticatedPages = ['/dashboard'];


const onEnterPublicPage = () => {
  if (Meteor.userId()) {
    browserHistory.replace('/dashboard');
  }
};

const onEnterPrivatePage = () => {
  if (!Meteor.userId()) {
    browserHistory.replace('/');
  }
}
*/

// 'nextStage' contain information we about to switch to
// then we can hijack it and do something on it before it render
// check 'react-router' doc for details of 'nextStage'
const onEnterNotePage = (nextStage) => {
  /*
  if (!Meteor.userId()) {
    browserHistory.replace('/');
  } else {
    Session.set('selectedNoteId', nextStage.params.id);
  }
  */
  Session.set('selectedNoteId', nextStage.params.id);
}

const onLeaveNotePage = () => {
  Session.set('selectedNoteId', undefined);
}

export const onAuthChange = (isAuthenticated, currentPagePrivacy) => {
  /*
  const pathname = browserHistory.getCurrentLocation().pathname;
  const isUnauthenticatedPage = unauthenticatedPages.includes(pathname);
  const isAuthenticatedPage = authenticatedPages.includes(pathname);
  */

  const isUnauthenticatedPage = currentPagePrivacy === 'unauth';
  const isAuthenticatedPage = currentPagePrivacy === 'auth';

  if (isUnauthenticatedPage && isAuthenticated) {
    browserHistory.replace('/dashboard');
  } else if (isAuthenticatedPage && !isAuthenticated) {
    browserHistory.replace('/');
  }
};

// this funtion will get two argument, but we only nd the 2nd argument
export const globalOnChange = (prevState, nextStage) => {
  globalOnEnter(nextStage);
};

export const globalOnEnter = (nextStage) => {
  // console.log('nextStage', nextStage);
  // lastRoute is current route
  // 'privacy' props for '*' page will be 'undefined'
  const lastRoute = nextStage.routes[nextStage.routes.length - 1];
  Session.set('currentPagePrivacy', lastRoute.privacy);
};

// 'privacy' is custom props we pass it
export const routes = (
  <Router history={ browserHistory }>
    <Route onEnter={globalOnEnter} onChange={globalOnChange}>
      {/*
      <Route path="/" component={ Login } onEnter={onEnterPublicPage} />
      <Route path="/signup" component={ Signup } onEnter={onEnterPublicPage} />
      <Route path="/dashboard" component={ Dashboard } onEnter={onEnterPrivatePage} />
      */}
      <Route path="/" component={ Login } privacy="unauth" />
      <Route path="/signup" component={ Signup } privacy="unauth" />
      <Route path="/dashboard" component={ Dashboard } privacy="auth" />
      <Route path="/dashboard/:id" component={ Dashboard } privacy="auth" onEnter={onEnterNotePage} onLeave={onLeaveNotePage}/>
      <Route path="*" component={ NotFound } />
    </Route>
  </Router>
);

/*
// browserHistory.push('/links') vs browserHistory.replace('/links')
.push: create a new url (localhost:3000/links) and go to it
e.g. blank page => google.com => localhost:3000 => localhost:3000/links
.replace: replace a existinng url (localhost:3000) with a new url (localhost:3000/links) and go to it
e.g. blank page => google.com => localhost:3000 replace with localhost:3000/links

disadvantage of '.push' is we can't never go back to google.com with 'back' button
as it always go to localhost:3000 then localhost:3000/links again
*/
