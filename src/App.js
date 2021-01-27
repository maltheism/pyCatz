import React, {useEffect} from 'react';
import './App.css';

// Socket.io
import {Socket} from './jsx/socket.io';

const uri = 'http://127.0.0.1:5000';
const options = {
  // transports: ['websocket', 'polling'],
  transports: ['websocket'],
};

// import Home from './jsx/Home';
import Welcome from './jsx/Welcome';

// Electron related imports
const electron = window.require('electron');
const {ipcRenderer} = electron;
const loadBalancer = window.require('electron-load-balancer');

/**
 * App - the starting point.
 * @return {JSX.Element}
 */
const App = () => {
  useEffect(() => {
    // Anything in here is fired on component mount.
    console.log('preemptive loop started');
    //  1) Starting preemptive loop as soon as app starts
    loadBalancer.start(ipcRenderer, 'preemptive_loop');
    return () => {
      // Anything in here is fired on component unmount.
      //  2) Shutdown preemptive loop before app stops
      loadBalancer.stop(ipcRenderer, 'preemptive_loop');
    };
  }, []);

  return (
    <Socket uri={uri} options={options}>
      <Welcome
        electron={electron}
      />
    </Socket>
  );
};

export default App;
