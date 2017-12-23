angular.module('evtviewer.dataHandler')

.factory('evtCriticalEditionHandler', function(parsedData) {
   //CriticalEditionHandler constructor
   function CriticalEditionHandler() {}

   function getCurrentWitnesses(node) {
      var wit = node.getAttribute('wit'),
         witList = parsedData.getWitnesses();

      wit = wit.split('#').join('');
      //wit = wit.split('#').join('').replace(/\s/g, '');

      if(wit.includes('group')) {
         var str = '',
            group = witList.group.content;
         group.forEach(function(w) {
            str += w;
         });
         wit = wit.replace('group', str);
      }

      return wit;
   }

   CriticalEditionHandler.prototype.parseCriticalEdition = function(node) {
      var text = '';

      if(node.nodeName === '#text') {
         text += node.textContent;
      }
      else {
         var currentWitnesses = getCurrentWitnesses(node);
      }

      return text;
   }

   return CriticalEditionHandler;
});
