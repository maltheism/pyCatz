import socketio
from flask import Flask
from gevent import pywsgi

sio = socketio.Server(async_mode='threading')
app = Flask(__name__)
app.wsgi_app = socketio.WSGIApp(sio, app.wsgi_app)

# ... Socket.IO and Flask handler functions ...


@sio.event
def my_event(sid, data):
    print('test')
    pass


@sio.on('my custom event')
def another_event(sid, data):
    pass


@sio.event
def connect(sid, environ, auth):
    print('connect ', sid)


@sio.event
def disconnect(sid):
    print('disconnect ', sid)


@sio.event
def connect(sid, environ):
    # username = authenticate_user(environ)
    # sio.save_session(sid, {'username': username})
    raise ConnectionRefusedError('authentication failed')


if __name__ == '__main__':
    app.run(threaded=True)
