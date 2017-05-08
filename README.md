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
5. Install grunt and bower globally
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

4. Install grunt and bower globally
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

5. Install grunt and bower globally
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

To start EVT use *grunt*
``` bash
grunt dev
```

Troubleshooting
----------------

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