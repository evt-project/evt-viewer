angular.module('evtviewer.core')
   
   .constant('XPATH', {
      getLineNodes: './/node()[self::lb or self::p or self::pb or self::head]',
      getParLineNodes: './/node()[self::p or self:l or self::pb or self::head]',
      
      getPrevLb:'count(preceding::lb)',
      getPrevBody:'count(.//preceding::body)',
      getPrevPb:'count(.//preceding::pb)',
      
      getDiplomaticNodes: './/node()[self::lb or self::g or self::text()][not((ancestor::corr or ancestor::reg or ancestor::expan or ancestor::ex))]',
      getDiplomaticChildNodes: './/node()[self::g or self::pb or self::text()][not((ancestor::corr or ancestor::reg or ancestor::expan or ancestor::ex))]',
      
      getInterpretativeNodes: '//body//node()[self::lb or self::g or self::text()][not(ancestor::sic or ancestor::orig or ancestor::abbr or ancestor::am)]',
      getInterpretativeChildNodes: './/node()[self::g or self::pb or self::text()][not(ancestor::sic or ancestor::orig or ancestor::abbr or ancestor::am)]',
      
      getChildNodes: './/node()[self::g or self::pb or self::text()]',
      getTextGlyphNodes: './/node()[self::g or self::text()]',
      getGlyphNodes: './/node()[self::g]',
      
      //getCriticalChildNodes: './/((ns:lem | ns:rdg)[@wit]|text())',
      
      //getCurrentTitle: 'string(.//ancestor::text/@n)',
      //getCurrentTitle:'.//ancestor::text/@n',
      getCurrentTextNode: './/ancestor::text[1]',
      
      ns : {
         getLineNodes: './/node()[self::ns:lb or self::ns:p or self::ns:pb or self::ns:head]',
         getParLineNodes: './/node()[self::ns:p or self::ns:l or self::ns:pb or self::ns:head]',
        
         getPrevLb:'count(.//preceding::ns:lb)',
         getPrevBody:'count(.//preceding::ns:body)',
         getPrevP:'count(.//preceding::ns:p)',
   
         getDiplomaticNodes: './/node()[self::ns:lb or self::ns:g or self::text()][not((ancestor::ns:corr or ancestor::ns:reg or ancestor::ns:expan or ancestor::ns:ex))]',
         getDiplomaticChildNodes: './/node()[self::ns:g or self::ns:pb or self::text()][not((ancestor::ns:corr or ancestor::ns:reg or ancestor::ns:expan or ancestor::ns:ex))]',
         
         getInterpretativeNodes: './/node()[self::ns:lb or self::ns:g or self::text()][not(ancestor::ns:sic or ancestor::ns:orig or ancestor::ns:abbr or ancestor::ns:am)]',
         getInterpretativeChildNodes: './/node()[self::ns:g or self::ns:pb or self::text()][not(ancestor::ns:sic or ancestor::ns:orig or ancestor::ns:abbr or ancestor::ns:am)]',
         
         getChildNodes: './/node()[self::ns:g or self::ns:pb or self::text()]',
         getTextGlyphNodes: './/node()[self::ns:g or self::text()]',
         getGlyphNodes: './/node()[self::ns:g]',
         
         //getCriticalChildNodes: './/((ns:lem | ns:rdg)[@wit]|text())',
         
         //getCurrentTitle: 'string(.//ancestor::ns:text/@n)',
         getCurrentTextNode: './/ancestor::ns:text[1]',
      }
   });
