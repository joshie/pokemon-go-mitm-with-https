This allows you to use https://github.com/rastapasta/pokemon-go-mitm without proxying

Instead you add the ip of the machine you are running this on to /etc/hosts on your phone as pgorelease.nianticlabs.com

Contents of your /etc/hosts on phone looks like this
```
127.0.0.1       localhost
::1             ip6-localhost
```

Add a line for pgorelease.nianticlabs.con with the ip of where you are running this at (replace 1.2.3.4 with your ip)
```
127.0.0.1       localhost
::1             ip6-localhost
1.2.3.4         pgorelease.nianticlabs.com
```

As long as you are using the "Pokemon Go Trust Certificate" xposed module
(instructions are here: https://github.com/rastapasta/pokemon-go-xposed)

or using a cert-pinned pokemon go apk, you will be good to go :)

No need to install a trusted CA to your phone
