'use strict';

/**
 * @ngdoc service
 * @module evtviewer.communication
 * @name evtviewer.communication.evtCommunication
 * @description 
 * # evtCommunication 
 * Service defining functions used to communicate with external resources.
**/
angular.module('evtviewer.communication')

.constant('COMMUNICATIONDEFAULTS', {
    mode: 'xml',

    errorMsgs : {
        '404' : {
            title : 'File not found',
            msg   : 'Something wrong during loading file'
        },
       '405' : {
            title : 'Missing referement',
            msg   : 'Could not find bibliography referement'
        }       
    }
})

.service('evtCommunication', function($http, $log, baseData, config, evtDialog, COMMUNICATIONDEFAULTS) {
    var communication = {},
        defaults      = COMMUNICATIONDEFAULTS;

    var _console = $log.getInstance('communication');
    var currentError = {
        code  : '',
        title : '',
        msg   : ''
    };

    /**
     * @ngdoc method
     * @name evtviewer.communication.evtCommunication#getExternalConfig
     * @methodOf evtviewer.communication.evtCommunication
     *
     * @description
     * Method to access external configuration file in order to extend the defaults.
     * @example
     * evtCommunication.getExternalConfig(url);
     * @param {string} url external configuration file
     * @returns {httpPromise} resolve with fetched data, or fails with error description. 
     */
    communication.getExternalConfig = function(url) {
        return $http.get(url)
            .then(function(response) {
                config.extendDefault(response.data);
            }, function(error) {
                communication.err('Something wrong while loading configuration file', error);
            });
    };

    /**
     * @ngdoc method
     * @name evtviewer.communication.evtCommunication#getData
     * @methodOf evtviewer.communication.evtCommunication
     *
     * @description
     * Method to access edition data from an URL. Different base parsers will be launched depending on type of read file.
     * @example
     * evtCommunication.getData(url);
     * @param {string} url file containing the edition data
     * @returns {httpPromise} resolve with fetched data, or fails with error description. 
     */
    communication.getData = function(url) {
        return $http.get(url)
            .then(function(response) {
                if (typeof(response.data) === 'string') {
                    _console.log('XML Data received');
                    return baseData.addXMLString(response.data);
                } else {
                    // TODO: JSON? 
                }
            }, function(error) {
                if (defaults.errorMsgs[error.status]) {
                    communication.err(defaults.errorMsgs[error.status].msg+' "'+url+'"', error.status);
                } else {
                    communication.err(defaults.errorMsgs['404'].msg+' "'+url+'"', error.status);
                }
            });
    };

    /**
     * @ngdoc method
     * @name evtviewer.communication.evtCommunication#getExternalData
     * @methodOf evtviewer.communication.evtCommunication
     *
     * @description
     * Method to access edition external data from an URL. Different base parsers will be launched depending on type of read file.
     * @example
     * evtCommunication.getExternalData(url);
     * @param {string} url file containing the edition data
     * @returns {httpPromise} resolve with fetched data, or fails with error description. 
     */
    communication.getExternalData = function(url) {
        return $http.get(url)
        .then(function(response){
            if (typeof(response.data) === 'string') {
                    var docType = '';
                    if (url === config.sourcesUrl){
                        docType = 'sources';
                    }
                    else if (url === config.analoguesUrl) {
                        docType = 'analogues';
                    }
                    baseData.addXMLExtDocument(response.data, docType);
                                        
                    _console.log('XML Data received');
                } else {
                    // TODO: JSON? 
                }
            }, function(error) {
                if (defaults.errorMsgs[error]) {
                    communication.err(defaults.errorMsgs[error].msg+' "'+url+'"', error);
                } else {
                    communication.err(defaults.errorMsgs['404'].msg+' "'+url+'"', error);
                }
            });
    };

    /**
     * @ngdoc method
     * @name evtviewer.communication.evtCommunication#getSourceTextFile
     * @methodOf evtviewer.communication.evtCommunication
     *
     * @description
     * Method to access source text data from an URL. Different base parsers will be launched depending on type of read file.
     * @example
     * evtCommunication.getSourceTextFile(url, id);
     * @param {string} url file containing the edition data
     * @param {string} id document connected to external source file
     * @returns {httpPromise} resolve with fetched data, or fails with error description. 
     */
    communication.getSourceTextFile = function(url, id) {
        return $http.get(url)
        .then(function(response){
            if (typeof(response.data) === 'string') {
                    baseData.addXMLSrcDocument(response.data, id);                   
                    _console.log('XML Data received');
                } else {
                    // TODO: JSON? 
                }
            }, function(error) {
                if (defaults.errorMsgs[error]) {
                    communication.err(defaults.errorMsgs[error].msg+' "'+url+'"', error);
                } else {
                    communication.err(defaults.errorMsgs['404'].msg+' "'+url+'"', error);
                }
            });
    };

    /**
     * @ngdoc method
     * @name evtviewer.communication.evtCommunication#getError
     * @methodOf evtviewer.communication.evtCommunication
     *
     * @description
     * Method to get the current communication error.
     * @example
     * evtCommunication.getError();
     * @returns {string} current error saved
     */
    communication.getError = function(){
        return currentError;
    };

    /**
     * @ngdoc method 
     * @name evtviewer.communication.evtCommunication#updateError
     * @methodOf evtviewer.communication.evtCommunication
     *
     * @description
     * Method to set the current communication error.
     * @example
     * evtCommunication.updateError(newError);
     * @params {string} newError value of new error raised
     */
    communication.updateError = function(newError){
        currentError = newError;
    };

    /**
     * @ngdoc method 
     * @name evtviewer.communication.evtCommunication#err
     * @methodOf evtviewer.communication.evtCommunication
     *
     * @description
     * Method to open a dialog showing the current communication error raised.
     * @example
     * evtCommunication.err(msg, code);
     * @params {string} msg message of the error
     * @params {string} code code of the error
     */
    communication.err = function(msg, code) {
        // _console.log('# ERROR '+code+' # ' + msg);
        code = code !== undefined ? code : '';
        var newError = {
            code  : code,
            msg   : msg,
            title : defaults.errorMsgs[code] ? 'Error '+code+' - '+defaults.errorMsgs[code].title : 'Communication error '+code
        };
        communication.updateError(newError);
        
        var errorDialog = evtDialog.getById('errorMsg');
        errorDialog.updateContent(currentError.msg);
        errorDialog.setTitle(currentError.title);
        errorDialog.open();
    };

    return communication;
});