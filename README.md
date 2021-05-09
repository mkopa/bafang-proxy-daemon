# bafang-proxy-daemon
Bafang Proxy Daemon

```bash
$ npm i
$ npm start 
```

[Set the appropriate serial ports in package.json in the "scripts" "start" section](https://github.com/mkopa/bafang-proxy-daemon/blob/2ca67dd33f93a5b17b8d5cc61389778e138b3d0c/package.json#L7)

Allow the default user to use the serial device
```bash
$ sudo vim /etc/udev/rules.d/50-myusb.rules

# add this rules and save
KERNEL=="ttyUSB[0-9]*",MODE="0666"
KERNEL=="ttyACM[0-9]*",MODE="0666" 
```
