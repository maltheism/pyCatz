import React, {useContext, useState} from 'react';

// Socket.io
import {Event, SocketContext} from './socket.io';

// Electron imports
const electron = window.require('electron');

// Components
import FileInput from './elements/inputs';

/**
 * Welcome - the welcome component.
 * @param {object} props
 * @return {JSX.Element}
 */
const Welcome = (props) => {
  const socketContext = useContext(SocketContext);

  const [edfFile, setEdfFile] = useState({});
  const [bidsDirectory, setBidsDirectory] = useState('No directory chosen');

  const {dialog} = electron.remote;

  const fireBidsConverter = () => {
    socketContext.emit('ieeg_to_bids', {
      file_path: edfFile.path,
      bids_directory: bidsDirectory,
      read_only: false,
    });
    // socketContext.emit('my_message', 'hello');
  };

  const fireModifyBidsTsv = () => {
    socketContext.emit('modify_bids_tsv', {
      file_path: edfFile.path,
      bids_directory: bidsDirectory,
      read_only: false,
    });
    // socketContext.emit('my_message', 'hello');
  };

  const onMessage = (message) => {
    console.log(message);
  };

  const onUserInput = async (name, value) => {
    console.log(name);
    console.log(value);
    if (name === 'edfFile') {
      setEdfFile(value);
      console.log(edfFile);
    } else if (name === 'bidsDirectory') {
      console.log('yay');
      const path = await dialog.showOpenDialog({
        properties: ['openDirectory'],
      });
      // console.log(path.filePaths[0]);
      await setBidsDirectory(path.filePaths[0]);
      console.log(bidsDirectory);
    }
  };

  return (
    <>
      <div style={{
        fontSize: '20px',
        textAlign: 'center',
        verticalAlign: 'middle',
        cursor: 'default',
        padding: '20px',
      }}>
        iEEG to BIDS Converter
      </div>
      <div style={{backgroundColor: '#039b83'}}>
        <div style={{
          padding: '20px',
        }}>
          <FileInput id='edfFile'
            name='edfFile'
            accept='.edf'
            label='1. The file.edf to convert: '
            onUserInput={onUserInput}
          />
        </div>
        <div style={{
          padding: '20px',
        }}>
          <b style={{cursor: 'default'}}>
            2. The BIDS output directory:
          </b>
          <input id='bidsDirectory'
            name='bidsDirectory'
            value='Choose directory'
            type='button'
            onClick={() => onUserInput('bidsDirectory', null)}
          />
          <a style={{fontSize: '14px', cursor: 'default'}}>
            {bidsDirectory}
          </a>
        </div>
        <div style={{
          padding: '20px',
        }}>
          <b style={{cursor: 'default'}}>
            3. Convert file.edf to BIDS format:
          </b>
          <button onClick={fireBidsConverter}>
            Start Task
          </button>
        </div>
      </div>
      <div style={{marginTop: '20px',
        fontSize: '20px',
        textAlign: 'center',
        verticalAlign: 'middle',
        cursor: 'default',
      }}>
        Finalize participants.tsv for LORIS
      </div>
      <div style={{marginTop: '20px',
        backgroundColor: '#039b83',
        padding: '20px',
        cursor: 'default',
      }}>
        <b>4. The SiteID from LORIS:</b>
        <input type={'text'}/>
      </div>
      <div style={{
        padding: '20px',
        backgroundColor: '#039b83',
      }}>
        <b style={{cursor: 'default'}}>
          5. Modify participants.tsv data:
        </b>
        <button onClick={fireModifyBidsTsv}>
          Start Task
        </button>
      </div>
      <Event event='response' handler={onMessage} />
    </>
  );
};

export default Welcome;
