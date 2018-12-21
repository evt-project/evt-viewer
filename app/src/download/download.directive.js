/**
 * @ngdoc directive
 * @module evtviewer.download
 * @name evtviewer.download.directive:evtDownload
 * @description
 * # evtDownload
 * <p>Container that shows a particular content organized in a structure similar
 * to an unordered list of tabs that have hashes corresponding to tab ids.
 * When the user clicks on each tab, only the container with the corresponding tab id will become visible.</p>
 * <p>Tabs can appear either on top of content ('*horizontal*' layout) or on the left-hand side of content ('*vertical*' layout).</p>
 * <p>The tabs and the content of each one are defined according to a particular type; content is retrieved from
 * {@link evtviewer.dataHandler.parsedData}.</p>
 * <p>Available types are:<ul>
 * <li> **projectInfo**: will retrieve and show the header information about project and edition,
 * properly divided into 'File Description', 'Encoding Description', 'Text Profile', 'Outside Metadata',
 * 'Revision History' and 'Bibliography'.</li>
 * <li> **entitiesList**: will retrieve and show all the available lists of named entities parsed.</li>
 * </ul></p>
 * <p>It uses the {@link evtviewer.download.controller:DownloadCtrl DownloadCtrl} controller,
 * which is expanded dinamically inside the
 * {@link evtviewer.download.evtDownload evtDownload} provider file.</p>
 *
 * @scope
 * @param {string=} type type of tab container ('projectInfo', 'entitiesList')
 * @param {string=} orientation orientation of tabs ('vertical', 'horizontal') [default: 'vertical']
 *
 * @restrict E
 *
 * @author CDP
**/
angular.module('evtviewer.download')

.directive('evtDownload', function(evtDownload) {

    return {
        restrict: 'E',
        scope: {},
        transclude: true,
        templateUrl: 'src/download/download.dir.tmpl.html',
        controllerAs: 'vm',
        controller: 'DownloadCtrl',
        link: function(scope) {
      		// Initialize tabs container
            var currentDownload = evtDownload.build(scope);

            // Garbage collection
            scope.$on('$destroy', function() {
                if (currentDownload){
                    evtDownload.destroy(currentDownload.currentId);
                }
            });
        }
    };
});
