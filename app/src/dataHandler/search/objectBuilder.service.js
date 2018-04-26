/**
 * @ngdoc service
 * @module evtviewer.dataHandler
 * @name evtviewer.dataHandler.evtBuilder
 * @description
 * # evtBuilder
 * In this service is defined a constructor with a static factory method to create an object of specific type from an instance
 *
 * @returns {object} EvtSearch object
 *
 * @author GC
 */

angular.module('evtviewer.dataHandler')
   .service('evtBuilder', ['evtSearchDocument', 'evtAbstractSearchParserInterface', 'EvtSearchLbParser', 'EvtSearchLineParser', function EvtBuilder(evtSearchDocument, evtAbstractSearchParserInterface, EvtSearchLbParser, EvtSearchLineParser) {
      
      EvtBuilder.prototype.createParser = function (xmlDocBody) {
         if (evtSearchDocument.hasLineElement(xmlDocBody) === true) {
            ensureImplements(EvtSearchLineParser, evtAbstractSearchParserInterface);
            return new EvtSearchLineParser();
         }
         else {
            ensureImplements(EvtSearchLbParser, evtAbstractSearchParserInterface);
            return new EvtSearchLbParser(xmlDocBody);
         }
      };
      
      function ensureImplements(evtSearchParser, evtSearchInterface) {
         if (arguments.length < 2) {
            throw new Error('Function Interface.ensureImplements called with ' + arguments.length + ' arguments, but expected at least 2.');
         }
         
         for (var i = 1; i < arguments.length; i++) {
            var interface = arguments[i];
            if (interface.constructor !== evtSearchInterface.constructor) {
               throw new Error('Function Interface.ensureImplements expects arguments two and above to be instances of Interface.');
            }
            interface.methods.forEach(function (method) {
               if (!evtSearchParser.prototype[method] || typeof evtSearchParser.prototype[method] !== 'function') {
                  throw new Error('Function Interface.ensureImplements: object ' +
                     'does not implement the ' + interface.name + ' interface. ' +
                     'Method ' + method + ' was not found.');
               }
            });
         }
      }
   }]);
