/* eslint new-cap: "off" */

const {uid} = require('os').userInfo();

class PrivilegeError extends Error {
  constructor() {
    super('Please run me as root');

    this.name = 'PrivilegeError';
  }
}

if (Boolean(uid) === true) {
  throw new PrivilegeError();
}

const dns = require('native-dns');

const server = dns.createServer();
const resolve = require('./resolve');

const hosts = {
  'vvv.dev': '192.168.0.122',
  'wordpress.dev': '192.168.0.122',
  'local.wordpress.dev': '192.168.0.122',
  'local.wordpress-trunk.dev': '192.168.0.122',
  'src.wordpress-develop.dev': '192.168.0.122',
  'build.wordpress-develop.dev': '192.168.0.122'
};

server.on('request', (request, response) => {
  request.question.forEach(e => {
    if (e.name in hosts) {
      response.answer.push(dns.A({
        name: e.name,
        address: hosts[e.name],
        ttl: 60
      }));
      response.send();
    } else {
      resolve(e.name, (err, res) => {
        if (err) {
          console.trace(err);
          return;
        }
        if (!res || typeof (res.address) !== 'string' || res.address.length === 0) {
          return;
        }
        response.answer.push(dns.A({
          name: e.name,
          address: res.address,
          ttl: 600
        }));
      }, () => {
        response.send();
      });
    }
  });
});

// eslint-disable-next-line no-unused-vars
server.on('error', (err, buff, req, res) => {
  console.log(err.stack);
});

server.on('listening', () => {
  process.setuid('nobody');
  const {address, port} = server.address();
  console.log(`Listening on ${address}:${port}`);
});

server.serve(53);
