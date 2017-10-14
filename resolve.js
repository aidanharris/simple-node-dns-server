/* eslint new-cap: "off" */

const dns = require('native-dns');

const DNS_SERVER = '192.168.0.1';

module.exports = (name, callback, end) => {
  const question = dns.Question({
    name,
    type: 'A'
  });

  const start = Date.now();

  const req = dns.Request({
    question,
    server: {address: DNS_SERVER, port: 53, type: 'udp'},
    timeout: 1000
  });

  req.on('timeout', () => {
    console.log('Timeout in making request');
    callback(undefined);
  });

  req.on('message', (err, answer) => {
    answer.answer.forEach(a => {
      callback(err, a);
    });
  });

  req.on('end', () => {
    end();
    const delta = (Date.now()) - start;
    console.log('Finished processing request: ' + delta.toString() + 'ms');
  });

  req.send();
};
