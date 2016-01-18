angular.module('evtviewer.reading')

.directive('evtReading', function(evtReading, parsedData) {
    return {
        restrict: 'E',
        scope: {
            appId       : '@',
            readingType : '@',
            variance    : '@'
        },
        transclude: true,
        templateUrl: 'src/reading/reading.directive.tmpl.html',
        controllerAs: 'vm',
        controller: 'ReadingCtrl',
        link: function(scope, element, attrs){
            // Initialize reading
            
            var currentReading = evtReading.build(scope.appId, scope);

            if (scope.vm.variance !== undefined) {
                var readingElem = angular.element(element).find('.reading')[0];
                var totWits = parsedData.getWitnesses().length,
                    opacity = scope.vm.variance/totWits;
                angular.element(readingElem).css('background', 'rgba(255, 138, 101, '+opacity+')');
            }

            // Add entr attributes to scope
            scope.vm.entryAttr = {};
            for(var i = 0; i < element.context.attributes.length; i++){
                var name  = element.context.attributes[i].nodeName,
                    value = element.context.attributes[i].nodeValue;
                if (name.indexOf('data-entry-attr-') >= 0) {
                    name = name.replace('data-entry-attr-', '');
                    scope.vm.entryAttr[name] = value;
                }
            }

            scope.vm.toggleTooltipHover = function(e, vm) {
                e.stopPropagation();
                vm.toggleTooltipOver();
            };

            scope.vm.resizeTooltip = function(e, settings){
                e.stopPropagation();
                
                var trigger = element,
                    tooltip = angular.element(element).find('span.reading__apparatus').last(),
                    before  = angular.element(tooltip).find('.reading__apparatus__before');

                // Recuperare x e y del click del mouse
                var x = e.clientX,
                    y = e.clientY;

                // Rimuovere gli stili inline del tooltip in quanto la posizione va ricalcolata ogni volta
                // Mettere magari nella funzione di chiusura?
                // Recupero gli elementi 
                
                tooltip.removeAttr('style');

                // Prendere altezza, larghezza e offset superiore e sinistro del trigger 
                // [NB: vanno gestiti trigger spezzati su piu righe]
                var triggerHeight           = trigger.height(),
                    triggerHeightSingleLine = trigger.css('font-size').substr(0,2)*1+1,
                    triggerWidth            = trigger.width(),
                    triggerTop              = trigger.position().top,
                    triggerLeft             = trigger.position().left;
                
                // Prendere larghezza, altezza e offset superiore e sinistro del tooltip
                // Mi servono la larghezza e l'altezza reali, quindi devo mettere il tooltip in posizione relativa
                // L'offset superiore 
                var tooltipTop        = tooltip.offset().top,
                    tooltipRealWidth  = tooltip.outerWidth(),
                    tooltipRealHeight = tooltip.outerHeight();

                // Confrontare la larghezza reale del tooltip con un valore massimo di default (qui 200px)
                // Se maggiore, impostarla uguale a tale larghezza
                // poi rimettere il tooltip in posizione assoluta
                if ( tooltipRealWidth > settings.tooltipMaxWidth ) {
                    tooltip
                        .css({
                            'width'     : settings.tooltipMaxWidth+'px',
                            'max-width' : settings.tooltipMaxWidth+'px'
                        });
                } 
                
                tooltip
                    .css({
                        'position' : 'absolute'
                    });

                // Quindi prendere nuovamente le dimensioni del tooltip
                tooltipRealWidth  = tooltip.outerWidth();
                tooltipRealHeight = tooltip.outerHeight();

                // Spostare il tooltip, prima allineando la metà al punto in cui si è verificato il click
                // poi spostandolo a sinistra se supera il margine destro del contenitore
                // o a destra se supera il margine sinistro.
                var boxOffsetLeft     = element.parents('.box-body').offset().left,
                    boxContainerWidth = element.parents('.box-body').innerWidth();
                
                var tooltipNewLeft = (x-boxOffsetLeft) - (tooltipRealWidth/2),
                    diff;
                
                tooltip
                    .css({
                        'left' : tooltipNewLeft+'px'
                    });

                // Se il tooltip supera a destra il margine destro del contenitore
                // ricalcolo il suo offset sinistro in base a quanto "sporge" a destra
                if ( (tooltipNewLeft + tooltipRealWidth) > boxContainerWidth ) {
                    diff           = (tooltipNewLeft + tooltipRealWidth) - boxContainerWidth;
                    tooltipNewLeft = tooltipNewLeft - diff - 20; // 10px margin right
                    tooltip
                        .css({
                            'left' : tooltipNewLeft+'px'
                        });
                }

                // Se supera a sinistra il margine sinistro del contenitore
                // imposto a 0 l'offset sinistro
                if ( tooltipNewLeft < 0 ) {
                    tooltipNewLeft = 0;
                    tooltip
                        .css({
                            'left' : tooltipNewLeft+'px'
                        });
                }

                // Se il tooltip supera il margine inferiore del contenitore
                // lo apro al di sopra del trigger
                // impostando il margine superiore negativo sulla base di
                // sua altezza + altezza del trigger (+ altezza del before) + pixel di scarto

                var boxContainerHeight  = element.parents('.box-body').outerHeight(),
                    tooltipOffsetBottom = triggerTop + triggerHeight + tooltipRealHeight,
                    tooltipNewMarginTop, 
                    diffClientYTriggerTop;

                if ( tooltipOffsetBottom > boxContainerHeight ) { // OPEN UP
                    tooltipNewMarginTop = tooltipRealHeight + triggerHeight + 10;
                    
                    // Riposiziono il tooltip se il testo del trigger si spezza su più linee
                    // In base alla posizione y del mouse
                    if ( triggerHeight > triggerHeightSingleLine ) {
                        diffClientYTriggerTop = y - trigger.offset().top;
                        tooltipNewMarginTop   = tooltipNewMarginTop - diffClientYTriggerTop + 10;
                    }
                    tooltip
                        .css({
                            'margin-top' : (-tooltipNewMarginTop)+'px'
                        })
                        .addClass('open-up');
                    before.css({
                        top: (tooltip.outerHeight()+4)+'px'
                    });
                } else {
                    // Riposiziono il tooltip se il testo del trigger si spezza su più linee
                    // In base alla posizione y del mouse
                    tooltip.removeClass('open-up');
                    if ( triggerHeight > triggerHeightSingleLine ) {
                        diffClientYTriggerTop = y - trigger.offset().top;
                        diff                  = (triggerHeight - triggerHeightSingleLine) - diffClientYTriggerTop;
                        tooltip.css({
                            'margin-top' : -diff+'px'
                        });
                    } else {
                       tooltip.css({
                            'margin-top' : '7px'
                        }); 
                    }
                }

                // Riposiziono orizzontalmente l'elemento .before in base al click del mouse
                // [Valutare se utilizzarlo]
                var beforeNewLeft = x - boxOffsetLeft - tooltipNewLeft - 20;
                if (beforeNewLeft < 0) { beforeNewLeft = 1; }
                // beforeWidth = 20;
                // beforeMarginRight = x+beforeWidth;
                // tooltipMarginRight = tooltip.offset().left + tooltip.width();
                // if ( beforeMarginRight > tooltipMarginRight){
                //     beforeNewLeft = (beforeMarginRight - tooltipMarginRight );
                //     console.log(tooltipMarginRight);
                // }
                
                before.css({ 
                    'left': beforeNewLeft+'px'
                });
                
                // Ultimo controllo finale per la larghezza del tooltip
                tooltipRealWidth = tooltip.width();
                if( tooltipRealWidth > settings.tooltipMaxWidth ){
                    tooltip.css({
                        'width'     : settings.tooltipMaxWidth+'px',
                        'max-width' : settings.tooltipMaxWidth+'px'
                    });
                }
            };
            // Garbage collection
            scope.$on('$destroy', function() {
                if (currentReading){
                    currentReading.destroy();
                }     
            });
        }
    };
})
.directive('evtWitnessRef', function(evtReading, parsedData, evtInterface) {
    return {
        restrict: 'E',
        require: '^evtReading',
        scope: {
            witness : '@'
        },
        transclude: true,
        templateUrl: 'src/reading/reading.witnessRef.directive.tmpl.html',
        link: function(scope, element, attrs){
            // Initialize reading
            scope.scopeWit = scope.$parent.$parent.vm.witness;
            
            if (scope.scopeWit === scope.witness) {
                scope.title = scope.witness+' is the current witness';
            } else {
                scope.title = 'Open witness '+scope.witness+' next to this box';
            }
            scope.openWit = function(){
                var newWit = scope.witness,
                    scopeWit = scope.scopeWit;
                if (evtInterface.getCurrentView !== 'critical') {
                    evtInterface.updateCurrentViewMode('critical');
                }
                if (newWit !== scopeWit) {
                    var witnesses = evtInterface.getCurrentWitnesses(),
                        scopeWitnessIndex = witnesses.indexOf(scopeWit);
                    if ( witnesses.indexOf(newWit) >= 0 ) {
                        evtInterface.removeWitness(newWit);
                    }
                    if (scopeWitnessIndex !== undefined) {
                        evtInterface.addWitnessAtIndex(newWit, scopeWitnessIndex+1);
                    }
                    evtInterface.updateUrl();
                }
            };
        }
    };
})
;