# Label Coach

[![Build Status](https://travis-ci.org/chaitanya2334/label-coach.svg?branch=master)](https://travis-ci.org/chaitanya2334/label-coach)

## Installation Instructions

Requirements
1. Node 8+
2. mongodb
3. python 3.6

### Step 1: Install girder

Pull girder submodule
```bash
cd label-coach
git submodule update --init --recursive
```
Install all girder python dependencies
```bash
cd label-coach/girder
pip install -r requirements-dev.txt
```

### Step 2: Install `label_coach` plugin
Install all python dependencies. 

Use environment.yml in the root directory `label-coach` for conda environments
```bash
conda env create -f environment.yml
# then activate the conda virtual environment
source activate label-coach
```

or use requirement.txt for pip.
```bash
pip install -r requirements.txt
```
Install all the npm dependencies inside `label_coach` dir
```bash
cd label-coach/label_coach
npm install
```

Install plugin into girder. Make sure to provide absolute path to `label_coach` dir.
```bash
girder-install plugin -s /absolute/path/to/label_coach
```

### Step 3: Start up girder and activate plugin

Install girder web client
```bash
girder-install web
```

Start girder server. Start mongodb if you havent already. Below command will start the server on localhost:8080. check girder documentation 
for more options
```bash
sudo service mongod start
girder serve
```

Register admin account 

[Image here]

Enable plugin and restart

[Image here]

Change `core_girder` route from `/` to `/girder`. This setting is found in your `Admin console > Server configuration`.

Restart the server. You are now all set!

## Development Instructions

Step 1: Follow the installation instructions above 

Step 2: start webpack watch and server on two seperate terminals
```bash
girder-install web --watch-plugin label_coach 
```

```bash
girder serve
```

