import eventlet
import socketio
from scripts.libs import iEEG


sio = socketio.Server(cors_allowed_origins=[])
app = socketio.WSGIApp(sio)


@sio.event
def connect(sid, environ):
    print('connect ', sid)


@sio.event
def my_message(sid, data):
    print('message ', data)
    sio.emit('response', 'hello you!')


@sio.event
def ieeg_to_bids(sid, data):
    print('message ', data)
    iEEG.Converter(data)
    sio.emit('response', 'success')


@sio.event
def disconnect(sid):
    print('disconnect ', sid)


if __name__ == '__main__':
    eventlet.wsgi.server(eventlet.listen(('', 5000)), app)
