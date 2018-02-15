/**
 * @ngdoc service
 * @module evtviewer.core
 * @name evtviewer.core.eventDispatcher
 * @description 
 * # eventDispatcher
 * Add, send and register events.
 * This service was defined but never actually used
 *
 *  @requires $q
**/
/*jshint -W030 */
angular.module('evtviewer.core')

.service('eventDispatcher', function($q) {

    var eventDispatcher = {},
        events = {};
    /**
    * @ngdoc method
    * @name evtviewer.core.eventDispatcher#sendEvent
    * @methodOf evtviewer.core.eventDispatcher
    *
    * @description
    * Send an event with a name and some arguments.
    * It will perform all the callback registered to the particular event.
    *
    * @param {string} name name of event to send
    * @param {Object} args object of arguments to be sent
    *
    * @returns {promise} promise that all callback have ended
    */
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
    /**
    * @ngdoc method
    * @name evtviewer.core.eventDispatcher#addListener
    * @methodOf evtviewer.core.eventDispatcher
    *
    * @description
    * Add listener for an event and set callback
    *
    * @param {string} name name of event to add
    * @param {function()} callback callback function to perform when the event rises
    *
    * @returns {object} referement to pair [eventName, callback]
    */
    eventDispatcher.addListener = function(name, callback) {
        if (!events[name]) {
            events[name] = [];
        }
        events[name].push(callback);
        return [name, callback];
    };
    /**
    * @ngdoc method
    * @name evtviewer.core.eventDispatcher#addListeners
    * @methodOf evtviewer.core.eventDispatcher
    *
    * @description
    * Add listeners for a list of events and set callback for each one of them
    *
    * @param {array} list list of events to add
    * @param {function()} callback callback function to perform when the events rise
    *
    * @returns {array} list of referements to pair [eventName, callback]
    */
    eventDispatcher.addListeners = function(list, callback) {
        var refs = [];

        for (var l in list) {
            refs.push(eventDispatcher.addListener(list[l], callback));
        }

        return refs;
    };
    /**
    * @ngdoc method
    * @name evtviewer.core.eventDispatcher#removeListener
    * @methodOf evtviewer.core.eventDispatcher
    *
    * @description
    * Remove callback for an event
    *
    * @param {array} handle array that contains in first position the event name and in second the callback
    */
    eventDispatcher.removeListener = function(handle) {
        var name = handle[0],
            callback = handle[1];

        events[name] && angular.forEach(events[name],
            function(f, index) {
                if (f === callback) {
                    events[name].splice(index, 1);
                    if (events[name].length === 0) {
                        delete events[name];
                    }
                }
            }
        );
    }; 
    /**
    * @ngdoc method
    * @name evtviewer.core.eventDispatcher#getListeners
    * @methodOf evtviewer.core.eventDispatcher
    *
    * @description
    * Get all listeners
    *
    * @returns {array} array of events handled with at least one callback function
    */
    eventDispatcher.getListeners = function() {
        var results = [];
        for (var e in events) {
            results.push(e);
        }
        return results;
    };

    return eventDispatcher;
});