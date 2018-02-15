/**
 * @ngdoc directive
 * @module evtviewer.namedEntity
 * @name evtviewer.namedEntity.directive:evtNamedEntity
 * @description 
 * # evtNamedEntity
 * <p>Container that shows a named entity. The output is divided in two part:
 * <ul><li>a top sub container where the main text of the entity appears;</li>
 * <li>a bottom sub container where additional information 
 * (such as details about the entity, XML source code and occurrences list) are shown, 
 * properly divided into tabs.</li></ul></p>
 * <p> The details about the named entity are retrieved from 
 * {@link evtviewer.dataHandler.parsedData}.</p> 
 * <p>The type of named entity will determine the background color of the element itself</p>
 * <p>Available types are: **person**, **place**, **org** and **generic**</p>
 * <p>The {@link evtviewer.namedEntity.controller:NamedEntityCtrl controller} for this directive is dynamically defined 
 * inside the {@link evtviewer.namedEntity.evtNamedEntity evtNamedEntity} provider file.</p>
 *
 * @scope
 * @param {string=} entityId id of named entity to be shown
 * @param {string=} entityType type of named entity ('person', 'place', 'org', 'generic')
 * @param {string=} location ('list', mainText', 'pinned') [default: 'list']
 *
 * @restrict E
 * @requires evtviewer.namedEntity.evtNamedEntity
**/
angular.module('evtviewer.namedEntity')

.directive('evtNamedEntity', function(evtNamedEntity) {
    return {
        restrict: 'E',
        scope: {
            entityId   : '@',
            entityType : '@',
            location   : '@'
        },
        transclude: true,
        templateUrl: 'src/namedEntity/namedEntity.directive.tmpl.html',
        link: function(scope, element, attrs){
            // Initialize namedEntity
            scope.vm = {
                entityId: scope.entityId,
                entityType: scope.entityType,
                location: scope.location
            };
            var currentNamedEntity = evtNamedEntity.build(scope.entityId, scope);
            
            var entityElement = element.find('.namedEntity'),
                entityDetails = element.find('.namedEntity__details');

            /**
             * @ngdoc method
             * @name evtviewer.namedEntity.controller:NamedEntityCtrl#toggleState
             * @methodOf evtviewer.namedEntity.controller:NamedEntityCtrl
             *
             * @description
             * Toggle the state of named entity element ("*opened*" or "*closed*") by adding or removing a class.
             * (This was necessary to cut down the number of watchers)
             */
            scope.vm.toggleState = function() {
                if (scope.vm.opened) {
                    entityElement.addClass('opened');
                } else {
                    entityElement.removeClass('opened');
                }
            };
            /**
             * @ngdoc method
             * @name evtviewer.namedEntity.controller:NamedEntityCtrl#toggleSection
             * @methodOf evtviewer.namedEntity.controller:NamedEntityCtrl
             *
             * @description
             * Toggle the sub section opened on named entity's details by adding or removing a class with 
             * section name. (This was necessary to cut down the number of watchers)
             *
             * @param {string} section Named of section to toggle
             */
            scope.vm.toggleSection = function(section) {
                if (scope.vm[section]) {
                    entityDetails.addClass(section);
                } else {
                    entityDetails.removeClass(section);
                }
            };

            var headersElement = element.find('.namedEntity__details-headers'),
                panelsElement = element.find('.namedEntity__details-panels');
            
            /**
             * @ngdoc method
             * @name evtviewer.namedEntity.controller:NamedEntityCtrl#toggleSubContentClass
             * @methodOf evtviewer.namedEntity.controller:NamedEntityCtrl
             *
             * @description
             * Toggle the sub section opened on named entity's details by adding or removing a class 
             * to the sub content element. (This was necessary to cut down the number of watchers)
             */
            scope.vm.toggleSubContentClass = function() {
                var subContent = scope.vm._subContentOpened;
                var elementToRemoveClass = element.find('.namedEntity__details-header.active');
                elementToRemoveClass.removeClass('active');

                if (subContent !== '') {
                    var elementToAddClass = element.find('.namedEntity__details-header-'+subContent);
                    elementToAddClass.addClass('active');
                    headersElement.removeClass('closed');
                    panelsElement.removeClass('closed');
                } else {
                    headersElement.addClass('closed');
                    panelsElement.addClass('closed');
                }
            };

            // Garbage collection
            scope.$on('$destroy', function() {
                if (scope.vm.uid) {
                    evtNamedEntity.destroy(scope.vm.uid);
                }     
            });
        }
    };
});