/**
 * @ngdoc service
 * @module evtviewer.visColl
 * @name evtviewer.visColl.evtViscoll
 * @description 
 * # evtViscoll
 * This provider expands the scope of the
 * {@link evtviewer.visColl.directive:evtViscoll evtViscoll} directive 
 * and stores its reference untill the directive remains instantiated.
 *
 * @requires $log
 * @requires evtviewer.interface.evtInterface
 * @requires evtviewer.core.config
 * @requires evtviewer.dataHandler.parsedData
 * @requires evtviewer.select.evtSelect
**/
angular.module('evtviewer.visColl')

.provider('evtViscoll', function() {

    var defaults = this.defaults;

    this.setDefaults = function(_defaults) {
        defaults = _defaults;
    };

    var currentAppEntry = '';
	
	this.$get = function($log, $filter, config, parsedData, evtInterface, evtSelect, evtCommunication, xmlParser, $sce) {
        var visColl     = {},
            collection = {},
            list       = [],
            idx        = 0;
        
        var number = 0;
		
        var destroy = function() {
            var tempId = this.uid;
            // this.$destroy();
            visColl.destroy(tempId);
        };
		// 
        // visColl builder
        // 
        /**
         * @ngdoc method
         * @name evtviewer.visColl.evtViscoll#build
         * @methodOf evtviewer.visColl.evtViscoll
         *
         * @description
         * <p>This method will extend the scope of {@link evtviewer.visColl.directive:evtViscoll evtViscoll} directive 
         * according to selected configurations.</p>
         *
         * @param {Object} scope initial scope of the directive
         *
         * @returns {Object} extended scope:
         */
        visColl.build = function(scope) {
            var currentId  = idx++;
            var scopeHelper = {};
            
            if (typeof(collection[currentId]) !== 'undefined') {
                return;
            }
			
			
            var pagesCollection = parsedData.getPages();
			var documentsCollection = parsedData.getDocuments();
			
			
			var xmlDoc = evtInterface.getProperty('visCollStyleUrl');
			var doc = evtInterface.getState('currentDoc');
			var page = evtInterface.getState('currentPage');
			var imageS = parsedData.getSvgs();
			var svgs = imageS.svgs;
			var displayResult = function(){
				var vm = this;
				if (vm.imageS !== ''){
					vm.imageS = parsedData.getSvgs();
					return vm.imageS.svgs;
				}
				else return 'errore';
			};
			//var imageS = Object.values(parsedData.getSvgs());
			//var displayResult = function(){
				//var vm = this;
				//return parsedData.getSvgs();
				//};
			var svgAlert = function (svg) {
				function isInterestingKey(k) {
					return (k == 'x' || k == 'y' || k == 'fill');   
				};
				for (var i = 0; i < svg.childNodes.length; i++) {
					var child = svg.childNodes[i];
					if (child.nodeType == 1) {
					console.log(child.tagName);
					$.each(child.attributes, function (k, v) {
					if (isInterestingKey(v.name)) {console.log(v.name+'='+v.value);
					};
			});
			};
			};
		};			
			
			var htmlSvg = function(svg){
			var receptacle = document.createElement('div');
			var svgFragment = '<svg>' + svg + '</svg>';
			receptacle.innerHTML = '' + svgFragment;
			Array.prototype.slice.call(receptacle.childNodes[0].childNodes).forEach(function (svg) {
				document.getElementById('svg').appendChild(svg)})
			};
			
			
			
			var windowSaxon = function() {
				var vm = this;
				var prova = config.visCollTextUrl;
				var prova2 = config.visCollStyleUrl;
                if (vm.output) {
                    return vm.output;
                } else {
                    if (config.visCollTextUrl && config.visCollStyleUrl !== ''){
                        SaxonJS.transform({
                            stylesheetLocation: config.visCollStyleUrl,
                            sourceLocation: config.visCollTextUrl,
                            logLevel:10
                        }, function(output) {
                            vm.output = output.innerHTML;
                            //console.log('callback saxon', output);
                        });
                        /* open(config.visCollTextUrl, '_self');*/
                        /*return config.visCollTextUrl + ' con Open ogni click scatena eventi. Non riesco a far arrivare in output il file xml trasformato';*/
                    };
                }
            }; 
							
            scopeHelper = {
                // Scope expansion
                uid: currentId,
				pagesCollection: pagesCollection,
				documentsCollection: documentsCollection,
				page: page,
				doc: doc,
				imageS: imageS,
                output: undefined,
				svgs: svgs,
                // Functions
				displayResult: displayResult,
				windowSaxon: windowSaxon,
				htmlSvg: htmlSvg,
				svgAlert: svgAlert
            };

            collection[currentId] = angular.extend(scope.vm, scopeHelper);
            list.push({
                id: currentId
            });

            return collection[currentId];
        };
		
        visColl.destroy = function(tempId) {
            delete collection[tempId];
        };

        //le varie cose da far fare al provider sono da mettere qua
        return visColl;
    };
});