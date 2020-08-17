import React from 'react';
import Products from './Products';
import { mount } from 'enzyme'

it('renders without crashing', () => {
  mount(<Products />);
});
