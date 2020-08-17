import React from 'react';
import ColorInfos from './ColorInfos';
import { mount } from 'enzyme'

it('renders without crashing', () => {
  mount(<ColorInfos />);
});
