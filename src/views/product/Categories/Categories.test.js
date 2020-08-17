import React from 'react';
import Categories from './Categories';
import { mount } from 'enzyme'

it('renders without crashing', () => {
  mount(<Categories />);
});
