import React, {useContext} from 'react';
import {Event, SocketContext} from './socket.io';

/**
 * Welcome - the welcome component.
 * @return {JSX.Element}
 */
const Welcome = () => {
  const socketContext = useContext(SocketContext);

  const fire = () => {
    socketContext.emit('my_message', 'hello');
  };

  const onMessage = (message) => {
    console.log(message);
  };

  return (
    <div>
      Welcome!
      <button onClick={fire}>Click me</button>
      <Event event='eventName' handler={onMessage} />
    </div>
  );
};

export default Welcome;
