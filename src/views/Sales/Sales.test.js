import React from 'react';
import Products from './Sales';
import { mount } from 'enzyme'

it('renders without crashing', () => {
  mount(<ProductSpecifications />);
});
