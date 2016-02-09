evt-viewer
==========

TODO: work-in-progress

/* ***** */
/* Linux */
/* ***** */
* UPDATE PACCHETTI [da fare per sicurezza]
| $ sudo apt-get update

* GIT [da fare solo se non si ha già installato git]
| $ sudo apt-get install git

* RUBY
| $ sudo apt-get install ruby-compass build-essential curl


* NODE JS
| $ curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -
| $ sudo apt-get install -y nodejs

* CLONE REPO FROM GITHUB
| $ git clone https://github.com/evt-project/evt-viewer.git

* MI SPOSTO NELLA CARTELLA IN CUI HO CLONATO IL REPO
| $ cd evt-viewer

* FETCH DA REPO
| $ git fetch

* PASSO AL BRANCH CRITICAL-EDITION
| $ git checkout critical-edition


* NPM
| $ npm install [ci saranno dei messaggi di WARN => ignorarli]

* BOWER
| $ sudo npm install -g bower 
| $ bower install (scegliere versione di angular consigliata per evt-viewer)

* GRUNT
| $ sudo npm install -g grunt-cli

* START GRUNT DEV
| $ grunt dev --force


* SE CI FOSSERO ERRORI DI COMPILAZIONE DEL CSS
| $ sudo gem install rubygems-update
| $ sudo update_rubygems
|
| $ sudo apt-get install ruby-dev
| $ sudo gem install compass susy


/* ******* */
/* Windows */
/* ******* */
* NODEJS
| Installare nodejs da https://nodejs.org/ o https://nodejs.org/en/download/package­manager

* RUBY
| Installare l'ultima versione di Ruby dal sito 
|[IMPORTANTE: nella schermata di installazione selezionare la voce "Add Ruby executable"]
| Aprire la shell come amministratore
| $ gem install compass
| $ gem install susy

* GIT 
| Installare GIT (se non già presente nel pc)
|
| clonare il repository da https://github.com/evt-project/evt-viewer.git
| scaricare gli ultimi aggiornamenti
| eventulmente fare il checkout su branche critical-edition
|
| spostarsi nella cartella in cui è stato clonato il repositori

* NPM
| $ npm install

* BOWER
| $ sudo npm install -g bower 
| $ bower install (scegliere versione di angular consigliata per evt-viewer)

* GRUNT
| $ sudo npm install -g grunt-cli

* START GRUNT DEV
| $ grunt dev --force