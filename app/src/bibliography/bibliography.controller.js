/**
 * @ngdoc object
 * @module evtviewer.bibliography
 * @name evtviewer.bibliography.controller:BibliographyCtrl
 * @description
 * # BibliographyCtrl
 * <p>This is controller for the {@link evtviewer.bibliography.directive:evtBibliography evtBibliography} directive. </p>
 * <p>The majority of the methods of this controller are defined in the
 * {@link evtviewer.bibliography.evtBibliography evtBibliography} provider
 * where the scope of the directive is extended with all the necessary properties and methods.</p>
 *
 * @requires $log
 * @requires evtviewer.bibliography.evtBibliography
 **/
angular.module('evtviewer.bibliography')

.controller('BibliographyCtrl', ['$log', 'evtBibliography', function($log, evtBibliography) {
    var _console = $log.getInstance('BibliographyCtrl');

    var vm = this;
    /**
     * @ngdoc method
     * @name evtviewer.bibliography.controller:BibliographyCtrl#myComparator
     * @methodOf evtviewer.bibliography.controller:BibliographyCtrl
     *
     * @description
     * Custom compare function used to order the list of bibliographic entryes
     * depending on selected parameters.
     *
     * @param {string} biblId1 id of first bibliographic reference to handle
     * @param {string} biblId2 id of second bibliographic reference to handle
     *
     * @returns {number}  number indicating whether a bibliographic reference comes before
     * or after or is the same as the given bibliographic reference in sort order.
     *
     * @author MR
     */
    this.myComparator = function(biblId1, biblId2) {
        var result1 = biblId1,
            result2 = biblId2;
        biblId1 = vm.getBibliographicRefById(biblId1);
        biblId2 = vm.getBibliographicRefById(biblId2);
        switch (vm.selectedSorting) {
            case vm.sortBy.Author:
                //sorting by author
                if (biblId1 && biblId1.author && biblId1.author.length > 0) {
                    //first try to compare according to author's name, then surname if provided
                    result1 = biblId1.author[0].name !== '' ? biblId1.author[0].name : '';
                    result1 = biblId1.author[0].surname !== '' ? biblId1.author[0].surname : result1;
                }
                if (biblId2 && biblId2.author && biblId2.author.length > 0) {
                    //first try to compare according to author's name, then surname if provided
                    result2 = biblId2.author[0].name !== '' ? biblId2.author[0].name : '';
                    result2 = biblId2.author[0].surname !== '' ? biblId2.author[0].surname : result2;
                }
                break;

            case vm.sortBy.Year:
                //sorting by year
                if (biblId1 && biblId1.date) {
                    // If Number() returns Nan, whe must must be sure to assign empty string to result variable in order to
                    // provide the same sorting logic, element with no information are at the top of the final list.
                    // Infact: ''.localeCompare(...) => -1
                    result1 = biblId1.date !== '' && Number(biblId1.date) ? Number(biblId1.date) : '';
                }
                if (biblId2 && biblId2.date) {
                    result2 = biblId2.date !== '' && Number(biblId2.date) ? Number(biblId2.date) : '';
                }
                break;

            case vm.sortBy.Title:
                //sorting by analytic title or normale title
                if (biblId1 && biblId1.titleAnalytic) {
                    result1 = biblId1.titleAnalytic !== '' && result1 === '' ? biblId1.titleAnalytic : result1;
                }
                if (biblId1 && biblId1.titleMonogr) {
                    result1 = biblId1.titleMonogr !== '' && result1 === '' ? biblId1.titleMonogr : result1;
                }
                if (biblId2 && biblId2.titleAnalytic) {
                    result2 = biblId2.titleAnalytic !== '' && result2 === '' ? biblId2.titleAnalytic : result2;
                }
                if (biblId2 && biblId2.titleMonogr) {
                    result2 = biblId2.titleMonogr !== '' && result2 === '' ? biblId2.titleMonogr : result2;
                }
                break;

            case vm.sortBy.Publisher:
                if (biblId1 && biblId1.publisher) {
                    result1 = biblId1.publisher !== '' ? biblId1.publisher : '';
                }
                if (biblId2 && biblId2.publisher) {
                    result2 = biblId2.publisher !== '' ? biblId2.publisher : '';
                }
                break;
        }
        result1 = typeof result1 === 'number' ? result1.toString() : result1;
        result2 = typeof result2 === 'number' ? result2.toString() : result2;
        return result1.localeCompare(result2);
    };
    this.biblId = function(biblId) {
        return biblId;
    };
    this.getSortedBibl = function() {
        const biblCollection = vm.biblRefsCollection._indexes;
        biblCollection.sort(vm.myComparator);
        if(vm.selectedSortOrder === vm.sortOrder.DESC) {
            biblCollection.reverse();
        }
        return biblCollection;
    };
    /**
     * @ngdoc method
     * @name evtviewer.bibliography.controller:BibliographyCtrl#destroy
     * @methodOf evtviewer.bibliography.controller:BibliographyCtrl
     *
     * @description
     * Remove instance from saved instances in {@link evtviewer.bibliography.evtBibliography evtBibliography} provider.
     *
     * @author MR
     */
    this.destroy = function() {
        evtBibliography.destroy(this.uid);
    };
}]);
