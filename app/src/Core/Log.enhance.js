/*jshint -W059 */

angular.module('evtviewer.core')

.run(function($log, Config) {
    $log.enabledContexts = [];
    $log.getInstance = function(context) {
        return {
            log: enhanceLog($log.log, context),
            info: enhanceLog($log.info, context),
            warn: enhanceLog($log.warn, context),
            debug: enhanceLog($log.debug, context),
            error: enhanceErr($log.error, context),
            enableLogging: function(enable) {
                $log.enabledContexts[context] = enable;
            }
        };
    };

    function enhanceLog(loggingFunc, context) {
        return function() {
            var contextEnabled;

            if (typeof($log.enabledContexts[context]) !== 'undefined') {
                contextEnabled = $log.enabledContexts[context];
            } else {
                contextEnabled = Config.modules[context].debug;
            }

            if (Config.debugAllModules === true || contextEnabled === true) {
                var args = Array.prototype.slice.call(arguments);
                args.unshift('#' + context + '#');
                loggingFunc.apply(null, args);
            }
        };
    }

    function enhanceErr(loggingFunc, context) {
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
            loggingFunc.apply(null, args);
        };
    }
});