import React from 'react';
import BannerProducts from './BannerProducts';
import { mount } from 'enzyme'

it('renders without crashing', () => {
  mount(<BannerProducts />);
});
