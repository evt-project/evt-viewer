angular.module('evtviewer.analoguesApparatusEntry')

.controller('analoguesApparatusEntryCtrl', function(evtAnaloguesApparatusEntry, evtInterface, evtAnalogue, evtBox, evtApparatuses, parsedData) {
	var vm = this;

	/**********************/
	/*toggleSource(source)*/
	/***************************/
	/*Set the new active source*/
	/***************************/
	this.toggleSource = function(sourceId) {
		if (vm._activeSource !== sourceId) {
			vm._activeSource = sourceId;
			//Reset the tabs for that source
			vm.tabs = {
				_indexes: []
			};
			//Copy the source tabs into the directive tabs
			var currentTabs = vm.srcList[vm._activeSource].tabs;
			for (var i = 0; i < currentTabs._indexes.length; i++) {
				var value = currentTabs._indexes[i];
				vm.tabs._indexes.push(currentTabs._indexes[i]);
				vm.tabs[value] = currentTabs[value];
			}
		}
	};

	this.toggleOverSource = function($event, sourceId) {
		//$event.stopPropagation();
		if (vm._overSource !== sourceId) {
			vm._overSource = sourceId;
		} else {
			vm._overSource = '';
		}
	};

	this.getActiveSourceAbbr = function(activeSourceId) {
		for (var i = 0; i < vm.sources.length; i++) {
			if (vm.sources[i].id === activeSourceId) {
				return vm.sources[i].abbr;
			}
		}
	};

	this.toggleSubContent = function(subContentName) {
		if (vm._subContentOpened !== subContentName) {
			vm._subContentOpened = subContentName;
		} else {
			vm._subContentOpened = '';
		}
	};

	this.mouseOver = function() {
		vm.over = true;
	};

	this.mouseOut = function() {
		vm.over = false;
	};

	this.setSelected = function() {
		vm.selected = true;
	};

	this.unselect = function() {
		vm.selected = false;
	};

	this.isSelect = function() {
		if (evtInterface.getCurrentAnalogue() === vm.analogueId) {
			return true;
		} else {
			return vm.selected;
		}
	};

	this.closeSubContent = function() {
		vm._subContentOpened = '';
	};

	this.toggleOverAnaloguesEntries = function($event) {
		$event.stopPropagation();
		if (vm.over === false) {
			evtAnaloguesApparatusEntry.mouseOverByAnalogueId(vm.analogueId);
			if (vm.currentViewMode === 'readingTxt') {
				evtAnalogue.mouseOverByAnalogueId(vm.analogueId);
			}
		} else {
			evtAnaloguesApparatusEntry.mouseOutAll();
		}
	};

	this.callbackClick = function($event) {
		$event.stopPropagation();
		if (vm.currentViewMode === 'readingTxt') {
			evtAnaloguesApparatusEntry.unselectAll();
			evtAnaloguesApparatusEntry.selectById(vm.analogueId);
			evtAnalogue.selectById(vm.analogueId);
		}
	};

	this.alignAnalogues = function() {
		evtBox.alignScrollToAnalogue(vm.analogueId);
		evtApparatuses.alignScrollToAnalogue(vm.analogueId);
		evtAnalogue.selectById(vm.analogueId);
	};

	this.destroy = function() {
		evtAnaloguesApparatusEntry.destroy(this.uid);
	};
});