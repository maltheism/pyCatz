import React, {useEffect, useState} from 'react';

// Electron imports
const electron = window.require('electron');
const {ipcRenderer} = electron;
const loadBalancer = window.require('electron-load-balancer');

/**
 * Home - the home component.
 * @return {JSX.Element}
 */
const Home = () => {
  const [single, setSingle] = useState(undefined);
  const [thread, setThread] = useState({});

  useEffect(() => {
    // Anything in here is fired on component mount.

    // 1. Setup listener for oneshot python output (bounced from main process)
    ipcRenderer.on('FIRE_ONCE_RESULT', (event, args) => {
      console.log(args);
      setSingle(args.data.result);
      setThread(args.data.result);

      // 2. Kill one-shot background task as soon as we get result
      loadBalancer.stop(ipcRenderer, 'fire_once');
    });

    // 3. Setup listener for preemptive loop python output (bounced from main process)
    ipcRenderer.on('PREEMPTIVE_LOOP_RESULT', (event, args) => {
      console.log(args);
      setThread((prevState) => {
        return {
          ...prevState,
          [args.data.threadID]: thread[args.data.threadID] ?
            [...thread[args.data.threadID], args.data.result] :
            [args.data.result],
        };
      });
    });

    return () => {
      // Anything in here is fired on component unmount.

      // 4. Remove all output listeners before app shuts down
      ipcRenderer.removeAllListeners('FIRE_ONCE_RESULT');
      ipcRenderer.removeAllListeners('PREEMPTIVE_LOOP_RESULT');
    };
  }, []);

  const startOneShot = () => {
    // 5. Start oneshot background task only when user clicks start
    console.log('Fire Once Started');
    loadBalancer.start(ipcRenderer, 'fire_once');
  };

  const startPreemptiveLoop = () => {
    // 6. Sending data to preemptive loop (process already running)
    console.log('Preemptive Loop data sent');
    loadBalancer.sendData(ipcRenderer, 'preemptive_loop',
        {
          command: 'PREEMPTIVE_LOOP',
          val_list: [...Array(15).keys()],
        },
    );
  };

  return (
    <div style={{
      padding: '16px',
    }}>
      <div>
        <button onClick={startOneShot}>
          <span>Read Raw FIF</span>
        </button>
      </div>
      {
        single ? <div style={{
          margin: '8px 0px 0px 0px',
        }}>{single}</div> : null
      }
      <div style={{
        margin: '16px 0px 0px 0px',
      }}>
        <button onClick={startPreemptiveLoop}>
          <span>Start Calculation Thead - x! for x ∈ [0, 100]</span>
        </button>
      </div>
      {
        Object.keys(thread).map((key) => {
          return (
            <div style={{
              margin: '8px 0px 0px 0px',
            }} key={key}>
              {
                `${key} : ${thread[key]}`
              }
            </div>
          );
        })
      }
    </div>
  );
};

export default Home;
