angular.module('evtviewer.core')

.constant('XPATH', {
   getProseLineNodes: './/node()[self::pb or self::lb or self::head or self::head[type=\'sub\']]',
   getPoemLineNodes: './/node()[self::pb or self::l or self::head or self::head[type=\'sub\']]',
   
   getPrevLb:'count(preceding::lb)',
   
   getProseDiplomaticNodes: '//body//p//node()[self::g or self::text()][not((ancestor::corr or ancestor::reg or ancestor::expan or ancestor::ex))]',
   getDiplomaticChildNodes: './/node()[self::g or self::text()][not(ancestor::corr or ancestor::reg or ancestor::expan or ancestor::ex)]',
   
   getProseInterpretativeNodes: '//body//p//node()[self::g or self::text()][not(ancestor::sic or ancestor::orig or ancestor::abbr or ancestor::am)]',
   getInterpretativeChildNodes: './/node()[self::g or self::text()][not((ancestor::sic or ancestor::orig or ancestor::abbr or ancestor::am))]',
   //getCriticalChildNodes: './/((ns:lem | ns:rdg)[@wit]|text())',
   
   getCurrentTitle: 'string(.//ancestor::text/@n)',
   getCurrentTextNode: './/ancestor::text[1]',

   ns : {
      getProseLineNodes: './/node()[self::ns:pb or self::ns:lb or self::ns:head or self::ns:head[type=\'sub\']]',
      getPoemLineNodes: './/node()[self::ns:pb or self::ns:l or self::ns:head or self::ns:head[type=\'sub\']]',
      
      getPrevLb:'count(preceding::ns:lb)',
      
      getProseDiplomaticNodes: '//ns:body//ns:p//node()[self::ns:g or self::text()][not((ancestor::ns:corr or ancestor::ns:reg or ancestor::ns:expan or ancestor::ns:ex))]',
      getDiplomaticChildNodes: './/node()[self::ns:g or self::text()][not(ancestor::ns:corr or ancestor::ns:reg or ancestor::ns:expan or ancestor::ns:ex or ancestor::ns:note)]',
      
      getProseInterpretativeNodes: '//ns:body//ns:p//node()[self::ns:g or self::text()][not(ancestor::ns:sic or ancestor::ns:orig or ancestor::ns:abbr or ancestor::ns:am)]',
      getInterpretativeChildNodes: './/node()[self::ns:g or self::text()][not((ancestor::ns:sic or ancestor::ns:orig or ancestor::ns:abbr or ancestor::ns:am))]',
      //getCriticalChildNodes: './/((ns:lem | ns:rdg)[@wit]|text())',
      
      getCurrentTitle: 'string(.//ancestor::ns:text/@n)',
      getCurrentTextNode: './/ancestor::ns:text[1]',
   }
});
