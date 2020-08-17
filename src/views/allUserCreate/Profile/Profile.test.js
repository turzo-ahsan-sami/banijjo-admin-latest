import React from 'react';
import Categories from './Profile';
import { mount } from 'enzyme'

it('renders without crashing', () => {
  mount(<Profile />);
});
