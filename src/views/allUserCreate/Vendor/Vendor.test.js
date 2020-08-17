import React from 'react';
import Categories from './Vendor';
import { mount } from 'enzyme'

it('renders without crashing', () => {
  mount(<Vendor />);
});
