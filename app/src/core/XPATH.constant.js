angular.module('evtviewer.core')
   
   .constant('XPATH', {
      getLineNodes: './/node()[self:lb or self:p or self:pb or self:head]',
      //getProseLineNodes: './/node()[self::p or self::pb or self::lb or self::head]',
      //getPoemLineNodes: './/node()[self::pb or self::l or self::head]',
      
      getPrevLb:'count(preceding::lb)',
      getPrevBody:'count(.//preceding::body)',
      
      getDiplomaticNodes: '//body//node()[self::g or self::text()][not((ancestor::corr or ancestor::reg or ancestor::expan or ancestor::ex))]',
      //getProseDiplomaticNodes: '//body//p//node()[self::g or self::text()][not((ancestor::corr or ancestor::reg or ancestor::expan or ancestor::ex))]',
      //getDiplomaticChildNodes: './/node()[self::g or self::text()][not(ancestor::corr or ancestor::reg or ancestor::expan or ancestor::ex)]',
      
      getInterpretativeNodes: '//body//node()[self::g or self::text()][not(ancestor::sic or ancestor::orig or ancestor::abbr or ancestor::am)]',
      //getProseInterpretativeNodes: '//body//p//node()[self::g or self::text()][not(ancestor::sic or ancestor::orig or ancestor::abbr or ancestor::am)]',
      //getInterpretativeChildNodes: './/node()[self::g or self::text()][not((ancestor::sic or ancestor::orig or ancestor::abbr or ancestor::am))]',
      
      //getCriticalChildNodes: './/((ns:lem | ns:rdg)[@wit]|text())',
      
      //getCurrentTitle: 'string(.//ancestor::text/@n)',
      //getCurrentTitle:'.//ancestor::text/@n',
      getCurrentTextNode: './/ancestor::text[1]',
      
      ns : {
         getLineNodes: './/node()[ self::ns:lb or self::ns:p or self::ns:pb or self::ns:head]',
         //getProseLineNodes: './/node()[self::ns:p or self::ns:pb or self::ns:lb or self::ns:head]',
         //getPoemLineNodes: './/node()[self::ns:pb or self::ns:l or self::ns:head]',
         
         getPrevLb:'count(.//preceding::ns:lb)',
         getPrevBody:'count(.//preceding::ns:body)',
         
         getDiplomaticNodes: './/node()[self::ns:g or self::text()][not((ancestor::ns:corr or ancestor::ns:reg or ancestor::ns:expan or ancestor::ns:ex))]',
         //getProseDiplomaticNodes: '//ns:body//ns:p//node()[self::ns:g or self::text()][not((ancestor::ns:corr or ancestor::ns:reg or ancestor::ns:expan or ancestor::ns:ex))]',
         //getPoemDiplomaticNodes: '//ns:body//node()[self::ns:g or self::text()][not((ancestor::ns:corr or ancestor::ns:reg or ancestor::ns:expan or ancestor::ns:ex))]',
         //getDiplomaticChildNodes: './/node()[self::ns:g or self::text()][not(ancestor::ns:corr or ancestor::ns:reg or ancestor::ns:expan or ancestor::ns:ex or ancestor::ns:note)]',
         
         getInterpretativeNodes: './/node()[self::ns:g or self::text()][not(ancestor::ns:sic or ancestor::ns:orig or ancestor::ns:abbr or ancestor::ns:am)]',
         //getProseInterpretativeNodes: '//ns:body//ns:p//node()[self::ns:g or self::text()][not(ancestor::ns:sic or ancestor::ns:orig or ancestor::ns:abbr or ancestor::ns:am)]',
         //getPoemInterpretativeNodes: '//ns:body//node()[self::ns:g or self::text()][not(ancestor::ns:sic or ancestor::ns:orig or ancestor::ns:abbr or ancestor::ns:am)]',
         //getInterpretativeChildNodes: './/node()[self::ns:g or self::text()][not((ancestor::ns:sic or ancestor::ns:orig or ancestor::ns:abbr or ancestor::ns:am))]',
         
         //getCriticalChildNodes: './/((ns:lem | ns:rdg)[@wit]|text())',
         
         //getCurrentTitle: 'string(.//ancestor::ns:text/@n)',
         getCurrentTextNode: './/ancestor::ns:text[1]',
      }
   });
