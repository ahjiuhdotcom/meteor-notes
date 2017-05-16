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

// 'nextStage' contain information we about to switch to
// then we can hijack it and do something on it before it render
// check 'react-router' doc for details of 'nextStage'
const onEnterNotePage = (nextStage) => {
  if (!Meteor.userId()) {
    browserHistory.replace('/');
  } else {
    Session.set('selectedNoteId', nextStage.params.id);
  }
}

export const onAuthChange = (isAuthenticated) => {
  const pathname = browserHistory.getCurrentLocation().pathname;
  const isUnauthenticatedPage = unauthenticatedPages.includes(pathname);
  const isAuthenticatedPage = authenticatedPages.includes(pathname);

  if (isUnauthenticatedPage && isAuthenticated) {
    browserHistory.replace('/dashboard');
  } else if (isAuthenticatedPage && !isAuthenticated) {
    browserHistory.replace('/');
  }
};

export const routes = (
  <Router history={ browserHistory }>
    <Route path="/" component={ Login } onEnter={onEnterPublicPage} />
    <Route path="/signup" component={ Signup } onEnter={onEnterPublicPage} />
    <Route path="/dashboard" component={ Dashboard } onEnter={onEnterPrivatePage} />
    <Route path="/dashboard/:id" component={ Dashboard } onEnter={onEnterNotePage} />
    <Route path="*" component={ NotFound } />
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
