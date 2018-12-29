angular.module('evtviewer.search')
   .constant('SEARCHBOXDEFAULTS', {
      diplomaticSearchBoxBtn: {
         showResults: {title: 'Show results', label: '', icon: 'search-results-show', type: 'searchResultsShow'},
         hideResults: {title: 'Hide results', label: '', icon: 'search-results-hide', type: 'searchResultsHide', hide: true},
         virtualKeyboard: {title: 'Virtual keyboard', label: '', icon: 'keyboard', type: 'searchVirtualKeyboard'},
         caseSensitive: {title: 'Case sensitive', label: '', icon: 'case-sensitive', type: 'searchCaseSensitive'},
         exactWord: {title: 'Exact word', label: '', icon: 'exact-word', type: 'searchExactWord'},
         searchClear: {title: 'Clear search', label: '', icon: 'close', type: 'searchClear'},
         previous: {title: 'Previous', label: '', icon: 'previous', type: 'searchPrevResult'},
         next: {title: 'Next', label: '', icon: 'next', type: 'searchNextResult'},
         search: {title: 'Search', label: '', icon: 'search', type: 'search'}
      },
      interpretativeSearchBoxBtn: {
         showResults: {title: 'Show results', label: '', icon: 'search-results-show', type: 'searchResultsShow'},
         hideResults: {title: 'Hide results', label: '', icon: 'search-results-hide', type: 'searchResultsHide', hide: true},
         virtualKeyboard: {title: 'Virtual keyboard', label: '', icon: 'keyboard', type: 'searchVirtualKeyboard'},
         caseSensitive: {title: 'Case sensitive', label: '', icon: 'case-sensitive', type: 'searchCaseSensitive'},
         exactWord: {title: 'Exact word', label: '', icon: 'exact-word', type: 'searchExactWord'},
         searchClear: {title: 'Clear search', label: '', icon: 'close', type: 'searchClear'},
         previous: {title: 'Previous', label: '', icon: 'previous', type: 'searchPrevResult'},
         next: {title: 'Next', label: '', icon: 'next', type: 'searchNextResult'},
         search: {title: 'Search', label: '', icon: 'search', type: 'search'}
      }
   })
   
   .config(function(evtSearchBoxProvider, configProvider, SEARCHBOXDEFAULTS) {
      var defaults = configProvider.makeDefaults('search', SEARCHBOXDEFAULTS);
      evtSearchBoxProvider.setDefaults(defaults);
   });
