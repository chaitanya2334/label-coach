# Label Coach

[![Build Status](https://travis-ci.org/chaitanya2334/label-coach.svg?branch=master)](https://travis-ci.org/chaitanya2334/label-coach)

## Installation Instructions

Requirements
1. Node 8+
2. mongodb

Step1: install girder

Step1.1: pull girder submodule
```bash
cd label-coach
git submodule update --init --recursive
```
Step1.2: install all girder python dependencies
```bash
cd label-coach/girder
pip install -r requirements-dev.txt
```



Step2: install all the npm dependencies inside `label_coach` dir

```bash
cd label-coach/label_coach
npm install
```

Step3: install plugin into girder. Make sure to provide absolute path to `label_coach` dir.
```bash
girder-install plugin -s /absolute/path/to/label_coach
```

Step4: install girder web client
```bash
girder-install web
```

Step5: start girder server. Start mongodb if you havent already. Below command will start the server on localhost:8080. check girder documentation 
for more options
```bash
sudo service mongod start
girder serve
```

Step 4: register admin account 

[Image here]

Step 7: enable plugin and restart

[Image here]

Step 8: change `core_girder` route from `/` to `/girder`. This setting is found in your `Admin console > Server configuration`.

Step 9: restart the server. You are now all set!

## Development Instructions

Step 1: Follow the installation instructions above 

Step 2: start webpack watch and server on two seperate terminals
```bash
girder-install web --watch-plugin label_coach 
```

```bash
girder serve
```

