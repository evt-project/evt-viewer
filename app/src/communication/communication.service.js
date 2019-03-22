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
            title : 'MESSAGES.FILE_NOT_FOUND',
            code: '404',
            msg   : 'MESSAGES.SOMETHING_WRONG_DURING_FILE_LOADING'
        },
       '405' : {
            title : 'MESSAGES.MISSING_PARAMETERS',
            code: '405',
            msg   : 'MESSAGES.BIBL_REF_NOT_FOUND'
        },
        'dataUrlEmpty': {
          title: 'MESSAGES.MISSING_PARAMETERS',
          code: '404',
          msg: 'MESSAGES.PATH_TO_EDITION_EMPTY'
        }
    }
})

.service('evtCommunication', function($http, $log, $q, baseData, config, evtDialog, COMMUNICATIONDEFAULTS) {
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
     *
     * @param {string} url external configuration file
     * @returns {httpPromise} resolve with fetched data, or fails with error description.
     */
    communication.getExternalConfig = function(url) {
        return $http.get(url)
            .then(function(response) {
                config.extendDefault(response.data);
            }, function(error) {
                communication.err('Something wrong while loading configuration file', '', error, true);
            });
    };

    /**
     * @ngdoc method
     * @name evtviewer.communication.evtCommunication#getData
     * @methodOf evtviewer.communication.evtCommunication
     *
     * @description
     * Method to access edition data from an URL. Different base parsers will be launched depending on type of read file.
     *
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
                    communication.err(defaults.errorMsgs[error.status].msg, url, error.status, true);
                } else {
                    communication.err(defaults.errorMsgs['404'].msg, url, error.status, true);
                }
            });
    };

	/**
     * @ngdoc method
     * @name evtviewer.communication.evtCommunication#getViscollSvgs
     * @methodOf evtviewer.communication.evtCommunication
     *
     * @description
     * Method to access Svgs data from an URL. Different base parsers will be launched depending on type of read file.
     *
     * @param {string} url file containing the edition data
     * @returns {httpPromise} resolve with fetched data, or fails with error description.
     */
    communication.getViscollSvgs = function(url, svgId) {
        return $http.get(url)
            .then(function(response) {
                return baseData.handleViscollSvg(response.data, svgId);
            }, function(error) {
                // TODO: Show error in a toast (EVT can work without viscoll)
            });
    };
	
	/**
     * @ngdoc method
     * @name evtviewer.communication.evtCommunication#getViscollDataModel
     * @methodOf evtviewer.communication.evtCommunication
     *
     * @description
     * Method to access DataModel data from an URL. Different base parsers will be launched depending on type of read file.
     *
     * @param {string} url file containing the edition data
     * @returns {httpPromise} resolve with fetched data, or fails with error description.
     */
	communication.getViscollDataModel = function(url) {
		return $http.get(url)
            .then(function(response) {
                if (typeof(response.data) === 'string') {
                    _console.log('XML Data received');
                    return baseData.addViscollDataModel(response.data);
                } 
            }, function(error) {
                if (defaults.errorMsgs[error.status]) {
                    communication.err(defaults.errorMsgs[error.status].msg, url, error.status, true);
                } else {
                    communication.err(defaults.errorMsgs['404'].msg, url, error.status, true);
                }
            });
    };
	
	/**
     * @ngdoc method
     * @name evtviewer.communication.evtCommunication#getViscollImageList
     * @methodOf evtviewer.communication.evtCommunication
     *
     * @description
     * Method to access ImageList data from an URL. Different base parsers will be launched depending on type of read file.
     *
     * @param {string} url file containing the edition data
     * @returns {httpPromise} resolve with fetched data, or fails with error description.
     */
	communication.getViscollImageList = function(url) {
		return $http.get(url)
            .then(function(response) {
                if (typeof(response.data) === 'string') {
                    _console.log('XML Data received');
                    return baseData.addViscollImageList(response.data);
                } 
            }, function(error) {
                if (defaults.errorMsgs[error.status]) {
                    communication.err(defaults.errorMsgs[error.status].msg, url, error.status, true);
                } else {
                    communication.err(defaults.errorMsgs['404'].msg, url, error.status, true);
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
     *
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
                    communication.err(defaults.errorMsgs[error].msg, url, error, true);
                } else {
                    communication.err(defaults.errorMsgs['404'].msg, url, error, true);
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
     *
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
                    communication.err(defaults.errorMsgs[error].msg, url, error, true);
                } else {
                    communication.err(defaults.errorMsgs['404'].msg, url , error, true);
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
     *
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
     *
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
     *
     * @params {string} msg message of the error
     * @params {string} code code of the error
     */
    communication.err = function(msg, info, code, openDialog) {
        // _console.log('# ERROR '+code+' # ' + msg);
        code = code !== undefined ? code : '';
        var errorData = defaults.errorMsgs[code];
        var newError = {
            code  : errorData ? errorData.code : code,
            msg   : (!msg || msg === '') && errorData ?  errorData.msg : msg,
            info  : info,
            title : errorData ? errorData.title : 'MESSAGES.COMMUNICATION_ERROR '
        };
        communication.updateError(newError);

        if (openDialog) {
          var errorDialog = evtDialog.getById('errorMsg');
          errorDialog.updateContent('{{ "' + currentError.msg + '" | translate }} ' + currentError.info );
          errorDialog.setTitle(currentError.title);
          errorDialog.open();
        }
    };

    return communication;
});
