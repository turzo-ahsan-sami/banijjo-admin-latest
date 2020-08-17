import React from 'react';
import Categories from './Feature';
import { mount } from 'enzyme'

it('renders without crashing', () => {
  mount(<Categories />);
});
