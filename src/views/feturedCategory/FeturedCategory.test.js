import React from 'react';
import Categories from './FeturedCategory';
import { mount } from 'enzyme'

it('renders without crashing', () => {
  mount(<Categories />);
});
