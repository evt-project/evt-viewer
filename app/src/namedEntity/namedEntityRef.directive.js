/**
 * @ngdoc directive
 * @module evtviewer.namedEntity
 * @name evtviewer.namedEntity.directive:evtNamedEntityRef
 * @description 
 * # evtNamedEntityRef
 * <p>Simple container representing a named entity occurrence. It is strictly connected to a specific
 * named entity and allows the user to quickly access all the details about it.
 * <p>The {@link evtviewer.namedEntity.controller:NamedEntityRefCtrl controller} for this directive is dynamically defined 
 * inside the {@link evtviewer.namedEntity.evtNamedEntityRef evtNamedEntityRef} provider file.</p>
 *
 * @scope
 * @param {string=} entityId id of named entity to be shown
 * @param {string=} entityType type of named entity ('person', 'place', 'org', 'generic')
 *
 * @restrict E
 * @requires evtviewer.namedEntity.evtNamedEntityRef
**/
angular.module('evtviewer.namedEntity')

.directive('evtNamedEntityRef', function(evtNamedEntityRef) {
    return {
        restrict: 'E',
        scope: {
            entityId   : '@',
            entityType : '@'
        },
        transclude: true,
        templateUrl: 'src/namedEntity/namedEntityRef.directive.tmpl.html',
        link: function(scope, element, attrs){
            // Initialize namedEntity
            scope.vm = {
                entityId: scope.entityId,
                entityType: scope.entityType
            };
            var currentNamedEntity = evtNamedEntityRef.build(scope.entityId, scope);
            

            var entityElement = element.find('.namedEntityRef'),
                detailsElement = element.find('.namedEntityRef__details');
            /**
             * @ngdoc method
             * @name evtviewer.namedEntity.controller:NamedEntityRefCtrl#toggleActive
             * @methodOf evtviewer.namedEntity.controller:NamedEntityRefCtrl
             *
             * @description
             * Toggle the "active" class of named entity ref element.
             * (This was necessary to cut down the number of watchers)
             */
            scope.vm.toggleActive = function() {
                if (scope.vm.active) {
                    entityElement.addClass('active');
                    detailsElement.addClass('active');
                } else {
                    entityElement.removeClass('active');
                    detailsElement.removeClass('active');
                }
            };
            /**
             * @ngdoc method
             * @name evtviewer.namedEntity.controller:NamedEntityRefCtrl#toggleHighlight
             * @methodOf evtviewer.namedEntity.controller:NamedEntityRefCtrl
             *
             * @description
             * Toggle the "highlighted" class of named entity ref element.
             * (This was necessary to cut down the number of watchers)
             */
            scope.vm.toggleHighlight = function(toggle) {
                if (toggle) {
                    entityElement.addClass('highlighted');
                } else {
                    entityElement.removeClass('highlighted');
                }
            };
            /**
             * @ngdoc method
             * @name evtviewer.namedEntity.controller:NamedEntityRefCtrl#updateDetailsPosition
             * @methodOf evtviewer.namedEntity.controller:NamedEntityRefCtrl
             *
             * @description
             * Update position of tooltip containing named entity details. This function is used only
             * if the editor-user chose to show details in tooltip instead than in inline mode.
             * @param {$event} e event representing the click on trigger
             * @param {Object} vm current scope 
             * @todo: Fix problems
             */
            scope.vm.updateDetailsPosition = function(e, vm) {
                if (vm.active) {
                    e.stopPropagation();
                    var trigger = element,
                        tooltip = angular.element(element).find('span.namedEntityRef__details').last(),
                        before  = angular.element(tooltip).find('.namedEntityRef__details-before');

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

                    var tooltipMaxWidth = 200;
                    // Confrontare la larghezza reale del tooltip con un valore massimo di default (qui 200px)
                    // Se maggiore, impostarla uguale a tale larghezza
                    // poi rimettere il tooltip in posizione assoluta
                    if ( tooltipRealWidth > tooltipMaxWidth ) {
                        tooltip
                            .css({
                                'width'     : tooltipMaxWidth+'px',
                                'max-width' : tooltipMaxWidth+'px'
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
                    var parentRef = element.parent();
                    var boxOffsetLeft     = element.parents(parentRef).offset().left,
                        boxContainerWidth = element.parents(parentRef).innerWidth();
                    
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
                        tooltipNewLeft = tooltipNewLeft - diff - 10;
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

                    var boxContainerHeight  = element.parents(parentRef).outerHeight(),
                        tooltipOffsetBottom = triggerTop + triggerHeight + tooltipRealHeight,
                        tooltipNewMarginTop, 
                        diffClientYTriggerTop;

                    if ( tooltipOffsetBottom > boxContainerHeight ) { // OPEN UP
                        tooltipNewMarginTop = tooltipRealHeight+triggerHeight+10;
                        
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
                            top: (tooltip.outerHeight()+2)+'px'
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
                                'margin-top' : '5px'
                            }); 
                        }
                        
                    }

                    // Riposiziono orizzontalmente l'elemento .before in base al click del mouse
                    // [Valutare se utilizzarlo]
                    var beforeNewLeft = x - tooltipNewLeft - boxOffsetLeft ;
                    
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
                    if( tooltipRealWidth > tooltipMaxWidth ){
                        tooltip.css({
                            'width'     : tooltipMaxWidth+'px',
                            'max-width' : tooltipMaxWidth+'px'
                        });
                    }
                }
            };

            // Garbage collection
            scope.$on('$destroy', function() {
                if (scope.vm.uid) {
                    evtNamedEntityRef.destroy(scope.vm.uid);
                }     
            });
        }
    };
});