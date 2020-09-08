import React from 'react';
import SizeInfos from './SizeInfos';
import { mount } from 'enzyme'

it('renders without crashing', () => {
  mount(<SizeInfos />);
});
