/*jshint -W030 */

angular.module('evtviewer.core')

.service('EventDispatcher', function($q) {

    var eventDispatcher = {},
        events = {};

    eventDispatcher.sendEvent = function(name, args) {
        var promises = [],
            deferred = [],
            defIndex = 0,
            eventArgs;

        events[name] && angular.forEach(events[name], function(callback) {
            if (typeof(callback) !== 'undefined') {
                eventArgs = {
                    args: args,
                    resolve: function(a) {
                        if (defIndex < deferred.length) {
                            deferred[defIndex].resolve(a);
                            defIndex++;
                        }
                    },
                    reject: function(a) {
                        if (defIndex < deferred.length) {
                            deferred[defIndex].reject(a);
                            defIndex++;
                        }
                    }
                };

                deferred.push($q.defer());
                callback.apply(null, [eventArgs]);
            }
        });

        promises = deferred.map(function(p) {
            return p.promise;
        });

        return $q.all(promises);
    };

    eventDispatcher.addListener = function(name, callback) {
        if (!events[name]) {
            events[name] = [];
        }
        events[name].push(callback);
        return [name, callback];
    };

    eventDispatcher.addListeners = function(list, callback) {
        var refs = [];

        for (var l in list) {
            refs.push(eventDispatcher.addListener(list[l], callback));
        }

        return refs;
    };

    eventDispatcher.removeListener = function(handle) {
        var name = handle[0],
            callback = handle[1];

        events[name] && angular.forEach(events[name],
            function(f, index) {
                if (f === callback) {
                    events[name].splice(index, 1);
                    if (events[name].length === 0) {
                        delete events[name];
                        return;
                    }
                }
            }
        );
    };

    eventDispatcher.getListeners = function() {
        var results = [];
        for (var e in events) {
            results.push(e);
        }
        return results;
    };

    return eventDispatcher;
});