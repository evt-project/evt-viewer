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
   .service('evtBuilder', ['evtSearchDocument', 'evtAbstractSearchParserInterface', 'EvtSearchDiploInterprLbParser', 'EvtSearchParLineParser', 'EvtSearchDiplomaticParLineParser',
      function EvtBuilder(evtSearchDocument, evtAbstractSearchParserInterface, EvtSearchDiploInterprLbParser, EvtSearchParLineParser, EvtSearchDiplomaticParLineParser) {
      
      EvtBuilder.prototype.createParser = function (xmlDocBody) {
         var hasLbElement = evtSearchDocument.hasLbElement(xmlDocBody),
            isDiplomaticInterpretativeEdition = evtSearchDocument.isDiplomaticInterpretativeEdition(xmlDocBody),
            isDiplomaticEdition = evtSearchDocument.isDiplomaticEdition(xmlDocBody);
         
         if (hasLbElement && isDiplomaticInterpretativeEdition) {
            ensureImplements(EvtSearchDiploInterprLbParser, evtAbstractSearchParserInterface);
            return new EvtSearchDiploInterprLbParser(xmlDocBody);
         }
         else if (hasLbElement && isDiplomaticEdition) {
         
         }
         else if(!hasLbElement && isDiplomaticInterpretativeEdition) {
            ensureImplements(EvtSearchParLineParser, evtAbstractSearchParserInterface);
            return new EvtSearchParLineParser(xmlDocBody);
         }
         else {
            ensureImplements(EvtSearchDiplomaticParLineParser, evtAbstractSearchParserInterface);
            return new EvtSearchDiplomaticParLineParser(xmlDocBody);
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
