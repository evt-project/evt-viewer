/**
 * @ngdoc service
 * @module evtviewer.download
 * @name evtviewer.download.evtDownload
 * @description
 * # evtDownload
 * This provider expands the scope of the
 * {@link evtviewer.download.directive:evtDownload evtDownload} directive
 * and stores its reference untill the directive remains instantiated.
 * It also add some modules to controller, according to <code>&lt;evt-tabs-container&gt;</code> type.
 *
 * @requires $log
 * @requires evtviewer.dataHandler.parsedData
 * @requires evtviewer.interface.evtInterface
**/
angular.module('evtviewer.download')

.provider('evtDownload', function() {

	var defaults = this.defaults;

	this.setDefaults = function(_defaults) {
		defaults = _defaults;
	};

	this.$get = function($log, config) {
		var download = {},
			collection = {},
			list = [],
			idx = 0;

		var _console = $log.getInstance('download');

		download.build = function(scope) {
			var currentId = idx++;
			if (collection[currentId]) {
				return;
			}
			var downloadableFiles = config.downloadableFiles || [],
					files = [];
			angular.forEach(downloadableFiles, function(file) {
				if (file.title && Object.keys(file.formats).length > 0) {
					files.push(file);
				}
			});
			if (files.length === 0) {
				files.push({ title: config.indexTitle || 'Edition', formats: { xml: config.dataUrl }});
			}
			var scopeHelper = {
				files: files,
				currentDocIndex: 0,
				currentFormat: Object.keys(files[0].formats)[0]
			};
			collection[currentId] = angular.extend(scope.vm, scopeHelper);
			list.push({
				id: currentId
			});

			return collection[currentId];
		};

		download.destroy = function(tempId) {
			delete collection[tempId];
		}

		return download;
	};

});
