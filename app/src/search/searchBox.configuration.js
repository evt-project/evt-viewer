angular.module('evtviewer.search')
   .constant('SEARCHBOXDEFAULTS', {
      diplomaticSearchBoxBtn: {
         showResults: {title: 'Show Results', label: '', icon: 'search-results-show', type: 'searchResultsShow'},
         hideResults: {title: 'Hide Results', label: '', icon: 'search-results-hide', type: 'searchResultsHide', hide: true},
         virtualKeyboard: {title: 'Virtual Keyboard', label: '', icon: 'keyboard', type: 'searchVirtualKeyboard'},
         caseSensitive: {title: 'Case Sensitive', label: '', icon: 'case-sensitive', type: 'searchCaseSensitive'},
         search: {title: 'Search', label: '', icon: 'search', type: 'search'}
      },
      interpretativeSearchBoxBtn: {
         showResults: {title: 'Show Results', label: '', icon: 'search-results-show', type: 'searchResultsShow'},
         hideResults: {title: 'Hide Results', label: '', icon: 'search-results-hide', type: 'searchResultsHide', hide: true},
         caseSensitive: {title: 'Case Sensitive', label: '', icon: 'case-sensitive', type: 'searchCaseSensitive'},
         search: {title: 'Search', label: '', icon: 'search', type: 'search'}
      }
   })
   
   .config(function(evtSearchBoxProvider, configProvider, SEARCHBOXDEFAULTS) {
      var defaults = configProvider.makeDefaults('search', SEARCHBOXDEFAULTS);
      evtSearchBoxProvider.setDefaults(defaults);
   });
