/**
       * @ngdoc method
       * @name evtviewer.UItools.evtImageTextLinking#turnOffHTS
       * @methodOf evtviewer.UItools.evtImageTextLinking
       *
       * @description
       * Turn OFF Image-Text linking tool. 
       * The state of the tool is saved in {@link evtviewer.interface.evtInterface evtInterface} service using 
       * {@link evtviewer.interface.evtInterface#setToolStatus setToolStatus} method.
       * The current highlighted zone is set to *undefined* using the 
       * {@link evtviewer.interface.evtInterface#updateCurrentHighlightedZone updateCurrentHighlightedZone} method of
       * {@link evtviewer.interface.evtInterface evtInterface} service
       */
      ITLutils.turnOffHTS = function () {
        this.deactivateHotSpots();
        evtInterface.setToolStatus('HTS', 'inactive');
        evtInterface.updateCurrentHighlightedZone(undefined);
        this.switchingOffHighlightInImage();
        this.switchingOffHighlightInImageSelected();
        console.log("TurnOFFHTS");
        //document.getElementById("example-overlay").className = "nohighlight";

     };
