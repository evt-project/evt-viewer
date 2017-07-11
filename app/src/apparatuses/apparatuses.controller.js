angular.module('evtviewer.apparatuses')

.controller('apparatusesCtrl', function($timeout, evtApparatuses, $scope) {
	var vm = this;

	this.setCurrentApparatus = function(appId) {
		if (appId !== vm.currentApparatus && vm.apparatuses[appId]) {
			vm.loading = true;
			vm.currentApparatus = appId;
			vm.apparatuses[appId].visibleList = vm.apparatuses[appId].list.slice(0, 10);
			$timeout(function() {
				vm.loading = false;
			});
		}
	};

	this.getCurrentApparatus = function() {
		return vm.currentApparatus;
	};

	this.toggleAppStructure = function(appStructure) {
		if (vm.appStructure !== appStructure) {
			vm.appStructure = appStructure;
		}
	};

	this.toggleOpenApparatus = function(apparatus) {
		if (vm.openApparatus !== apparatus) {
			vm.openApparatus = apparatus;
		}
	};

	this.getVisibleList = function(app) {
		return vm.apparatuses[app] ? vm.apparatuses[app].visibleList : [];
	};

	this.getAppList = function(app) {
		return vm.apparatuses[app] ? vm.apparatuses[app].list : [];
	};

	this.loadMoreElements = function() {
		var appId = vm.currentApparatus,
            last = vm.apparatuses[appId].visibleList.length,
            i = 0; 
        while (i < 5 && i < vm.apparatuses[appId].list.length) {
            var newElement = vm.apparatuses[appId].list[last+i];
            if (newElement && vm.apparatuses[appId].visibleList.indexOf(newElement) <= 0) {
                vm.apparatuses[appId].visibleList.push(newElement);                    
            }
            i++;
        }
    };

	this.destroy = function() {
		evtApparatuses.destroy(this.uid);
	};
});