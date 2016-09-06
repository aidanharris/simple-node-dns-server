const dns = require('native-dns');

const DNS_SERVER = '192.168.0.1';

module.exports = (name, callback, end) => {
  var question = dns.Question({
    name: name,
    type: 'A'
  });

  var start = Date.now();

  var req = dns.Request({
    question: question,
    server: { address: DNS_SERVER, port: 53, type: 'udp' },
    timeout: 1000
  });

  req.on('timeout', () => {
    console.log('Timeout in making request');
    callback(undefined);
  });

  req.on('message', (err, answer) => {
    answer.answer.forEach((a) => {
      callback(err, a);
    });
  });

  req.on('end', () => {
    end();
    var delta = (Date.now()) - start;
    console.log('Finished processing request: ' + delta.toString() + 'ms');
  });

  req.send();
};
