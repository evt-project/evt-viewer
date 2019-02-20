/**
 * @ngdoc service
 * @module evtviewer.navBar
 * @name evtviewer.navBar.evtNavbar
 * @description 
 * # evtNavbar
 * This provider expands the scope of the
 * {@link evtviewer.navBar.directive:evtNavbar evtNavbar} directive 
 * and stores its reference untill the directive remains instantiated.
 *
 * @requires $log
 * @requires evtviewer.interface.evtInterface
 * @requires evtviewer.core.config
 * @requires evtviewer.dataHandler.parsedData
 * @requires evtviewer.select.evtSelect
**/
angular.module('evtviewer.navBar')

    .provider('evtNavbar', function () {

        var defaults = this.defaults;

        this.setDefaults = function (_defaults) {
            defaults = _defaults;
        };

        var currentAppEntry = '';

        this.$get = function (parsedData, evtInterface) {
            var navBar = {},
                collection = {},
                list = [],
                idx = 0;

            var number = 0;

            var destroy = function () {
                var tempId = this.uid;
                // this.$destroy();
                navBar.destroy(tempId);
            };
            // 
            // navBar builder
            // 
            /**
             * @ngdoc method
             * @name evtviewer.navBar.evtNavbar#build
             * @methodOf evtviewer.navBar.evtNavbar
             *
             * @description
             * <p>This method will extend the scope of {@link evtviewer.navBar.directive:evtNavbar evtNavbar} directive 
             * according to selected configurations.</p>
             *
             * @param {Object} scope initial scope of the directive
             *
             * @returns {Object} extended scope:
             */
            navBar.build = function (scope) {
                var currentId = idx++;
                var scopeHelper = {};

                if (typeof (collection[currentId]) !== 'undefined') {
                    return;
                }

                var pagesCollection = parsedData.getPages();
                var documentsCollection = parsedData.getDocuments();

                var doc = evtInterface.getState('currentDoc');
                var page = evtInterface.getState('currentPage');

                var pageSlider = {
                    value: 0,
                    options: {
                        floor: 0,
                        ceil: pagesCollection ? pagesCollection.length : 0,
                        translate: function (value, sliderId, label) {
                            var pageId = pagesCollection[value];
                            return pagesCollection[pageId] ? pagesCollection[pageId].label : value;
                        },
                        showSelectionBar: true,
                        hideLimitLabels: true
                    }
                };

                var updateOptions = function (options) {
                    var vm = this;
                    vm.pageSlider.options = options;
                };
                var updateOptionsValue = function (key, value) {
                    var vm = this;
                    vm.pageSlider.options = vm.pageSlider.options ? vm.pageSlider.options : {};
                    vm.pageSlider.options[key] = value;
                };
                var updatePage = function (value) {
                    var vm = this;
                    if (value) {
                        var pageId = vm.pagesCollection[value];
                        evtInterface.updateState('currentPage', pageId);
    
                        var currentDocument = evtInterface.getState('currentDoc');
                        var newPage = vm.pagesCollection[pageId];
                        if (newPage) {
                            if (newPage.docs.length > 0 && newPage.docs.indexOf(currentDocument) < 0) { // The page is not part of the document
                                evtInterface.updateState('currentDoc', newPage.docs[0]);
                            }
                            if (newPage.docs.length > 1) { //The page has two different docs
                                evtInterface.updateState('currentDoc', newPage.docs[0]);
                            }
                        }
                        evtInterface.updateUrl();
                    }
                };

                var updateSlider = function (value) {
                    var vm = this;
                    if (vm.pagesCollection) {
                        var pageIndex = vm.pagesCollection._indexes.indexOf(value);
                        if (vm.pageSlider.value !== pageIndex) {
                            vm.pageSlider.value = pageIndex;
                        }
                        if (vm.folio !== value) {
                            vm.folio = value;
                        }
                        vm.page = value;
                    }
                };


                scopeHelper = {
                    // Scope expansion
                    uid: currentId,
                    pageSlider: pageSlider,
                    pagesCollection: pagesCollection,
                    documentsCollection: documentsCollection,
                    page: page,
                    doc: doc,

                    // Functions
                    updateOptions: updateOptions,
                    updateSlider: updateSlider,
                    updatePage: updatePage,
                    updateOptionsValue: updateOptionsValue,
                    destroy: destroy
                };

                collection[currentId] = angular.extend(scope.vm, scopeHelper);
                list.push({
                    id: currentId
                });
                return collection[currentId];
            };

            navBar.destroy = function (tempId) {
                delete collection[tempId];
            };

            //le varie cose da far fare al provider sono da mettere qua
            return navBar;
        };
    });