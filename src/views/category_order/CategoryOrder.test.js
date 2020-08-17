import React from 'react';
import Categories from './CategoryOrder';
import { mount } from 'enzyme'

it('renders without crashing', () => {
  mount(<Categories />);
});
