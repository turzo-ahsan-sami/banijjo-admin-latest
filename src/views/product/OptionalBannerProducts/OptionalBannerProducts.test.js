import React from 'react';
import OptionalBannerProducts from './OptionalBannerProducts';
import { mount } from 'enzyme'

it('renders without crashing', () => {
  mount(<OptionalBannerProducts />);
});
