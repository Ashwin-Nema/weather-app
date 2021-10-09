import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {UserisonlineContext} from './utils'
import {Detector} from 'react-detect-offline'

ReactDOM.render(
  <Detector render={({online})=> (
    <UserisonlineContext.Provider value={online}>
      <App />
    </UserisonlineContext.Provider>
  ) } />
   ,
  document.getElementById('root')
);
