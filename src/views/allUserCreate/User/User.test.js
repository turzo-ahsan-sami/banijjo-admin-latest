import React from 'react';
import Categories from './User';
import { mount } from 'enzyme'

it('renders without crashing', () => {
  mount(<User />);
});
