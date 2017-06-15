angular.module('evtviewer.bibliography')

.controller('BibliographyCtrl', function($log, $scope) { 
    var _console = $log.getInstance('BibliographyCtrl');

    var vm = this;

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
                    /*/If Number() returns Nan, whe must must be sure to assign empty string to result variable in order to 
                    provide the same sorting logic, element with no information are at the top of the final list.
                    Infact: ''.localeCompare(...) => -1 /*/
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
});