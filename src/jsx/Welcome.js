import React, {useContext, useState} from 'react';
import {Event, SocketContext} from './socket.io';
import FileInput from './elements/inputs';

/**
 * Welcome - the welcome component.
 * @param {object} props
 * @return {JSX.Element}
 */
const Welcome = (props) => {
  const socketContext = useContext(SocketContext);

  const [edfFile, setEdfFile] = useState({});
  const [bidsDirectory, setBidsDirectory] = useState('');

  const {dialog} = props.electron.remote;

  const fire = () => {
    socketContext.emit('ieeg_to_bids', {
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
    <div style={{padding: '20px'}}>
      Welcome! How are you Rida? <button onClick={fire}>Click me</button>
      <div style={{paddingTop: '20px'}}>
        <FileInput id='edfFile'
          name='edfFile'
          accept='.edf'
          label='Choose file to upload: '
          onUserInput={onUserInput}
        />
        <input id='bidsDirectory'
          name='bidsDirectory'
          value='Select BIDS output directory'
          type='button'
          onClick={() => onUserInput('bidsDirectory', null)}
        />
      </div>
      <Event event='response' handler={onMessage} />
    </div>
  );
};

export default Welcome;
