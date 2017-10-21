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
 * @requires $scope
 * @requires evtviewer.bibliography.evtBibliography
 **/
angular.module('evtviewer.bibliography')

.controller('BibliographyCtrl', function($log, $scope, evtBibliography) {
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
        var result1 = '',
            result2 = '';
        switch (vm.selectedSorting) {
            case vm.sortBy.Author:
                //sorting by author
                if (typeof biblId1.value.author !== 'undefined' && biblId1.value.author.length > 0) {
                    //first try to compare according to author's name, then surname if provided
                    result1 = biblId1.value.author[0].name !== '' ? biblId1.value.author[0].name : '';
                    result1 = biblId1.value.author[0].surname !== '' ? biblId1.value.author[0].surname : result1;
                }
                if (typeof biblId2.value.author !== 'undefined' && biblId2.value.author.length > 0) {
                    //first try to compare according to author's name, then surname if provided
                    result2 = biblId2.value.author[0].name !== '' ? biblId2.value.author[0].name : '';
                    result2 = biblId2.value.author[0].surname !== '' ? biblId2.value.author[0].surname : result2;
                }
                break;

            case vm.sortBy.Year:
                //sorting by year
                if (typeof biblId1.value.date !== 'undefined') {
                    // If Number() returns Nan, whe must must be sure to assign empty string to result variable in order to
                    // provide the same sorting logic, element with no information are at the top of the final list.
                    // Infact: ''.localeCompare(...) => -1
                    result1 = biblId1.value.date !== '' && Number(biblId1.value.date) ? Number(biblId1.value.date) : '';
                }
                if (typeof biblId2.value.date !== 'undefined') {
                    result2 = biblId1.value.date !== '' && Number(biblId2.value.date) ? Number(biblId2.value.date) : '';
                }
                break;

            case vm.sortBy.Title:
                //sorting by analytic title or normale title
                if (typeof biblId1.value.titleAnalytic !== 'undefined') {
                    result1 = biblId1.value.titleAnalytic !== '' && result1 === '' ? biblId1.value.titleAnalytic : result1;
                }
                if (typeof biblId1.value.titleMonogr !== 'undefined') {
                    result1 = biblId1.value.titleMonogr !== '' && result1 === '' ? biblId1.value.titleMonogr : result1;
                }
                if (typeof biblId2.value.titleAnalytic !== 'undefined') {
                    result2 = biblId2.value.titleAnalytic !== '' && result2 === '' ? biblId2.value.titleAnalytic : result2;
                }
                if (typeof biblId2.value.titleMonogr !== 'undefined') {
                    result2 = biblId2.value.titleMonogr !== '' && result2 === '' ? biblId2.value.titleMonogr : result2;
                }
                break;

            case vm.sortBy.Publisher:
                if (typeof biblId1.value.publisher !== 'undefined') {
                    result1 = biblId1.value.publisher !== '' ? biblId1.value.publisher : '';
                }
                if (typeof biblId2.value.publisher !== 'undefined') {
                    result2 = biblId2.value.publisher !== '' ? biblId2.value.publisher : '';
                }
                break;
        }
        return result1.toString().localeCompare(result2.toString());
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
});
