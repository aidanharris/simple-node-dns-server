var dns = require('native-dns');
var server = dns.createServer();
var resolve = require('./resolve');

const hosts = {
  'vvv.dev': '192.168.0.122',
  'wordpress.dev': '192.168.0.122',
  'local.wordpress.dev': '192.168.0.122',
  'local.wordpress-trunk.dev': '192.168.0.122',
  'src.wordpress-develop.dev': '192.168.0.122',
  'build.wordpress-develop.dev': '192.168.0.122'
};

server.on('request', (request, response) => {
  request.question.map((e) => {
    if (e.name in hosts) {
      response.answer.push(dns.A({
        name: e.name,
        address: hosts[e.name],
        ttl: 60
      }));
      response.send();
    } else {
      resolve(e.name, (err, res) => {
        if (err) { console.trace(err); return; }
        if (!res || typeof (res.address) !== 'string' || res.address.length === 0) { return; }
        console.log(res);
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

server.on('error', (err, buff, req, res) => {
  console.log(err.stack);
});

server.on('listening', () => {
  console.log('Listening on 0.0.0.0:53');
});

server.serve(53);
