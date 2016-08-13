httpProxy       = require('http-proxy');
fs              = require('fs');
HttpsProxyAgent = require('https-proxy-agent');
PokemonGoMITM   = require('pokemon-go-mitm');

var ssl = {
  key: `-----BEGIN RSA PRIVATE KEY-----
MIICXAIBAAKBgQCfQ1vYEL9mFzbbQmdSDHkHTw+ugBTs6MHI5EtuugNWhOEWq4MG
+o+IVtS5INZ9ymCPW2qKlmmBQOguOxCKzR4vbqdFH3YCp9JDYXfB8xuqHoOFCOIZ
atMw1kU7XLumV/EOPqLupDM4xWVvjyciuiZVV+4fweP2oKmD9Eoj9NjVbQIDAQAB
AoGAWJDf2Vbu6ToNon7Z8DHJeDwKL3NAr8J8SVhTbn747js05SN52P6rpRkMcOsG
/Kr3aaFfrTQZ9ev/cf4co+OPXdXDXN+aQ758j9DLUSp8lvp4gAryHdS35ZRX+FRI
A3Y6MBRfiMG5InRPE4ErrBNE/FFcWiFS53O569Aq8qB68cECQQDc2bvQXxzQBmax
CP1q5i7A7ftlONtXtjBFNYSJ/c04szZnwD2+sQj+jLAbd1pFm3raNOFXeDKHDuJS
nDemDZhdAkEAuJxTqF/Hg4uA4ua28s+nlT+K8yAt4LkWMyLF+QroBNNhhLfZVy0f
DktAg6w0uI7f0CYcFx6nrq9OnGYYHYAgUQJBAJOtaMBCCXM1BJAW8dX8i4Do4bTi
2xEAu7Bbw/+93e+vLo8b5m3P1bLZAp2rJorrF7A3sgMaVbcoBcC1wyRfbOUCQE6s
SDaUArl7hQStX7/gYMGI39U2nHaNSfmm0wmL7U7JKmDd3KB7GSYFScwTYjBYqubQ
pt3vcXRPP0gFdjd0N9ECQEU84uTBsd9KZIQouWAjWOLOAFGYWNaDc3ItpWlAu8/s
ddiosz+xGdmXtprlfKwNTpJAtPO8uETC4WPDv/W26oY=
-----END RSA PRIVATE KEY-----`,
  cert: `-----BEGIN CERTIFICATE-----
MIIDwDCCAqigAwIBAgIQuxQcaR0dJBij7l3fjEYE0zANBgkqhkiG9w0BAQsFADB9
MRgwFgYDVQQDEw9Ob2RlTUlUTVByb3h5Q0ExETAPBgNVBAYTCEludGVybmV0MREw
DwYDVQQIEwhJbnRlcm5ldDERMA8GA1UEBxMISW50ZXJuZXQxGzAZBgNVBAoTEk5v
ZGUgTUlUTSBQcm94eSBDQTELMAkGA1UECxMCQ0EwHhcNMTYwODEyMjMwOTQwWhcN
MTgwODEyMjMwOTQwWjCBqDEjMCEGA1UEAxMacGdvcmVsZWFzZS5uaWFudGljbGFi
cy5jb20xETAPBgNVBAYTCEludGVybmV0MREwDwYDVQQIEwhJbnRlcm5ldDERMA8G
A1UEBxMISW50ZXJuZXQxGzAZBgNVBAoTEk5vZGUgTUlUTSBQcm94eSBDQTErMCkG
A1UECxMiTm9kZSBNSVRNIFByb3h5IFNlcnZlciBDZXJ0aWZpY2F0ZTCBnzANBgkq
hkiG9w0BAQEFAAOBjQAwgYkCgYEAn0Nb2BC/Zhc220JnUgx5B08ProAU7OjByORL
broDVoThFquDBvqPiFbUuSDWfcpgj1tqipZpgUDoLjsQis0eL26nRR92AqfSQ2F3
wfMbqh6DhQjiGWrTMNZFO1y7plfxDj6i7qQzOMVlb48nIromVVfuH8Hj9qCpg/RK
I/TY1W0CAwEAAaOBkzCBkDAJBgNVHRMEAjAAMAsGA1UdDwQEAwIEsDAdBgNVHSUE
FjAUBggrBgEFBQcDAQYIKwYBBQUHAwIwEQYJYIZIAYb4QgEBBAQDAgbAMB0GA1Ud
DgQWBBROFf8JgsE8IrjMNJTryRjY9MyKpTAlBgNVHREEHjAcghpwZ29yZWxlYXNl
Lm5pYW50aWNsYWJzLmNvbTANBgkqhkiG9w0BAQsFAAOCAQEAF2Pdf0PvScHBa1X3
cVR1zQlzMAyfcrf3daKIN815cRSqN2soySVIcK4sYx5zyte7Toii4C2yw1B1ukd5
r0mMjo+MJsAdJOKZY4WrXDvORhD7H5GT3TqjJeF9xmVzCXU35kl1yU3eYP8cvNAO
HKqxyRZpaw5FkKMoYFbYNJksslBVQRYjFX+Au2Yyp9oWMiMyi1vtfqDwsnz/U6gE
z781+vITwYtmV8rJJPiknfsMcR19/n7fOOjiOY6DVVjG8h31FYDcbj0nZwlmejfj
t97sbeJ305wmwBKfwNW6dvY4ylVbKB6PPhRqLHXFRxhmTj9qLwaYfomkKSalSx8b
hNVrJA==
-----END CERTIFICATE-----`
};

module.exports = function(options) {
  if (typeof options !== 'Object') options = {};
  if (typeof options.proxyPort !== 'Number') options.proxyPort = 8081
  if (typeof options.sslPort !== 'Number') options.sslPort = 443

  agent = new HttpsProxyAgent('http://127.0.0.1:' + options.proxyPort);

  var proxy = new PokemonGoMITM({port: options.proxyPort});

  proxy.httpsListener = httpProxy.createServer({
    ssl: ssl,
    agent: agent,
    secure: false,
    target: 'https://pgorelease.nianticlabs.com'
  }).listen(options.sslPort);

  console.log('')
  console.log('[+++] Fake https://pgorelease.nianticlabs.com listening on port 443')
  console.log('[-] if you add "ip-of-this-host pgorelease.nianticlabs.com to /etc/hosts on your rooted phone')
  console.log('[-] and you are using "Pokemon Go Trust Certificate" xposed module or cert pinned pokemon go apk')
  console.log('[-] you can use this mitm without setting proxy on phone or adding trusted CA to phone')

  return proxy;
}
