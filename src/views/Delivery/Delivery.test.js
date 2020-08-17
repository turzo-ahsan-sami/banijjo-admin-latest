import React from 'react';
import Delivery from './Delivery';
import { mount } from 'enzyme'

it('renders without crashing', () => {
  mount(<Delivery />);
});
