angular.module('evtviewer.search')
   .constant('SEARCHBOXDEFAULTS', {
      diplomaticSearchBoxBtn: {
         virtualKeyboard: {title: 'Virtual Keyboard', label: '', icon: 'keyboard', type: 'searchVirtualKeyboard'},
         caseSensitive: {title: 'Case Sensitive', label: '', icon: 'case-sensitive', type: 'searchCaseSensitive'},
         search: {title: '{{ \'SEARCH.MAIN\' | translate}}', label: '', icon: 'search', type: 'search'}
      },
      interpretativeSearchBoxBtn: {
         caseSensitive: {title: 'Case Sensitive', label: '', icon: 'case-sensitive', type: 'searchCaseSensitive'},
         search: {title: '{{ \'SEARCH.MAIN\' | translate}}', label: '', icon: 'search', type: 'search'}
      }
   })
   
   .config(function(evtSearchBoxProvider, configProvider, SEARCHBOXDEFAULTS) {
      var defaults = configProvider.makeDefaults('search', SEARCHBOXDEFAULTS);
      evtSearchBoxProvider.setDefaults(defaults);
   });
