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

    communication.getExternalConfig = function(url) {
        return $http.get(url)
            .then(function(response) {
                config.extendDefault(response.data);
            }, function(error) {
                communication.err('Something wrong while loading configuration file', error);
            });
    };

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
                if (defaults.errorMsgs[error]) {
                    communication.err(defaults.errorMsgs[error].msg+' "'+url+'"', error);
                } else {
                    communication.err(defaults.errorMsgs['404'].msg+' "'+url+'"', error);
                }
            });
    };

    communication.getError = function(){
        return currentError;
    };

    communication.updateError = function(newError){
        currentError = newError;
    };

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