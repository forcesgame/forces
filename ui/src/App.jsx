import 'babel-polyfill';
import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';

import Parent from './Parent.jsx';

const element = <Parent />;
ReactDOM.render(element, document.getElementById('content'));

if (module.hot) {
  module.hot.accept();
}
