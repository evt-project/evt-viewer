EVT 2.0 (evt-viewer)
====================

Short instructions to install and configure the development framework for EVT 2.0 (evt-viewer).

# ##### #
# Linux #
# ##### #

* UPDATE THE PACKAGE DATABASE [to do just to be sure that everything's ok]
| $ sudo apt-get update

* GIT [to do only if you haven't already installed git]
| $ sudo apt-get install git

* RUBY
| $ sudo apt-get install ruby-compass build-essential curl
| $ sudo gem install compass [to do in any case to avoid CSS compilation problems]

* NODE JS
| $ curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -
| $ sudo apt-get install -y nodejs

* BOWER AT SYSTEM LEVEL
| $ sudo npm install -g bower

* GRUNT AT SYSTEM LEVEL
| $ sudo npm install -g grunt-cli 

* CLONE THE EVT REPOSITORY FROM GITHUB
| $ git clone https://github.com/evt-project/evt-viewer.git

* GO INTO THE REPOSITORY FOLDER
| $ cd evt-viewer

* NPM
| $ npm install [ignore any WARN message, they are harmless]
| $ npm install bower

* BOWER 
| $ bower install [choose the angular.js version recommended for evt-viewer]

* START GRUNT DEV
| $ grunt dev [most likely at this point in time evt-viewer won't be launched correctly starting from the master branch, see below how to switch to the develop branch]

* SWITCH TO THE DEVELOP GIT BRANCH
| $ git checkout develop

* TO UPDATE THE REPOSITORY
| $ git pull

* START GRUNT DEV
| $ grunt dev



* IN CASE OF CSS COMPILATION ERRORS
| $ sudo gem install rubygems-update
| $ sudo update_rubygems
|
| $ sudo apt-get install ruby-dev
| $ sudo gem install compass susy

* IN CASE OF VISUALIZATION PROBLEMS
| $ grunt dev --force


* *********************** *

# ####### #
# Windows #
# ####### #

* GIT 
| Install GIT (if not already available in your system)
|https://git-scm.com/downloads

* RUBY
| Install the latest Ruby version
| http://rubyinstaller.org/
|[IMPORTANT: in the installer window select the "Add Ruby executables" options]
| Open a shell as administrator, then typ
| $ gem install compass
| $ gem install susy

* NODEJS
| Install nodejs from https://nodejs.org/fr/blog/release/v8.11.3/ (Windows 32-bit Installer or Windows 64-bit Installer depending on your OS)

* BOWER AT SYSTEM LEVEL
| $ npm install -g bower 

* GRUNT AT SYSTEM LEVEL
| $ npm install -g grunt-cli

* CLONE REPOSITORY FROM GITHUB
| $ git clone https://github.com/evt-project/evt-viewer.git

* GO INTO THE REPOSITORY FOLDER
| $ cd evt-viewer

* NPM
| $ npm install [ignore any WARN message, they are harmless]
| $ npm install bower

* BOWER 
| $ bower install [choose the angular.js version recommended for evt-viewer]

* START GRUNT DEV
| $ grunt dev [most likely at this point in time evt-viewer won't be launched correctly starting from the master branch, see below how to switch to the develop branch]

* SWITCH TO THE DEVELOP GIT BRANCH 
| $ git checkout develop

* TO UPDATE THE REPOSITORY
| $ git pull

* START GRUNT DEV
| $ grunt dev



* IN CASE OF VISUALIZATION PROBLEMS
| $ grunt dev --force

* *********************** *

# #### #
# OS X #
# #### #

* HOMEBREW [to do only if you haven't already installed homebrew]
| $ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)" 
| $ brew doctor

* GIT [to do only if you haven't already installed git]
| $ sudo brew install git

* RUBY
| $ sudo brew install ruby
| $ sudo gem update --system
| $ sudo gem install compass

* NODE JS
| $ sudo brew install node

* BOWER AT SYSTEM LEVEL
| $ sudo npm install -g bower

* GRUNT AT SYSTEM LEVEL
| $ sudo npm install -g grunt-cli 

* CLONE THE EVT REPOSITORY FROM GITHUB
| $ git clone https://github.com/evt-project/evt-viewer.git

* GO INTO THE REPOSITORY FOLDER
| $ cd evt-viewer

* NPM
| $ npm install [ignore any WARN message, they are harmless]
| $ npm install bower

* BOWER 
| $ bower install [choose the angular.js version recommended for evt-viewer]

* START GRUNT DEV
| $ grunt dev [most likely at this point in time evt-viewer won't be launched correctly starting from the master branch, see below how to switch to the develop branch]

* SWITCH TO THE DEVELOP GIT BRANCH 
| $ git checkout develop

* TO UPDATE THE REPOSITORY
| $ git pull

* START GRUNT DEV
| $ grunt dev



* IN CASE OF VISUALIZATION PROBLEMS
| $ grunt dev --force
