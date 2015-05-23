angular.module('evtviewer.popover')

.directive('evtPopover', function(evtPopover) {
    return {
        restrict: 'E',
        scope: {
            trigger: '@',
            tooltip: '@'
        },
        transclude: true,
        templateUrl: 'src/popover/popover.directive.tmpl.html',
        controllerAs: 'vm',
        controller: 'PopoverCtrl',
        link: function(scope, element) {
            scope.vm.resizeTooltip = function(e, settings){
                var trigger, tooltip;
                trigger = element;
                tooltip = element.find('.popover_tooltip').first();

                // var before;
                // before = tooltip.find('> .before');

                // Recuperare x e y del click del mouse
                var x = e.clientX;
                var y = e.clientY;

                // Rimuovere gli stili inline del tooltip in quanto la posizione va ricalcolata ogni volta
                // Mettere magari nella funzione di chiusura?
                // Recupero gli elementi 
                tooltip.removeAttr('style');

                // Prendere altezza, larghezza e offset superiore e sinistro del trigger 
                // [NB: vanno gestiti trigger spezzati su piu righe]
                var triggerHeight, triggerTop, triggerLeft, triggerWidth;
                var triggerHeightSingleLine;
                triggerHeight = trigger.height();
                triggerHeightSingleLine = trigger.css('font-size').substr(0,2)*1+1;
                triggerWidth = trigger.width();
                triggerTop = trigger.position().top;
                triggerLeft = trigger.position().left;
                
                // Prendere larghezza, altezza e offset superiore e sinistro del tooltip
                // Mi servono la larghezza e l'altezza reali, quindi devo mettere il tooltip in posizione relativa
                // L'offset superiore 
                var tooltipTop, tooltipRealWidth, tooltipRealHeight;
                tooltipTop = tooltip.offset().top;
                tooltipRealWidth = tooltip.outerWidth();

                // Confrontare la larghezza reale del tooltip con un valore massimo di default (qui 200px)
                // Se maggiore, impostarla uguale a tale larghezza
                // poi rimettere il tooltip in posizione assoluta
                if ( tooltipRealWidth > settings.tooltipMaxWidth ) {
                    tooltip
                        .css({
                            'width' : settings.tooltipMaxWidth+'px',
                            'max-width' : settings.tooltipMaxWidth+'px'
                        });
                } 
                
                tooltip
                    .css({
                        'position' : 'absolute'
                    });

                // Quindi prendere nuovamente le dimensioni del tooltip
                tooltipRealWidth = tooltip.outerWidth();
                tooltipRealHeight = tooltip.outerHeight();

                // Spostare il tooltip, prima allineando la metà al punto in cui si è verificato il click
                // poi spostandolo a sinistra se supera il margine destro del contenitore
                // o a destra se supera il margine sinistro.
                var boxContainerWidth, boxOffsetLeft;
                boxOffsetLeft = element.parents('.box').position().left;
                boxContainerWidth = element.parents('.box').width();
                
                var tooltipNewLeft, diff;                
                tooltipNewLeft = (x-boxOffsetLeft) - (tooltipRealWidth/2);
                tooltip
                    .css({
                        'left' : tooltipNewLeft+'px'
                    });

                // Se il tooltip supera a destra il margine destro del contenitore
                // ricalcolo il suo offset sinistro in base a quanto "sporge" a destra

                if ( (tooltipNewLeft + tooltipRealWidth) > boxContainerWidth ) {
                    diff = (tooltipNewLeft + tooltipRealWidth) - boxContainerWidth;
                    tooltipNewLeft = tooltipNewLeft - diff - 20; // 10px margin right

                    tooltip
                        .css({
                            'left' : tooltipNewLeft+'px'
                        });
                }

                // Se supera a sinistra il margine sinistro del contenitore
                // imposto a 0 l'offset sinistro
                if ( tooltipNewLeft < 0 ) {
                    tooltip
                        .css({
                            'left' : '0px'
                        });
                }

                // // Riposiziono orizzontalmente l'elemento .before in base al click del mouse
                // // [Valutare se utilizzarlo]
                // var beforeWidth, beforeNewLeft;
                // var beforeMarginRight, tooltipMarginRight;
                // beforeNewLeft = x;
                // beforeWidth = before.width();
                // beforeMarginRight = x+beforeWidth;
                // tooltipMarginRight = tooltip.offset().left + tooltip.width();
                // if ( beforeMarginRight > tooltipMarginRight){
                //     var diff = (beforeMarginRight - tooltipMarginRight );
                //     beforeNewLeft = x - diff;
                // }
                // before.offset({ left: beforeNewLeft-5});

                // Se il tooltip supera il margine inferiore del contenitore
                // lo apro al di sopra del trigger
                // impostando il margine superiore negativo sulla base di
                // sua altezza + altezza del trigger (+ altezza del before) + pixel di scarto

                var boxContainerHeight = element.parents('.box-body').outerHeight();
                var tooltipOffsetBottom = triggerTop + triggerHeight + tooltipRealHeight;
                var tooltipNewMarginTop, diffClientYTriggerTop ;

                if ( tooltipOffsetBottom > boxContainerHeight ) {
                    tooltipNewMarginTop = tooltipRealHeight+triggerHeight+10
                    
                    // Riposiziono il tooltip se il testo del trigger si spezza su più linee
                    // In base alla posizione y del mouse
                    if ( triggerHeight > triggerHeightSingleLine ) {
                        diffClientYTriggerTop = y - trigger.offset().top;
                        tooltipNewMarginTop = tooltipNewMarginTop - diffClientYTriggerTop + 10;
                    }
                    tooltip.css({
                        'margin-top' : (-tooltipNewMarginTop)+'px'
                    });
                } else {
                    // Riposiziono il tooltip se il testo del trigger si spezza su più linee
                    // In base alla posizione y del mouse
                    if ( triggerHeight > triggerHeightSingleLine ) {
                        diffClientYTriggerTop = y - trigger.offset().top;
                        diff = (triggerHeight - triggerHeightSingleLine) - diffClientYTriggerTop;
                        tooltip.css({
                            'margin-top' : -diff+'px'
                        });
                    }
                }

                // Ultimo controllo finale per la larghezza del tooltip
                tooltipRealWidth = tooltip.width();
                if( tooltipRealWidth > settings.tooltipMaxWidth ){
                    tooltip.css({
                        'width': settings.tooltipMaxWidth+'px',
                        'max-width': settings.tooltipMaxWidth+'px'
                    });
                }
            };
            
            
            // Initialize select
            var currentPopover = evtPopover.build(scope.trigger, scope.tooltip, scope.vm);


            // Garbage collection
            scope.$on('$destroy', function() {
                if (currentPopover){
                    currentPopover.destroy();
                }     
            });
        }
    };
});