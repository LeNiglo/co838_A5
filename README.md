# MediTemp

## Installation

### Server

```
cd server && npm install;
```

### Web Interface

```
cd server/public && bower install;
```

### Simulator

```
cd simulator && npm install;
```

## Usage

First, you may need a SSH tunnel to connect to the University's broker.

```
ssh -L 1883:doughnut.kent.ac.uk:1883 login@raptor.kent.ac.uk
```

Then, you can run the Server in a new Terminal with:

```
cd server && npm start
```

> You can provide optional environment variables to enable the mailing alert system
>
> cd server && MAILER_HOST=”” MAILER_PORT=”” MAILER_USERNAME=”” MAILER_PASSWORD=”” npm start

If you can't make your MBED device to work nicely with the network, use the simulator in another Terminal window:

```
cd simulator && PRIVATE_ID=”XXXX-XX-XXXX” npm start
```

## Requirements

 - NodeJS (>= 4.x)
 - Bower
