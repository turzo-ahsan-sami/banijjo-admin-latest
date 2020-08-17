import React from 'react';
import VatTax from './VatTax';
import { mount } from 'enzyme'

it('renders without crashing', () => {
  mount(<VatTax />);
});
