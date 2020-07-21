/*jshint -W059 */

angular.module('evtviewer.core')

.run(['$log', 'config', function($log, config) {
    $log.enabledContexts = [];
    $log.getInstance = function(context) {
        return {
            log: enhanceLog($log.log, 'log', context),
            info: enhanceLog($log.info, 'info', context),
            warn: enhanceLog($log.warn, 'warn', context),
            debug: enhanceLog($log.debug, 'debug', context),
            error: enhanceErr($log.error, context),
            enableLogging: function(enable) {
                $log.enabledContexts[context] = enable;
            }
        };
    };

    function enhanceLog(logFunc, logName, context) {
        return function() {
            var contextEnabled,
                manualConfContext = $log.enabledContexts[context],
                configContext = config.modules[context];

            if (config.debugConf[logName] === false) {
                return;
            }

            if (typeof(manualConfContext) !== 'undefined') {
                contextEnabled = manualConfContext;
            } else if (typeof(configContext) !== 'undefined' && typeof(configContext.debug) !== 'undefined') {
                contextEnabled = configContext.debug;
            } else {
                contextEnabled = false;
            }

            if (config.debugAllModules === true || contextEnabled === true) {
                var args = Array.prototype.slice.call(arguments);
                args.unshift('#' + context + '#');
                logFunc.apply(null, args);
            }
        };
    }

    function enhanceErr(logFunc, context) {
        return function() {
            var fileErr = function() {
                try {
                    throw Error('');
                } catch (err) {
                    return err;
                }
            };
            var currentErr = fileErr();
            var callerLine = currentErr.stack.split('\n')[4];

            var args = Array.prototype.slice.call(arguments);
            args.unshift('#EVTViewer ' + context + '#');
            args.push(callerLine);
            logFunc.apply(null, args);
        };
    }
}]);