angular.module('evtviewer.dataHandler')
   .factory('EvtSearchInterface', function () {
      
      function Interface(name, methods) {
         if (arguments.length !== 2) {
            throw new Error('Interface constructor called with ' + arguments.length + ' arguments, but expected exactly 2.');
         }
         
         this.name = name;
         this.methods = methods.map(function (method) {
            if (typeof method !== 'string') {
               throw new Error('Interface constructor expects method names to be passed in as a string.');
            }
            return method;
         });
      }
      
      return Interface;
   });
