import React from 'react';
import VendorPayment from './VendorPayment';
import { mount } from 'enzyme'

it('renders without crashing', () => {
  mount(<VendorPayment />);
});
