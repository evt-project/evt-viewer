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
 * @requires evtviewer.core.config
 * @requires evtviewer.dataHandler.parsedData
**/
angular.module('evtviewer.navBar')

.provider('evtNavbar', function() {

    var defaults = this.defaults;

    this.setDefaults = function(_defaults) {
        defaults = _defaults;
    };

    var currentAppEntry = '';
	
	this.$get = function(config, parsedData) {
        var navBar     = {},
            collection = {},
            list       = [],
            idx        = 0;
        
        var number = 0;
		
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
         * @param {string} id string representing the id of scope navBar
         * @param {Object} scope initial scope of the directive
         *
         * @returns {Object} extended scope:
            <pre>
                var scopeHelper = {
                    // expansion
                    uid,
                    scopeWit,
                    appId,
                    parentAppId,
                    readingId,
                    readingType,
                    variance,
                    type,
                    attributes,
                    exponent,
                    showExponent,

                    over,
                    apparatus: {
                        opened,
                        content,
                        _loaded,
                        _subContentOpened,
                        inline
                    },
                    selected,
                    openTriggerEvent,
                    defaults
                };
            </pre>
         */
        navBar.build = function(id, scope) {
            var currentId  = idx++,
                entryId    = id || undefined,
                attributes = '',
                parentEntryId,
                showExponent = config.showReadingExponent;
            var scopeHelper = {};
            
            if (typeof(collection[currentId]) !== 'undefined') {
                return;
            }
            
            var exponent = parsedData.getCriticalEntryExponent(scope.appId);

            if (scope.readingId !== undefined){
                var aAttributes = parsedData.getReadingAttributes(scope.readingId, id) || [];
                for (var attr in aAttributes) {
                    if (attr !== 'wit' && attr !== 'xml:id'){
                        attributes += attr.toUpperCase()+': '+aAttributes[attr]+' - ';
                    }
                }
                if (attributes !== '') {
                    attributes = attributes.slice(0, -3);
                }
            }
            var appObj = parsedData.getCriticalEntryById(entryId);
            if (appObj && appObj._subApp) {
                parentEntryId = appObj._indexes._parentEntry || '';
            }

            scopeHelper = {
                // expansion
                uid              : currentId,
                scopeWit         : scope.scopeWit || '',
                appId            : entryId,
                parentAppId      : parentEntryId,
                readingId        : scope.readingId,
                firstPage        : scope.firstPage,
                lastPage         : scope.lastPage,
                currentPage      : scope.currentPage,
                attributes       : attributes,
                exponent         : exponent,
                showExponent     : showExponent,

                over             : false,
                apparatus        : {
                    opened            : false,
                    content           : {},
                    _loaded           : false,
                    _subContentOpened : 'criticalNote',
                    inline            : scope.inlineApparatus
                },
                selected         : entryId === reading.getCurrentAppEntry(),
                openTriggerEvent : angular.copy(defaults.openTriggerEvent),
                defaults         : angular.copy(defaults)
            };

            collection[currentId] = angular.extend(scope.vm, scopeHelper);
            list.push({
                id: currentId,
                entryId: entryId
            });

            return collection[currentId];
        };
		
        //le varie cose da far fare al provider sono da mettere qua
        return navBar;
    };
});