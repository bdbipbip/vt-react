import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

/// BASIC FILE, CREATE REACT APP GENERATE AUTO ///


it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
