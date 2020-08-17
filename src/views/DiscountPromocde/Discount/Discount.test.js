import React from 'react';
import Discount from './Discount';
import { mount } from 'enzyme'

it('renders without crashing', () => {
  mount(<Discount />);
});
