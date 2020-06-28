"use strict";

const io = {
  on: function (ws, plugin, event) {
    switch (event) {
      case "connect":
      case "connection":
        if (!plugin.initialized) {
          plugin.initialized = true;
          plugin.initialize.call({ socket: ws }, this);
        }
    }
  },
  emit: function (event, data) {
    this.io.broadcast(this.socket, { id: this.socket.id, event, data });
  },
  ws: {
    on: function (event, callback) {
      callback({ id: this.socket.id, event });
    },
    emit: function (event, data) {
      this.socket.send(JSON.stringify({ id: this.socket.id, event, data }));
    },
  },
};

/**
 * @param {function[]} all
 * @param {any[]} entry
 */
function shim(plugin) {
  return function (ws, { data }) {
    const context = { socket: ws, io: this };

    // context = broadcaster instance
    this.on = this.on || io.on.bind(this, ws, plugin);
    this.emit = this.emit || io.emit.bind(context);

    ws.on = ws.on || io.ws.on.bind(context);
    ws.emit = ws.emit || io.ws.emit.bind(context);

    if (!ws.handshaken) {
      ws.handshaken = true;
      plugin.handshake.call(context, ws, data);
    }
  };
}

module.exports = shim;
