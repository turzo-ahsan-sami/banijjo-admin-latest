import React from 'react';
import Products from './ProductSpecifications';
import { mount } from 'enzyme'

it('renders without crashing', () => {
  mount(<ProductSpecifications />);
});
