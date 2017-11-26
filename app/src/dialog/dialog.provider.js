/**
 * @ngdoc service
 * @module evtviewer.dialog
 * @name evtviewer.dialog.evtDialog
 * @description 
 * # evtDialog
 * This provider expands the scope of the
 * {@link evtviewer.dialog.directive:evtDialog evtDialog} directive 
 * and stores its reference untill the directive remains instantiated.
 * @requires $log
**/
angular.module('evtviewer.dialog')

.provider('evtDialog', function() {

	var defaults = this.defaults;

	this.setDefaults = function(_defaults) {
		defaults = _defaults;
	};
	/**
	 * @ngdoc object
	 * @module evtviewer.dialog
	 * @name evtviewer.dialog.controller:DialogCtrl
	 * @description 
	 * # DialogCtrl
	 * <p>This is controller for the {@link evtviewer.dialog.directive:evtDialog evtDialog} directive. </p>
	 * <p>It is not actually implemented separately but its methods are defined in the 
	 * {@link evtviewer.dialog.evtDialog evtDialog} provider 
	 * where the scope of the directive is extended with all the necessary properties and methods
	 * according to specific values of initial scope properties.</p>
	 **/
	this.$get = function($log) {
		var dialog = {},
			collection = {},
			list = [],
			idx = 0;

		var _console = $log.getInstance('dialog');

		// 
		// Control function
		// 
		/**
	     * @ngdoc method
	     * @name evtviewer.dialog.controller:DialogCtrl#open
	     * @methodOf evtviewer.dialog.controller:DialogCtrl
	     *
	     * @description
	     * <p>Open the dialog.</p>
	     * <p>This method is defined and attached to controller scope in the 
		 * {@link evtviewer.dialog.evtDialog evtDialog} provider file.</p>
	     */
		var open = function() {
			var vm = this;
			vm.opened = true;
		};
		/**
	     * @ngdoc method
	     * @name evtviewer.dialog.controller:DialogCtrl#close
	     * @methodOf evtviewer.dialog.controller:DialogCtrl
	     *
	     * @description
	     * <p>Close the dialog.</p>
	     * <p>This method is defined and attached to controller scope in the 
		 * {@link evtviewer.dialog.evtDialog evtDialog} provider file.</p>
	     */
		var close = function() {
			var vm = this;
			vm.opened = false;
		};
		/**
	     * @ngdoc method
	     * @name evtviewer.dialog.controller:DialogCtrl#setTitle
	     * @methodOf evtviewer.dialog.controller:DialogCtrl
	     *
	     * @description
	     * <p>Set dialog title.</p>
	     * <p>This method is defined and attached to controller scope in the 
		 * {@link evtviewer.dialog.evtDialog evtDialog} provider file.</p>
		 *
	     * @param {string} newTitle new title to set for dialog
	     */
		var setTitle = function(newTitle) {
			var vm = this;
			vm.title = newTitle;
		};
		/**
	     * @ngdoc method
	     * @name evtviewer.dialog.controller:DialogCtrl#updateContent
	     * @methodOf evtviewer.dialog.controller:DialogCtrl
	     *
	     * @description
	     * <p>Set dialog content.</p>
	     * <p>This method is defined and attached to controller scope in the 
		 * {@link evtviewer.dialog.evtDialog evtDialog} provider file.</p>
		 *
	     * @param {string} newContent string representing new HTML content to be compiled and shown in main body content
	     */
		var updateContent = function(newContent) {
			var vm = this;
			vm.content = newContent;
		};
		/**
	     * @ngdoc method
	     * @name evtviewer.dialog.controller:DialogCtrl#destroy
	     * @methodOf evtviewer.dialog.controller:DialogCtrl
	     *
	     * @description
	     * <p>Remove instance from saved instances in {@link evtviewer.dialog.evtDialog evtDialog} provider.</p>
		 * <p>This method is defined and attached to controller scope in the 
		 * {@link evtviewer.dialog.evtDialog evtDialog} provider file.</p>
	     */
		var destroy = function() {
			var tempId = this.uid;
			// this.$destroy();
			delete collection[tempId];
			// _console.log('vm - destroy ' + tempId);
		};

		// 
		// Dialog builder
		// 
		/**
	     * @ngdoc method
	     * @name evtviewer.dialog.evtDialog#build
	     * @methodOf evtviewer.dialog.evtDialog
	     *
	     * @description
	     * <p>This method will extend the scope of {@link evtviewer.dialog.directive:evtDialog evtDialog} directive 
	     * according to selected configurations and parsed data.</p>
		 * 
		 * @param {Object} scope initial scope of the directive:
		 	<pre>
				var scope: {
		            id      : '@',
		            type    : '@',
		            title   : '@',
		            opened  : '@'
		        };
		 	</pre>
		 *
		 * @returns {Object} extended scope:
		 	<pre>
				var scopeHelper = {
					// expansion
					uid,
					defaults,

					// model
					type,
					content,
					title,
					opened,

					// function
					open,
					close,
					setTitle,
					updateContent,
					destroy
				};
		 	</pre>
	     */
		dialog.build = function(scope) {
			var currentId = scope.id || idx++,
				currentType = scope.type || 'default',
				title = scope.title || '',
				opened = scope.opened || false,
				content;

			var scopeHelper = {};

			if (typeof(collection[currentId]) !== 'undefined') {
				return;
			}

			scopeHelper = {
				// expansion
				uid: currentId,
				defaults: angular.copy(defaults),

				// model
				type: currentType,
				content: content,
				title: title,
				opened: opened,

				// function
				open: open,
				close: close,
				setTitle: setTitle,
				updateContent: updateContent,
				destroy: destroy
			};

			collection[currentId] = angular.extend(scope.vm, scopeHelper);
			list.push({
				id: currentId,
				type: currentType
			});

			return collection[currentId];
		};


		//
		// Service function
		//
		/**
	     * @ngdoc method
	     * @name evtviewer.dialog.evtDialog#getById
	     * @methodOf evtviewer.dialog.evtDialog
	     *
	     * @description
	     * Get the reference of the instance of a particular <code>&lt;evt-dialog&gt;</code>.
		 *
		 * @param {string} currentId id of dialog to retrieve
		 *
		 * @returns {Object} reference of the instance of <code>&lt;evt-dialog&gt;</code> with given id
	     */ 
		dialog.getById = function(currentId) {
			if (collection[currentId] !== 'undefined') {
				return collection[currentId];
			}
		};
		/**
	     * @ngdoc method
	     * @name evtviewer.dialog.evtDialog#getList
	     * @methodOf evtviewer.dialog.evtDialog
	     *
	     * @description
	     * Get the list of all the instance of <code>&lt;evt-dialog&gt;</code>.
		 *
		 * @returns {array} array of ids of all the instance of <code>&lt;evt-dialog&gt;</code>.
	     */
		dialog.getList = function() {
			return list;
		};
		/**
	     * @ngdoc method
	     * @name evtviewer.dialog.evtDialog#getListByType
	     * @methodOf evtviewer.dialog.evtDialog
	     *
	     * @description
	     * Get the references of the instance of a all <code>&lt;evt-dialog&gt;</code>s of a particular type.
		 *
		 * @param {string} type type of dialogs to retrieve
		 *
		 * @returns {array} array of references of the instance of <code>&lt;evt-dialog&gt;</code>s of given type
	     */
		dialog.getListByType = function(type) {
			var listType = [];
			for (var i in collection) {
				if (collection[i].type === type) {
					listType.push(collection[i]);
				}
			}
			return listType;
		};
		/**
	     * @ngdoc method
	     * @name evtviewer.dialog.evtDialog#openByType
	     * @methodOf evtviewer.dialog.evtDialog
	     *
	     * @description
	     * Open all <code>&lt;evt-dialog&gt;</code>s of a particular type.
		 *
		 * @param {string} type type of dialogs to open
	     */
		dialog.openByType = function(type) {
			for (var i in collection) {
				if (collection[i].type === type) {
					collection[i].open();
				}
			}
		};
		/**
	     * @ngdoc method
	     * @name evtviewer.dialog.evtDialog#closeByType
	     * @methodOf evtviewer.dialog.evtDialog
	     *
	     * @description
	     * Close all <code>&lt;evt-dialog&gt;</code>s of a particular type.
		 *
		 * @param {string} type type of dialogs to close
	     */
		dialog.closeByType = function(type) {
			for (var i in collection) {
				if (collection[i].type === type) {
					collection[i].close();
				}
			}
		};
		/**
	     * @ngdoc method
	     * @name evtviewer.dialog.evtDialog#closeAll
	     * @methodOf evtviewer.dialog.evtDialog
	     *
	     * @description
	     * Close all <code>&lt;evt-dialog&gt;</code>s.
	     */
		dialog.closeAll = function() {
			for (var i in collection) {
				if (collection[i].close() !== undefined) {
					collection[i].close();
				}
			}
		};
		return dialog;
	};
});