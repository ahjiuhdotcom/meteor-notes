// enzyme is build on top of 'react-addons-test-utils'
// so 'react-addons-test-utils' must be installed as well

import { Meteor } from 'meteor/meteor';
import React from 'react';
import expect from 'expect';
// 'mount' allow us to mount a component to the DOM,
// then we can assert stuff about them
import { mount } from 'enzyme';

import { Login } from './Login';

if (Meteor.isClient) {
  describe('Login', function() {
    it('should show error messages', function() {
      const error = 'This is not working';
      const wrapper = mount(<Login loginWithPassword={() => {}}/>);

      wrapper.setState({error});
      expect(wrapper.find('p').text()).toBe(error);

      wrapper.setState({error: ''});
      expect(wrapper.find('p').length).toBe(0);
    });

    it('should call loginWithPassword witht the form data', function() {
      const email = 'andrew@test.com';
      const password = 'password123';
      const spy = expect.createSpy();
      const wrapper = mount(<Login loginWithPassword={spy}/>);

      // 'node' convert enzyme wrapper to regular dom element (htmlinputelement in this case),
      // so that we can use vanilar js to manipulate the element
      wrapper.ref('email').node.value = email;
      wrapper.ref('password').node.value = password;
      wrapper.find('form').simulate('submit');

      // we don't use 'toHaveBeenCalledWith' here because we didn't set up
      // the 3rd argument, a callback function with argument 'err'.
      // So we test each argument seperately
      expect(spy.calls[0].arguments[0]).toEqual({email});
      expect(spy.calls[0].arguments[1]).toBe(password);
    });

    it('should set loginWithPassword callback errors', function() {
      const spy = expect.createSpy();
      const wrapper = mount(<Login loginWithPassword={spy}/>);

      // it is ok we simulate 'submit' without set up any input data
      wrapper.find('form').simulate('submit');

      // grab the 3rd arguments and calling it
      // set {} means calling it with something, e.g. 'err' in original code
      spy.calls[0].arguments[2]({});
      expect(wrapper.state('error').length).toNotBe(0);

      spy.calls[0].arguments[2]();
      expect(wrapper.state('error').length).toBe(0);
    });
  });
}
