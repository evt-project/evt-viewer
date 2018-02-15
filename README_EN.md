EVT 2.0 (evt-viewer)
====================

Short instructions to install and configure the development framework for EVT 2.0 (evt-viewer).

Dev Environment Prerequisites
-----------------------------

EVT has dependencies that require ruby, ruby-compass, bower, grunt, npm, git


Environment setup
-----------------

### Linux [apt baset distribution]

The following commands assume that you are runinng a distribution with the *apt* package manager.

1. Update the package dataase (just to be sure that everything's ok)
```bash
sudo apt-get update
```
2. Install GIT (to do only if you haven't already installed git)
```bash
sudo apt-get install git
```
3. Install ruby
```bash
sudo apt-get install ruby-compass build-essential curl
sudo gem install compass
```
4. Install Nodejs
``` bash
curl -sL https://deb.nodesource.com/setup_5.x
sudo -E bash
sudo apt-get install -y nodejs
```
5. Install grunt and bower globally (bower v. 1.8.0 is recommended)
```bash
sudo npm install -g bower
sudo npm install -g grunt-cli 
```
6. Clone the EVT repository
```bash
git clone https://github.com/evt-project/evt-viewer.git
cd evt-viewer
```
7. Install dependencies
```bash
npm install [ignore any WARN message, they are harmless]
npm install bower
bower install [choose the angular.js version recommended for evt-viewer]
```



### Windows

1. Install GIT (to do only if you haven't already installed git)

Download and install from the (git web site)[https://git-scm.com]

2. Install ruby

 Install the latest Ruby version at (http://rubyinstaller.org/)[http://rubyinstaller.org/]
 *IMPORTANT: in the installer window select the "Add Ruby executables" options*
 Open a shell as administrator, then type:

```bash
gem install compass
gem install susy
```

3. Install Nodejs

Install nodejs from https://nodejs.org/ or https://nodejs.org/en/download/package­manager

4. Install grunt and bower globally (bower v. 1.8.0 is recommended)
```bash
npm install -g bower 
npm install -g grunt-cli
```

5. Clone the EVT repository

```bash
git clone https://github.com/evt-project/evt-viewer.git
cd evt-viewer
```

6. Install dependencies

```bash
npm install [ignore any WARN message, they are harmless]
npm install bower
bower install [choose the angular.js version recommended for evt-viewer]
```

### OS X 

1. Install Homebrew [to do only if you haven't already installed homebrew]

Follow installation instructions at [https://brew.sh](https://brew.sh)

2. Install GIT (to do only if you haven't already installed git)
```bash
brew install git
```
3. Install ruby
```bash
brew install ruby
sudo gem update --system
sudo gem install compass
```

4. Install Nodejs
```bash
brew install node
```

5. Install grunt and bower globally (bower v. 1.8.0 is recommended)
```bash
npm install -g bower
npm install -g grunt-cli 
```

6. Clone the EVT repository
```bash
git clone https://github.com/evt-project/evt-viewer.git
cd evt-viewer
```
7. Install dependencies
```bash
npm install [ignore any WARN message, they are harmless]
npm install bower
bower install [choose the angular.js version recommended for evt-viewer]
```

Start EVT
---------
Before starting EVT check if you have a *data* folder inside *app* where to put you XML file(s); otherwise create it. Then check if in the *app/config/config.json* the property *dataUrl* is pointing to your edition file. If you need, you can also change some of the other configuration parameters. 
If you need information about the configuration file, please check the *README.md* within the *app* folder, or use the beta EVT2-Config-Generator](http://evt.labcd.unipi.it/evt2-config/) to set your preferences and download a ready to use JSON file.

To start EVT use *grunt*
``` bash
grunt dev
```

Generate EVT Development Documentation
--------------------------------------
``` bash
grunt docs
```
This will create a *devDocs* folder. 
Open the *index.html* inside this folder in a browser that allows Cross origin requests (e.g. Firefox) and navigate the documentation.

Troubleshooting
---------------

### IN CASE OF CSS COMPILATION ERRORS
``` bash
sudo gem install rubygems-update
sudo update_rubygems
sudo apt-get install ruby-dev
sudo gem install compass susy
```

### IN CASE OF VISUALIZATION PROBLEMS
```bash
grunt dev --force
```

### EVERY TIME YOU INSTALL A NEW PACKAGE:
Stop *grunt dev* (*CTRL+C*) then:
```bash
bower install
grunt dev
```

### EVERY TIME YOU CHECKOUT TO A DIFFERENT BRANCH:
Stop *grunt dev* (*CTRL+C*) then:
```bash
npm install
bower install
grunt dev
```

Build a new EVT release
-----------------------
``` bash
grunt build
```
This will create a *build* folder containing the built package. 
Add a *data* folder with the XML files you need and open the index.html file to see your digital edition.
NB: in this case, in order to make EVT work properly in a local environment, you need to use a browser that allows Cross origin requests (e.g. Firefox).
