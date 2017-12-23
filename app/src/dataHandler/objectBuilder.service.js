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

.factory('evtBuilder', function() {
   //Builder constructor
   function Builder() {}

   /**
    * @ngdoc method
    * @module evtviewer.dataHandler
    * @name evtviewer.dataHandler.evtBuilder#create
    * @methodOf evtviewer.dataHandler.evtBuilder
    *
    * @description
    * This static factory method create an object of specific type from a specific instance
    *
    * @param {object} a specific istance
    * @param {object} an object constructor
    *
    * @returns {object} object of specific instance
    *
    * @author GC
    */
   Builder.create = function(Instance, type) {
      var constr = type,
         newInstance;

      // return error if the constructor (type) doesn't exist
      if(typeof Instance[constr] !== 'function') {
         throw {
            name: 'Error',
            message: constr + ' doesn\'t exist'
         };
      }

      newInstance = new Instance[constr]();

      return newInstance;
   };

   return Builder;
});
