angular.module('evtviewer.communication')

.constant('COMMUNICATIONDEFAULTS', {
    mode: 'xml',

    errorMsgs : {
        '404' : {
            title : 'File not found',
            msg   : 'Something wrong during loading file'
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
            .success(function(data) {
                config.extendDefault(data);
            })
            .error(function(data, status) {
                communication.err('Something wrong while loading configuration file', status);
            });
    };

    communication.getData = function(url) {
        return $http.get(url)
            .success(function(data) {
                if (typeof(data) === 'string') {
                    baseData.addXMLString(data);
                    _console.log('XML Data received');
                } else {
                    // TODO: JSON? 
                }
            })
            .error(function(data, status) {
                communication.err(defaults.errorMsgs[status].msg+' "'+url+'"', status);
            });
    };

    communication.getError = function(){
        return currentError;
    };

    communication.updateError = function(newError){
        currentError = newError;
    }

    communication.err = function(msg, code) {
        // _console.log('# ERROR '+code+' # ' + msg);
        code = code !== undefined ? code : '';
        var newError = {
            code  : code,
            msg   : msg,
            title : defaults.errorMsgs[code] ? 'Error '+code+' - '+defaults.errorMsgs[code].title : 'Communication error '+code
        }
        communication.updateError(newError);
        
        var errorDialog = evtDialog.getById('errorMsg');
        errorDialog.updateContent(currentError.msg);
        errorDialog.setTitle(currentError.title);
        errorDialog.open();
    };

    return communication;
});