angular.module('evtviewer.box')

.constant('BOXDEFAULTS', {

})

.service('box', function($rootScope, $log, BOXDEFAULTS) {
    var box = {};

    var _console = $log.getInstance('box');

    var state = {
        boxes: {}
    };

    box.addReference = function(scope) {
        var currentTitle = scope.boxtitle;
        if (typeof(state.boxes[currentTitle]) === 'undefined') {
            state.boxes[currentTitle] = {
                id: currentTitle,
                header: { 
                    selectors: [],
                    buttonSwitches: []
                },
                content: box.setContent(currentTitle)
            };            
            box.setHeaderElements(currentTitle);
        }
    };

    /* GET MOCK DATA*/
    box.setContent = function(currentTitle) {
        if (currentTitle === 'image') {
            return 'Image Box';
            // TO DO: check page selected
        } 
        else if (currentTitle === 'text') {
            return 'Lorem ipsum dolor sit amet, consectetur adipisici elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Salutantibus vitae elit libero, a pharetra augue. Non equidem invideo, miror magis posuere velit aliquet. Nec dubitamus multa iter quae et nos invenerat. Quam diu etiam furor iste tuus nos eludet? Pellentesque habitant morbi tristique senectus et netus. Idque Caesaris facere voluntate liceret: sese habere. Contra legem facit qui id facit quod lex prohibet. Mercedem aut nummos unde unde extricat, amaras. Contra legem facit qui id facit quod lex prohibet. Phasellus laoreet lorem vel dolor tempus vehicula. At nos hinc posthac, sitientis piros Afros. Tityre, tu patulae recubans sub tegmine fagi dolor. Gallia est omnis divisa in partes tres, quarum. Plura mihi bona sunt, inclinet, amari petere vellent. Pellentesque habitant morbi tristique senectus et netus. Nihilne te nocturnum praesidium Palati, nihil urbis vigiliae. Cum sociis natoque penatibus et magnis dis parturient. Idque Caesaris facere voluntate liceret: sese habere. Tu quoque, Brute, fili mi, nihil timor populi, nihil! Salutantibus vitae elit libero, a pharetra augue. Nec dubitamus multa iter quae et nos invenerat. Morbi odio eros, volutpat ut pharetra vitae, lobortis sed nibh. Morbi fringilla convallis sapien, id pulvinar odio volutpat. Lorem ipsum dolor sit amet, consectetur adipisici elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Salutantibus vitae elit libero, a pharetra augue. Non equidem invideo, miror magis posuere velit aliquet. Nec dubitamus multa iter quae et nos invenerat. Quam diu etiam furor iste tuus nos eludet? Pellentesque habitant morbi tristique senectus et netus. Idque Caesaris facere voluntate liceret: sese habere. Contra legem facit qui id facit quod lex prohibet. Mercedem aut nummos unde unde extricat, amaras. Contra legem facit qui id facit quod lex prohibet. Phasellus laoreet lorem vel dolor tempus vehicula. At nos hinc posthac, sitientis piros Afros. Tityre, tu patulae recubans sub tegmine fagi dolor. Gallia est omnis divisa in partes tres, quarum. Plura mihi bona sunt, inclinet, amari petere vellent. Pellentesque habitant morbi tristique senectus et netus. Nihilne te nocturnum praesidium Palati, nihil urbis vigiliae. Cum sociis natoque penatibus et magnis dis parturient. Idque Caesaris facere voluntate liceret: sese habere. Tu quoque, Brute, fili mi, nihil timor populi, nihil! Salutantibus vitae elit libero, a pharetra augue. Nec dubitamus multa iter quae et nos invenerat. Morbi odio eros, volutpat ut pharetra vitae, lobortis sed nibh. Morbi fringilla convallis sapien, id pulvinar odio volutpat. Lorem ipsum dolor sit amet, consectetur adipisici elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Salutantibus vitae elit libero, a pharetra augue. Non equidem invideo, miror magis posuere velit aliquet. Nec dubitamus multa iter quae et nos invenerat.';
            // TO DO: check page/doc/edition selected
        }
    };

    box.setHeaderElements = function(currentTitle){
        var currentSelectors = [];
        var currentButtonSwitches = [];

        if (currentTitle === 'image') {
            currentSelectors.push({ id:'page', type: 'page' });
            currentButtonSwitches.push({ title:'Thumbnails', label: 'Thumbs' });
        } 
        else if (currentTitle === 'text') {
            currentSelectors.push({ id:'document', type: 'document' });
            currentSelectors.push({ id:'editionLevel', type: 'edition'});            
        }
        
        state.boxes[currentTitle].header.selectors = currentSelectors;
        state.boxes[currentTitle].header.buttonSwitches = currentButtonSwitches;
    };
    /* END MOCK*/


    box.getReference = function(currentTitle) {
        if (state.boxes[currentTitle] !== 'undefined') {
            return state.boxes[currentTitle];
        }
    };

    _console.log('service running');

    return box;
});