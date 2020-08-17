import React from 'react';
import Categories from './CategoryTopNavbar';
import { mount } from 'enzyme'

it('renders without crashing', () => {
  mount(<CategoryTopNavbar />);
});
