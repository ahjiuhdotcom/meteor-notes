// enzyme is build on top of 'react-addons-test-utils'
// so 'react-addons-test-utils' must be installed as well

import { Meteor } from 'meteor/meteor';
import React from 'react';
import expect from 'expect';
// 'mount' allow us to mount a component to the DOM,
// then we can assert stuff about them
import { mount } from 'enzyme';

import { Signup } from './Signup';

if (Meteor.isClient) {
  describe('Signup', function() {
    it('should show error messages', function() {
      const error = 'This is not working';
      const wrapper = mount(<Signup createUser={() => {}}/>);

      wrapper.setState({error});
      expect(wrapper.find('p').text()).toBe(error);

      wrapper.setState({error: ''});
      expect(wrapper.find('p').length).toBe(0);
    });

    it('should call createUser witht the form data', function() {
      const email = 'andrew@test.com';
      const password = 'password123';
      const spy = expect.createSpy();
      const wrapper = mount(<Signup createUser={spy}/>);

      // 'node' convert enzyme wrapper to regular dom element (htmlinputelement in this case),
      // so that we can use vanilar js to manipulate the element
      wrapper.ref('email').node.value = email;
      wrapper.ref('password').node.value = password;
      wrapper.find('form').simulate('submit');

      // we don't use 'toHaveBeenCalledWith' here because we didn't set up
      // the 2nd argument, a callback function with argument 'err'.
      // So we test each argument seperately
      expect(spy.calls[0].arguments[0]).toEqual({email, password});
    });

    it('should set error if short passwrod', function() {
      const email = 'andrew@test.com';
      const password = '123                ';
      const spy = expect.createSpy();
      const wrapper = mount(<Signup createUser={spy}/>);

      // 'node' convert enzyme wrapper to regular dom element (htmlinputelement in this case),
      // so that we can use vanilar js to manipulate the element
      wrapper.ref('email').node.value = email;
      wrapper.ref('password').node.value = password;
      wrapper.find('form').simulate('submit');

      expect(wrapper.state('error').length).toBeGreaterThan(0);
    });

    it('should set createUser callback errors', function() {
      const password = 'password123';
      const reason = 'This is why it failed';
      const spy = expect.createSpy();
      const wrapper = mount(<Signup createUser={spy}/>);

      wrapper.ref('password').node.value = password;
      // it is ok we simulate 'submit' without set up complete input data
      wrapper.find('form').simulate('submit');

      // grab the 2nd arguments and calling it
      // set {} means calling it with 'err' in original code
      spy.calls[0].arguments[1]({reason});
      expect(wrapper.state('error')).toBe(reason);

      spy.calls[0].arguments[1]();
      expect(wrapper.state('error').length).toBe(0);
    });
  });
}
