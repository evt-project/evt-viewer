/**
 * @ngdoc directive
 * @module evtviewer.bibliography
 * @name evtviewer.bibliography.directive:evtBibliography
 * @description 
 * # evtBibliography
 * <p>Show the bibliography of the edition with all the tools that allows to reorder the entries or format them according to a specific style.</p>
 * <p> The template is composed of a <code>&lt;select&gt;</code> that allow to switch the bibliographic style in which formatting the entries;
 * the value of this <code>&lt;select&gt;</code> is registered and passed to the controller that will update the view according to the selected style.</p>
 * <p> Next to this <code>&lt;select&gt;</code> there is a group of other <code>&lt;select&gt;</code>s that allows the user to order the entries
 * according to a specific property (author, year, title | ascending, descending).</p>
 * <p>The view is updated using the method {@link evtviewer.bibliography.controller:BibliographyCtrl#getFormattedBibl getFormattedBibl()},
 * that returns an HTML string containing the formatted output of the entry.</p>
 * <p>It uses the {@link evtviewer.bibliography.controller:BibliographyCtrl BibliographyCtrl} controller.</p>
 * <p>It is connected to {@link evtviewer.bibliography.evtBibliography evtBibliography} provider 
 * that allows to handle programmatically the configuration of the directive itself. 
 * The majority of the methods of controller are defined in the {@link evtviewer.bibliography.evtBibliography evtBibliography} provider 
 * where the scope of the directive is extended with all the necessary properties and methods.</p>
 *
 * @scope
 * @param {string=} id id of bibliography to be shown
 *
 * @restrict E
 *
 * @author MR
**/
angular.module('evtviewer.bibliography')

.directive('evtBibliography', function(evtBibliography) { 
	return {
		restrict: 'E',
		templateUrl: 'src/bibliography/bibliography.directive.tmpl.html',
		scope: {
            id   : '@'
        },
		controllerAs: 'vm', 
        controller: 'BibliographyCtrl', 
        link: function(scope, element, attrs) { 
            // Initialize bibliography 
            var currentBibliography = evtBibliography.build(scope); 
             
            // Garbage collection 
            scope.$on('$destroy', function() { 
                if (currentBibliography){ 
                    currentBibliography.destroy(); 
                }      
            }); 
        } 
	};
});