import React from 'react';
import Products from './ProductSpecificationDetails';
import { mount } from 'enzyme'

it('renders without crashing', () => {
  mount(<ProductSpecifications />);
});
