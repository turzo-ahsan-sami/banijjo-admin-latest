import React from 'react';
import Categories from './Advertisement';
import { mount } from 'enzyme'

it('renders without crashing', () => {
  mount(<Advertisement />);
});
