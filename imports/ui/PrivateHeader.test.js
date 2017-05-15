// enzyme is build on top of 'react-addons-test-utils'
// so 'react-addons-test-utils' must be installed as well

import { Meteor } from 'meteor/meteor';
import React from 'react';
import expect from 'expect';
// 'mount' allow us to mount a component to the DOM,
// then we can assert stuff about them
import { mount } from 'enzyme';

import {PrivateHeader} from './PrivateHeader';

if (Meteor.isClient) {
  describe('PrivateHeader', function() {

      it('should set button test to logout', function() {
        // 'mount' is a function which take single argument which is jsx
        // similiar to pass in component to reactDOM.render()
        // in other words, create a instance of the component
        const wrapper = mount(<PrivateHeader title="Test title" handleLogout={() => {}}/>);

        // Can imaging use this 'wrapper' like jQuery
        const buttonText = wrapper.find('button').text();

        expect(buttonText).toBe('Logout');
      });

      it('should use title prop as h1 text', function() {
        const title = 'Test title here';
        const wrapper = mount(<PrivateHeader title={title} handleLogout={() => {}}/>);
        const h1Text = wrapper.find('h1').text();

        expect(h1Text).toBe(title);
      });

      /*
      // purpose of the following test is to demo how 'spy' works
      it('should call the function', function() {
        // 'spy' is to mock a fucntion, and it is function by itself
        // the purpose of 'spy' is to test the function
        // if is get called/called with certain argument
        const spy = expect.createSpy();
        spy(1, 2);
        // spy can be called many times
        spy('Andrew');

        // expect(spy).toHaveBeenCalled();
        // expect(spy).toNotHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(1, 2);
        expect(spy).toHaveBeenCalledWith('Andrew');
        expect(spy.calls.length).toBe(2); // because it'd been called twice
      });
      */

      it('should call handleLogout on click', function() {
        const spy =  expect.createSpy();
        const wrapper = mount(<PrivateHeader title="Title" handleLogout={spy}/>);

        // Simulate button click using enzyme method
        wrapper.find('button').simulate('click');

        expect(spy).toHaveBeenCalled();
      });
  });
};
