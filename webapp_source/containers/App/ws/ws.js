/**
 * Created by kascode on 18.02.16.
 */

var socket = new WebSocket("ws://localhost:3061");

socket.onopen = function (event) {
  console.log("Websocket opened");
};

export default socket;