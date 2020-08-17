import React from 'react';
import Products from './Purchase';
import { mount } from 'enzyme'

it('renders without crashing', () => {
  mount(<ProductSpecifications />);
});
