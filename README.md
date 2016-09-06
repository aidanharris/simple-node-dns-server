# Simple Node DNS Server

I needed a simple to use DNS server that didn't require me to setup [BIND](https://en.wikipedia.org/wiki/BIND) just to test a website on my iPhone or iPad.

The result is these two simple files server.js and resolve.js

## Server.js

Server.js is the entrypoint to the DNS server. It binds to port 53 on all interfaces by default. Hosts are specified at the top of the file in a JSON object as follows:

```JS
const hosts = {
  'vvv.dev': '192.168.0.122',
  'wordpress.dev': '192.168.0.122',
  'local.wordpress.dev': '192.168.0.122',
  'local.wordpress-trunk.dev': '192.168.0.122',
  'src.wordpress-develop.dev': '192.168.0.122',
  'build.wordpress-develop.dev': '192.168.0.122'
};
```

I may extend this at some point in the future to handle multiple IP addresses.

### Limitations

* Only one IP address is returned for each record (see above)
* Currently only A name records are supported

## Resolve.js

Resolve.js is used to look up a record that is not defined in the hosts JSON object in Server.js. It does this by asking your router to fulfill the request. The dns server can be changed by editing the `DNS_SERVER` declaration at the top of the file.

## Usage:

```bash
git clone https://github.com/aidanharris/simple-node-dns-server
cd simple-node-dns-server
npm install
sudo node server.js
```

You can test the DNS server using `dig` as follows:

```
dig example.com @127.0.0.1 # Host not in server.js's hosts - Should forward to router or another DNS server

; <<>> DiG 9.10.4-P2 <<>> example.com @127.0.0.1
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 55264
;; flags: qr rd; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 0
;; WARNING: recursion requested but not available

;; QUESTION SECTION:
;example.com.			IN	A

;; ANSWER SECTION:
example.com.		600	IN	A	93.184.216.34

;; Query time: 39 msec
;; SERVER: 127.0.0.1#53(127.0.0.1)
;; WHEN: Tue Sep 06 15:35:24 BST 2016
;; MSG SIZE  rcvd: 45

dig vvv.dev @127.0.0.1 # Host in server.js's hosts - Should return the value of the IP address stored in hosts immediately


; <<>> DiG 9.10.4-P2 <<>> vvv.dev @127.0.0.1
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 28706
;; flags: qr rd; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 0
;; WARNING: recursion requested but not available

;; QUESTION SECTION:
;vvv.dev.			IN	A

;; ANSWER SECTION:
vvv.dev.		60	IN	A	192.168.0.122

;; Query time: 0 msec
;; SERVER: 127.0.0.1#53(127.0.0.1)
;; WHEN: Tue Sep 06 15:36:09 BST 2016
;; MSG SIZE  rcvd: 41
```

# To Do:

* Fix limitations mentioned above
* Add a configuration file of some sort
