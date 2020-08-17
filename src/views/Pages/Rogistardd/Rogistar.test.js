import React from 'react';
import ReactDOM from 'react-dom';
import Rogistar from './Rogistar';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Rogistar />, div);
  ReactDOM.unmountComponentAtNode(div);
});
