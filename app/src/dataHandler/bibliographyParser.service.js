angular.module('evtviewer.dataHandler')

.service('evtBibliographyParser', function($q, parsedData, evtParser, xmlParser, config) {
    console.log('Bibliography Parser service running');
    const CHICAGO_STYLE = config.allowedBibliographicStyles.Chicago,
        APA_STYLE = config.allowedBibliographicStyles.APA,
        MLA_STYLE = config.allowedBibliographicStyles.MLA;

    var STYLE_SELECTED = CHICAGO_STYLE;
    //tengono conto di quali info il parser mette a disposizione per l'output finale
    var yearTagDetected = false,
        authorTagDetected = false,
        titleTagDetected = false,
        publisherTagDetected = false,
        bibliographicStyleInfoDetected = false;

    var monographDef = '<monogr>',
        analyticDef = '<analytic>',
        imprintDef = '<imprint>',
        seriesDef = '<series>',
        biblScopeDef = '<biblScope>',
        citedRangeDef = '<citedRange>',
        editorDef = '<editor>',
        dateDef = '<date>',
        noteDef = '<note>',
        idnoDef = '<idno>',
        sourceDescDef = '<sourceDesc>',
        listBiblDef = '<listBibl>';

    // Tags in cui cercare info bibliografiche
    var bibliographyDef = {
        biblStruct: '<biblStruct>',
        bibl: '<bibl>'
    };

    var parser = {};
    /*/
    Questo file si compone sostanzialmente di 3 funzioni principali:
    	- parseBiblInfo: ricerca nel documento i tag, in cui cercare le info bibliografiche
    	- extractInfo: serve a estrarre le informazioni contenute dentro un certo tag. Per rendere più modulare la funzione,
    				al suo interno sono oontenute altre funzioni ausiliarie, ciascuna con il compito di estrarre un certo tipo di informazioni
    	- formatResult: ha il compito di usare le informazioni estratte in precedenza per creare una stringa html secondo un certo stile bibliografico,
    				mediante CSS, viene curato lo stile, aggiungendo eventuali punti/virgole
    /*/
    parser.parseBiblInfo = function(doc) {
        var currentDocument = angular.element(doc);

        for (var key in bibliographyDef) {
            handleBibliographyDef(key, currentDocument);
        }

        console.log('## parseBiblInfo ##', parsedData.getBibliographicRefsCollection());
    };

    var handleBibliographyDef = function(key, currentDocument) {
    	var listBibl = currentDocument.find(listBiblDef.replace(/[<>]/g, ''));
        var resultsSet = listBibl.find(bibliographyDef[key].replace(/[<>]/g, ''));
        /*Non vogliamo i tag annidati ma solo quelli top, 
        il caso in cui serve è quello dei bibl che possono essere annidati, vogliamo solo i bibl radice */
        resultsSet = $(resultsSet).filter(function() {
            //non vogliamo niente che sia dentro sourceDesc ne che sia annidato dentro un altro bibl,
            //scartiamo i bibl annidati per poter lavorare direttamente con il bibl genitore dei sotto-bibl
            return $(this).parents(sourceDescDef.replace(/[<>]/g, '') + ',' + bibliographyDef[key].replace(/[<>]/g, '')).length === 0;
        });
        angular.forEach(resultsSet,
            function(element) {
                var newBiblElement = parser.extractInfo(element);
                var currentID = getID(newBiblElement);
                parsedData.addBibliographicRef(newBiblElement);
            });
    };

    // Bibliographic data container
    parser.extractInfo = function(element) {
        var newBiblElement = {
            id: '',
            type: '',
            author: [],
            titleAnalytic: '',
            titleMonogr: '',
            editionMonogr: '',
            date: '',
            editor: [],
            publisher: '',
            pubPlace: '',
            biblScope: {},
            note: {},
            idno: {},
            outputs: {},
            plainText: ''
        };

        var currentDocument = angular.element(element);
        var unstructuredBibl = false;
        var nodi = currentDocument[0].childNodes;
        for (var c = 0; c < nodi.length; c++) {
            if (nodi[c].nodeType === 3 && nodi[c].textContent.trim() !== '') {
                unstructuredBibl = true;
            }
        }

        newBiblElement.id = currentDocument.attr('xml:id') ? currentDocument.attr('xml:id') : evtParser.xpath(element);
        if (!unstructuredBibl) {
            //estraiamo le note dentro <bibl>/<biblStruct>
            extractNote(currentDocument, newBiblElement);
            var analyticElem = currentDocument.find(analyticDef.replace(/[<>]/g, ''));
            extractTitleandTitleLevel(angular.element(analyticElem), newBiblElement);

            //estraiamo gli autori
            extractNameSurnameForename(currentDocument.find('author'), newBiblElement.author);
            //estraiamo gli editori
            extractNameSurnameForename(currentDocument.find(editorDef.replace(/[<>]/g, '')), newBiblElement.editor);

            //controllo se è un tag bibl
            if (currentDocument[0].tagName === bibliographyDef.bibl.replace(/[<>]/g, '')) {
                //qui non cerchiamo le note perchè lo abbiamo già fatto all'inizio
                biblExtractInfo(currentDocument[0], newBiblElement);
                extractBiblScopeCitedRange(currentDocument.find(biblScopeDef.replace(/[<>]/g, '')), newBiblElement.biblScope);
                extractBiblScopeCitedRange(currentDocument.find(citedRangeDef.replace(/[<>]/g, '')), newBiblElement.biblScope);
                //solo un sotto-livello di bibl viene analizzato
                var children = currentDocument.children();
                children = $(children).filter(function(key, el) {
                    return el.tagName === bibliographyDef.bibl.replace(/[<>]/g, '');
                });
                angular.forEach(children, function(nestedBibl) {
                    biblExtractInfo(nestedBibl, newBiblElement);
                });
            } else {
                extractBiblScopeCitedRange(currentDocument.find(citedRangeDef.replace(/[<>]/g, '')), newBiblElement.biblScope);
                extractDatePubPlacePublisher(currentDocument, newBiblElement);
            }

            var monographElem = currentDocument.find(monographDef.replace(/[<>]/g, ''));
            //entriamo nel tag monogr
            if (monographElem) {
                monographElem = angular.element(monographElem);
                extractTitleandTitleLevel(monographElem, newBiblElement);

                var monographEditor = monographElem.find(editorDef.replace(/[<>]/g, ''));
                var monographEditions = monographElem.find('edition');
                newBiblElement.editionMonogr = monographEditions && monographEditions.length > 0 ? monographEditions[0].textContent : newBiblElement.editionMonogr;
                var monEdDate = monographEditions.find('date');
                //magari la data è già stata presa dentro <bibl>
                if (newBiblElement.date === '') {
                    newBiblElement.date = monEdDate && monEdDate.length > 0 ? monEdDate[0].textContent : '';
                }


                //biblscope può stare dentro monogr ma anche dentro imprint
                extractBiblScopeCitedRange(monographElem.find(biblScopeDef.replace(/[<>]/g, '')), newBiblElement.biblScope);
                //estraiamo le note
                extractNote(monographElem, newBiblElement);

                //entriamo dentro imprint che è dentro monogr
                var monographImprints = angular.element(monographElem.find(imprintDef.replace(/[<>]/g, '')));
                if (monographImprints && monographImprints.length > 0) {
                    var monographImprint = angular.element(monographImprints[0]);
                    //dentro imprint salviamo i biblScope
                    extractBiblScopeCitedRange(monographImprint.find(biblScopeDef.replace(/[<>]/g, '')), newBiblElement.biblScope);
                    //salviamo la data dentro monogr
                    var imprintsDates = monographImprints.find('date');
                    /*/qua newBiblElement.date contiene già o la data estratta dentro <edition> (che può contenere <date>
                    oppure contiene ''.
                    Se è disponibile una data dentro <imprint> prendiamo quella altrimenti la prendiamo dentro <edition> o dentro <monogr>.
                    Magari la troviamo anche subito dentro <bibl>/*/
                    newBiblElement.date = imprintsDates && imprintsDates.length > 0 ? imprintsDates[0].textContent : '';

                    var imprintsPublishers = monographImprints.find('publisher');
                    if (newBiblElement.publisher === '') {
                        newBiblElement.publisher = imprintsPublishers && imprintsPublishers.length > 0 ? imprintsPublishers[0].textContent : '';
                    }
                    var imprintsPubPlaces = monographImprints.find('pubPlace');
                    if (newBiblElement.pubPlace === '') {
                        newBiblElement.pubPlace = imprintsPubPlaces && imprintsPubPlaces.length > 0 ? imprintsPubPlaces[0].textContent : '';
                    }
                    extractNote(monographImprints, newBiblElement);
                }
            }
            //entriamo nel tag series
            var seriesElem = angular.element(currentDocument.find(seriesDef.replace(/[<>]/g, '')));
            if (seriesElem && seriesElem.length > 0) {
                //salviamo la data dentro monogr
                var seriesElDate = seriesElem.find('date');
                /*/qua newBiblElement.date contiene già o la data estratta dentro <edition> (che può contenere <date>
                oppure contiene '', possiamo quindi riassegnare newBiblElement.date a se stesso senza problemi.
                Se è disponibile una data dentro <imprint> prendiamo quella altrimenti la prendiamo dentro <edition> o dentro <monogr>.
                Magari la troviamo anche subito dentro <bibl>/*/
                if (newBiblElement.date === '') {
                    newBiblElement.date = seriesElDate && seriesElDate.length > 0 ? seriesElDate[0].textContent : '';
                }
                //magari è gia stato preso dentro <monogr>, quindi non vogliamo rischiare di sovrascriverlo
                var publishers = seriesElem.find('publisher');
                if (newBiblElement.publisher === '') {
                    newBiblElement.publisher = publishers && publishers.length > 0 ? publishers[0].textContent : '';
                }
                //magari è gia stato preso dentro <monogr>, quindi non vogliamo rischiare di sovrascriverlo
                var pubPlaces = seriesElem.find('pubPlace');
                if (newBiblElement.pubPlace === '') {
                    newBiblElement.pubPlace = pubPlaces && pubPlaces.length > 0 ? pubPlaces[0].textContent : '';
                }
                /* angular.forEach(seriesElem.find('note'), function(el) {
                	//salviamo le note dentro imprint che è dentro monogr
                	newBiblElement.note[el.getAttribute('type')] = el.textContent;
                }); */
                extractNote(seriesElem, newBiblElement);
                //dentro series ci sono anche i biblScope
                extractBiblScopeCitedRange(seriesElem.find(biblScopeDef.replace(/[<>]/g, '')), newBiblElement.biblScope);
            }


            angular.forEach(currentDocument.find(idnoDef.replace(/[<>]/g, '')), function(el) {
                //prendere attributo type
                var type = el.getAttribute('type');
                if (type !== null) {
                    //non si può salvare un <idno> se non si conosce l'attributo type, è essenziale
                    newBiblElement.idno[type] = el.textContent;
                }

            });
            if (!isChanged(newBiblElement)) {
                newBiblElement.plainText = currentDocument[0].textContent;
            }
            //se è stato esplicitato l'autore e il titolo allora abbiamo abbastanza info per gli stili bibliografici
            if (getAuthor(newBiblElement) && getTitleMonogr(newBiblElement)) {
                bibliographicStyleInfoDetected = true;
            }
        } else {
            nodi = currentDocument.find('*');
            //sorting dal più profondo nel dom al più esterno
            nodi = nodi.sort(function(cb1, cb2) {
                return $(cb2).parents().length - $(cb1).parents().length;
            });
            nodi.replaceWith(function() {
                //var aperturaTag = $(this).prop("tagName") === 'title' ? '<span style=\'font-weight: bold\'>' : '<span>';
                return '<span class="unstructuredBibl ' + this.tagName + '">' + $(this).html() + '</span>';
            });
            newBiblElement.plainText = $(currentDocument).html();
        }
        //toglie il punto finale (se l'utente l'ha inserito) dal testo estratto e toglie gli spazi (trim)
        removeEndingPointTrim(newBiblElement, true, true);
        return newBiblElement;
    };


    var extractNameSurnameForename = function(whereToFind, whereToPutInfoArray) {
        angular.forEach(whereToFind, function(element) {
            var newPersonElement = {
                name: '',
                surname: '',
                forename: ''
            };
            parsePersonInfo(element, element, newPersonElement);
            //proviamo a usare un po' di euristica se non è dato nome/cognome
            if (newPersonElement.name !== '' && newPersonElement.surname === '') {
                var extractedAuthorInfo = extractSurnameNameFromString(newPersonElement.name);
                newPersonElement.surname = extractedAuthorInfo.surname !== '' ? extractedAuthorInfo.surname : newPersonElement.surname;
                newPersonElement.name = extractedAuthorInfo.name !== '' ? extractedAuthorInfo.name : newPersonElement.name;
            }
            whereToPutInfoArray.push(newPersonElement);
        });
    };

    /*
    	@elemento = dove cercare
    	@lastRelevantParent = ultimo genitore conosciuto tra quelli di cui vogliamo estrarre info 
    	(name,surname,forename,author), dobbiamo tenerne traccia per sapere dove salvare poi via via i dati ricevuti
    */
    var parsePersonInfo = function(elemento, lastRelevantParent, newPersonElement) {
        if (elemento.nodeType === 3) {
            var text = elemento.textContent.substr(0, 1).toUpperCase() + elemento.textContent.substr(1);
            if (lastRelevantParent) {
                switch (lastRelevantParent.tagName) {
                    case 'author':
                    case 'editor':
                    case 'name':
                        newPersonElement.name += text + ' ';
                        break;
                    case 'surname':
                        newPersonElement.surname += text + ' ';
                        break;
                    case 'forename':
                        newPersonElement.forename += text + ' ';
                        break;
                }
            }
        }
        angular.forEach(elemento.childNodes, function(el) {
            switch (el.tagName) {
                case 'author':
                case 'editor':
                case 'name':
                case 'surname':
                case 'forename':
                    parsePersonInfo(el, el, newPersonElement);
                    break;
                default:
                    parsePersonInfo(el, lastRelevantParent, newPersonElement);
            }
        });
    };

    var extractTitleandTitleLevel = function(whereToFind, whereToPutInfoArray) {
        var titleEl = whereToFind.find('title');
        if (titleEl && titleEl.length > 0) {
            var titleLevel = titleEl[0].getAttribute('level');
            titleLevel = titleLevel !== null ? titleLevel.substr(0, 1) : '';
            if (whereToFind[0].tagName === monographDef.replace(/[<>]/g, '')) {
                //se @title non è dato possiamo assumere che sia m perchè <title> è contenuto dentro <monograph>, uguale per gli altri
                titleLevel = titleLevel === '' ? 'm' : titleLevel;
                whereToPutInfoArray.titleMonogr = titleEl[0].textContent;
                whereToPutInfoArray.type += titleLevel;
            } else if (whereToFind[0].tagName === analyticDef.replace(/[<>]/g, '')) {
                titleLevel = titleLevel === '' ? 'a' : titleLevel;
                whereToPutInfoArray.titleAnalytic = titleEl[0].textContent;
                whereToPutInfoArray.type += titleLevel;
            }
        }
    };

    //cerchiamo la data dentro <bibl> o <biblStruct>, poi verrà cercata anche dentro <imprint>
    var extractDatePubPlacePublisher = function(whereToFind, whereToPutInfoArray) {
        angular.forEach(whereToFind.children(), function(el) {
            if (el.tagName === 'date') {
                whereToPutInfoArray.date = el.innerText;
            } else if (el.tagName === 'pubPlace') {
                whereToPutInfoArray.pubPlace = whereToPutInfoArray.pubPlace === '' ? el.innerText : whereToPutInfoArray.pubPlace;
            } else if (el.tagName === 'publisher') {
                whereToPutInfoArray.publisher = whereToPutInfoArray.publisher === '' ? el.innerText : whereToPutInfoArray.publisher;
            }
        });
    };

    //serve a estrarre info solo per i tag bibl
    var biblExtractInfo = function(whereToFind, whereToPutInfoArray) {
        var level,
            children = whereToFind.children;
        for (var c = 0; c < children.length; c++) {
            if (children[c].tagName === 'title') {
                level = children[c].getAttribute('level');
                if (level !== null && typeof level !== 'undefined') {
                    level = level.substring(0, 1);
                }
                //se il level è m o se non è dato salviamo il titolo
                if (level === 'm' || level === 'j' || level === 'u' || level === null || typeof level === 'undefined') {
                    whereToPutInfoArray.titleMonogr = children[c].textContent;
                    whereToPutInfoArray.type += level;
                }
                //se è dato il level a lo salviamo
                if (level === 'a' && level !== null && typeof level !== 'undefined') {
                    whereToPutInfoArray.titleAnalytic = children[c].textContent;
                    whereToPutInfoArray.type += level;
                }
            }
            //se abbiamo trovato che il level è m o se non è dato salviamo altre info
            if (typeof level === 'undefined' || level === null || level === 'm') {
                //il tag date ha precedenza sulla data trovata dentro edition
                if (children[c].tagName === 'date') {
                    whereToPutInfoArray.date = children[c].textContent;
                } else if (children[c].tagName === 'pubPlace') {
                    whereToPutInfoArray.pubPlace = whereToPutInfoArray.pubPlace === '' ? children[c].textContent : whereToPutInfoArray.pubPlace;
                } else if (children[c].tagName === 'publisher') {
                    whereToPutInfoArray.publisher = whereToPutInfoArray.publisher === '' ? children[c].textContent : whereToPutInfoArray.publisher;
                } else if (children[c].tagName === 'edition') {
                    whereToPutInfoArray.editionMonogr = whereToPutInfoArray.editionMonogr === '' ? children[c].textContent : whereToPutInfoArray.editionMonogr;
                    var date = angular.element(children[c]).find('date');
                    //dentro edition può starci la data dell'opera, nel caso prendiamo la prima
                    if (date && date.length > 0) {
                        whereToPutInfoArray.date = whereToPutInfoArray.date === '' ? date[0].textContent : whereToPutInfoArray.date;
                    }
                }
            }
        }
    };

    var extractBiblScopeCitedRange = function(whereToFind, whereToPutInfoArray) {
        angular.forEach(whereToFind, function(el) {
            //prendere attributo type o unit di ogni biblScope trovato
            angular.forEach(['type', 'unit'], function(attr) {
                var attrValue = el.getAttribute(attr);
                var additionalAttrFrom = el.getAttribute('from');
                var additionalAttrTo = el.getAttribute('to');
                if (attrValue !== null) {
                    if (!attrValue in whereToPutInfoArray) {
                        //diamo la precedenza agli attributi @from & @to
                        if (additionalAttrTo !== null && additionalAttrFrom !== null && additionalAttrTo !== '' && additionalAttrFrom !== '') {
                            whereToPutInfoArray[attrValue] = additionalAttrFrom + '-' + additionalAttrTo;
                        } else if (el.textContent !== '') {
                            whereToPutInfoArray[attrValue] = el.textContent;
                        }
                    }
                }
            });
        });
    };

    var extractNote = function(whereToFind, whereToPutInfoArray) {
        angular.forEach(whereToFind.find('note'), function(el) {
            //salviamo le note dentro imprint che è dentro monogr
            var type = el.getAttribute('type');
            if (type === null) {
                //se il tag note non ha specificato l'attributo type allora la chiave è note + <numero-nota>
                var c = 1;
                type = 'note-' + c;
                while (type in whereToPutInfoArray.note) {
                    type = 'note' + (++c);
                }
            }
            whereToPutInfoArray.note[type] = el.textContent;
        });
    };





    var isObject = function(obj) {
        return obj && ((typeof obj).toLowerCase() === 'object');
    };

    var isArray = function(obj) {
        return isObject(obj) && (obj instanceof Array);
    };

    var isString = function(obj) {
        return (typeof obj).toLowerCase() === 'string';
    };

    /* 	toglie i punti finali dal testo raccolto e rimuove anche gli spazi iniziali/finali per 
    	garantire un corretto sorting e per maggiore omogeneità una volta su schermo */
    var removeEndingPointTrim = function(arr, removeEndingPoint, trim) {
        if (typeof arr === 'string') {
            if (removeEndingPoint) {
                //cerca un punto prima di un fine riga
                arr = arr.replace(/\.$/, '');
            }
            if (trim) {
                arr = arr.trim();
                arr = arr.replace(/\s+/g, ' ');
            }
            return arr;
        } else {
            if (isArray(arr)) {
                for (var c = 0, l = arr.length; c < l; c++) {
                    removeEndingPointTrim(arr[c], true, true);
                }
            } else if (isObject(arr)) {
                for (var key in arr) {
                    var res;
                    if (key !== 'author') {
                        res = removeEndingPointTrim(arr[key], true, true);
                    } else {
                        res = removeEndingPointTrim(arr[key], false, true);
                    }
                    if (typeof res !== 'undefined') {
                        arr[key] = res;
                    }
                }
            }
        }
    };

    //ricorsivamente scende fino ai campi stringa e va a controllare se c'è scritto qualcosa
    var isChanged = function(arr) {
        var res = false;
        if (isString(arr)) {
            if (arr !== '') {
                res = true;
            }
        } else if (isArray(arr)) {
            if (arr.length > 0) {
                res = true;
            }
        } else if (isObject(arr)) {
            for (var key in arr) {
                if (key !== 'id') {
                    //ci basta trovare almeno una volta true per sapere che qualcosa è cambiato
                    res = !res ? isChanged(arr[key]) : res;
                }
                if (key === 'author' && arr[key].length > 0) {
                    authorTagDetected = true;
                }
                if (key === 'date' && arr[key] !== '') {
                    yearTagDetected = true;
                }
                if ((key === 'titleAnalytic' || key === 'titleMonogr') && arr[key] !== '') {
                    titleTagDetected = true;
                }
                if (key === 'publisher' && arr[key] !== '') {
                    publisherTagDetected = true;
                }
            }
        }
        return res;
    };

    //genera una stringa html in base alle informazioni estratte e a un certo stile bibliografico
    parser.formatResult = function(styleCode, newBiblElement) {
        if (!newBiblElement.outputs[styleCode]) {
            var string = '';
            var firstAuthor, firstName, firstSurname;
            if (styleCode === null || typeof styleCode === 'undefined' || styleCode === '') {
                if (newBiblElement.plainText !== '') {
                    string += '<span data-style="unstructuredBibl">' + newBiblElement.plainText + '<span>';
                }
            }
            //presentiamo i risultati estratti, in teoria in base a un codice scegliamo l'otput desiderato
            else if (styleCode === CHICAGO_STYLE) {
                if (newBiblElement.plainText !== '') {
                    string += '<span data-style="chicago">' + newBiblElement.plainText + '<span>';
                }
                //autore-data-titolo-titolo_monografia(se presente)- edizione-luogo pubblicazione-data-numero pagina-idno(se dati)
                //il primo autore deve essere citato con cognome-nome
                if (newBiblElement.author && newBiblElement.author.length > 0) {
                    string += '<span data-style="chicago" class="authors">';
                    firstAuthor = newBiblElement.author[0];
                    //il nome lo prendiamo per mezzo del tag name o forename
                    firstName = firstAuthor.name !== '' ? firstAuthor.name : firstAuthor.forename;
                    firstSurname = firstAuthor.surname;

                    //proviamo a usare un po' di euristica se non è dato nome/cognome
                    if (firstName !== '' && firstSurname === '') {
                        var extractedAuthorInfo = extractSurnameNameFromString(firstName);
                        firstSurname = extractedAuthorInfo.surname !== '' ? extractedAuthorInfo.surname : firstSurname;
                        firstName = extractedAuthorInfo.name !== '' ? extractedAuthorInfo.name : firstName;
                    }

                    string += '<span data-style="chicago" class="author">';
                    if (firstSurname !== '') {
                        string += '<span data-style="chicago" class="surname">' + firstSurname + '</span>';
                    }
                    if (firstName !== '' && firstSurname !== '') {
                        string += '<span data-style="chicago" class="name">' + getInitialsExceptFirstOne(firstName) + '</span>';
                    } else if (firstName !== '') {
                        string += '<span data-style="chicago" class="name">' + firstName + '</span>';
                    }
                    string += '</span>';


                    //se c'è più di un autore gli altri sono citati con nome-cognome
                    angular.forEach(newBiblElement.author, function(authorElement, key) {
                        //il primo autore lo abbiamo già sistemato prima, adesso (se ci sono) aggiungiamo gli altri
                        if (key > 0) {
                            var name = authorElement.name !== '' ? authorElement.name : authorElement.forename;
                            var surname = authorElement.surname;

                            //proviamo a usare un po' di euristica se non è dato nome/cognome
                            if (name !== '' && surname === '') {
                                var extractedAuthorInfo = extractSurnameNameFromString(name);
                                surname = extractedAuthorInfo.surname !== '' ? extractedAuthorInfo.surname : surname;
                                name = extractedAuthorInfo.name !== '' ? extractedAuthorInfo.name : name;
                            }

                            string += '<span data-style="chicago" class="author">';
                            if (name !== '' && surname !== '') {
                                string += '<span data-style="chicago" class="name">' + getInitialsExceptFirstOne(name) + '</span>';
                            } else if (name !== '') {
                                string += '<span data-style="chicago" class="name">' + name + '</span>';
                            }
                            if (surname !== '') {
                                string += '<span data-style="chicago" class="surname">' + surname + '</span>';
                            }

                            string += '</span>';
                        }
                    });
                }
                //chiude autors
                string += '</span>';
                if (!isMonograph(newBiblElement)) {
                    if (getDate(newBiblElement)) {
                        string += '<span data-style="chicago" class="date">' + getDate(newBiblElement) + '</span>';
                    }

                    if (getTitleAnalytic(newBiblElement)) {
                        string += '<span data-style="chicago" class="titleAnalytic">' + getTitleAnalytic(newBiblElement) + '</span>';
                    }

                    if (getTitleMonogr(newBiblElement)) {
                        string += '<span data-style="chicago" class="titleMonogr">' + getTitleMonogr(newBiblElement) + '</span>';
                    }
                    //editore
                    if (getEditor(newBiblElement)) {
                        string += '<span data-style="chicago" class="editors">';
                        angular.forEach(getEditor(newBiblElement), function(editorElement, key) {
                            string += '<span data-style="chicago" class="editor">';
                            var name = editorElement.name !== '' ? editorElement.name : editorElement.forename;
                            var surname = editorElement.surname;

                            //proviamo a usare un po' di euristica se non è dato nome/cognome
                            if (name !== '' && surname === '') {
                                var extractedAuthorInfo = extractSurnameNameFromString(name);
                                surname = extractedAuthorInfo.surname !== '' ? extractedAuthorInfo.surname : surname;
                                name = extractedAuthorInfo.name !== '' ? extractedAuthorInfo.name : name;
                            }

                            if (surname !== '') {
                                string += '<span data-style="chicago" class="editor surname">' + surname + '</span>';
                            }
                            if (name !== '') {
                                string += '<span data-style="chicago" class="editor name">' + name + '</span>';
                            }
                            string += '</span>';
                        });
                        string += '</span>';
                    }
                    if (getPubPlace(newBiblElement)) {
                        string += '<span data-style="chicago" class="pubPlace">' + getPubPlace(newBiblElement) + '</span>';
                    }
                    if (getPublisher(newBiblElement)) {
                        string += '<span data-style="chicago" class="publisher">' + getPublisher(newBiblElement) + '</span>';
                    }

                    if (getPages(newBiblElement)) {
                        string += '<span data-style="chicago" class="pp">' + getPages(newBiblElement) + '</span>';
                    }
					/*/
                    angular.forEach(newBiblElement.idno, function(el, key) {
                        if (key === 'DOI') {
                            string += '<span data-style="chicago" class="idno" data-type="' + key + '">' + el + '</span>';
                        }
                    });/*/
                } else {
                    //else if(isMonograph(newBiblElement) ){
                    if (getDate(newBiblElement)) {
                        string += '<span data-style="chicago" class="date">' + getDate(newBiblElement) + '</span>';
                    }
                    if (getTitleAnalytic(newBiblElement)) {
                        string += '<span data-style="chicago" data-attr="titolo" class="titleAnalytic">' + getTitleAnalytic(newBiblElement) + '</span>';
                    }
                    if (getTitleMonogr(newBiblElement)) {
                        string += '<span data-style="chicago" data-attr="titolo" class="titleMonogr">' + getTitleMonogr(newBiblElement) + '</span>';
                    }
                    if (getEditionMonogr(newBiblElement)) {
                        string += '<span data-style="chicago" data-attr="titolo" class="edition">' + getEditionMonogr(newBiblElement) + '</span>';
                    }

                    if (getPubPlace(newBiblElement)) {
                        string += '<span data-style="chicago" class="pubPlace">' + getPubPlace(newBiblElement) + '</span>';
                    }
                    if (getPublisher(newBiblElement)) {
                        string += '<span data-style="chicago" class="publisher">' + getPublisher(newBiblElement) + '</span>';
                    }
                    if (getUrl(newBiblElement)) {
                        string += '<span data-style="chicago" class="url">' + getUrl(newBiblElement) + '</span>';
                    }
                    /*/angular.forEach(newBiblElement.idno, function(el, key) {
                        if (key === 'ISSN') {
                            string += '<span data-style="chicago" class="idno" data-type="' + key + '">' + el + '</span>';
                        }
                    });/*/
                }
            }

            /*/
            Altro stile
            /*/
            else if (styleCode === APA_STYLE) {
                if (newBiblElement.plainText !== '') {
                    string += '<span data-style="apa">' + newBiblElement.plainText + '<span>';
                }
                if (!isMonograph(newBiblElement)) {
                    if (newBiblElement.author && newBiblElement.author.length > 0) {
                        string += '<span data-style="apa" class="authors">';
                        firstAuthor = newBiblElement.author[0];
                        firstName = firstAuthor.name !== '' ? firstAuthor.name : firstAuthor.forename;
                        firstSurname = firstAuthor.surname;


                        string += '<span data-style="apa" class="author">';
                        //del primo autore prima si deve mettere il cognome
                        if (firstSurname !== '') {
                            string += '<span data-style="apa" class="surname">' + firstSurname + '</span>';
                        }
                        if (firstName !== '' && firstSurname !== '') {
                            string += '<span data-style="apa" class="name">' + getInitials(firstName) + '</span>';
                        }
                        //se non sappiamo il cognome allora mettiamo il nome tutto per intero, non possiamo prendere le iniziali se non conosciamo il cognome
                        if (firstName !== '' && firstSurname === '') {
                            string += '<span data-style="apa" class="name">' + firstName + '</span>';
                        }
                        string += '</span>';
                        angular.forEach(newBiblElement.author, function(authorElement, key) {
                            //il primo autore lo abbiamo già sistemato prima, adesso (se ci sono) aggiungiamo gli altri
                            if (key > 0) {
                                var name = authorElement.name !== '' ? authorElement.name : firstAuthor.forename;
                                var surname = authorElement.surname !== '' ? authorElement.surname : '';

                                //proviamo a usare un po' di euristica se non è dato nome/cognome
                                if (name !== '' && surname === '') {
                                    var extractedAuthorInfo = extractSurnameNameFromString(name);
                                    surname = extractedAuthorInfo.surname !== '' ? extractedAuthorInfo.surname : surname;
                                    name = extractedAuthorInfo.name !== '' ? extractedAuthorInfo.name : name;
                                }

                                string += '<span data-style="apa" class="author">';
                                if (surname !== '') {
                                    string += '<span data-style="apa" class="surname">' + surname + '</span>';
                                }
                                if (name !== '' && surname !== '') {
                                    string += '<span data-style="apa" class="name">' + getInitials(name) + '</span>';
                                }
                                if (name !== '' && surname === '') {
                                    string += '<span data-style="apa" class="name">' + name + '</span>';
                                }
                                string += '</span>';
                            }
                        });
                        string += '</span>';
                    }
                    if (getDate(newBiblElement)) {
                        string += '<span data-style="apa" class="date">' + getDate(newBiblElement) + '</span>';
                    }

                    if (getTitleAnalytic(newBiblElement)) {
                        string += '<span data-style="apa" data-attr="titolo" class="titleAnalytic">' + getTitleAnalytic(newBiblElement) + '</span>';
                    }

                    if (getTitleMonogr(newBiblElement)) {
                        string += '<span data-style="apa" data-attr="titolo" class="titleMonogr">' + getTitleMonogr(newBiblElement) + '</span>';
                    }

                    if (getVolumes(newBiblElement)) {
                        var vol = getVolumes(newBiblElement);
                        if (getIssue(newBiblElement)) {
                            var issue = getIssue(newBiblElement);
                            string += '<span data-style="apa" class="vol">' + vol + '(' + issue + ')</span>';
                        } else {
                            string += '<span data-style="apa" class="vol">' + vol + '</span>';
                        }
                    }

                    if (getPages(newBiblElement)) {
                        string += '<span data-style="apa" class="pp">' + getPages(newBiblElement) + '</span>';
                    }

                    if (getPubPlace(newBiblElement)) {
                        string += '<span data-style="apa" class="pubPlace">' + getPubPlace(newBiblElement) + '</span>';
                    }
                    if (getPublisher(newBiblElement)) {
                        string += '<span data-style="apa" class="publisher">' + getPublisher(newBiblElement) + '</span>';
                    }
                } else {
                    if (newBiblElement.author && newBiblElement.author.length > 0) {
                        string += '<span data-style="apa" class="authors">';
                        firstAuthor = newBiblElement.author[0];
                        firstName = firstAuthor.name !== '' ? firstAuthor.name : firstAuthor.forename;
                        firstSurname = firstAuthor.surname;

                        string += '<span data-style="apa" class="author">';
                        //del primo autore prima si deve mettere il cognome
                        if (firstSurname !== '') {
                            string += '<span data-style="apa" class="surname">' + firstSurname + '</span>';
                        }
                        if (firstName !== '' && firstSurname !== '') {
                            string += '<span data-style="apa" class="name">' + getInitials(firstName) + '</span>';
                        }
                        //se non sappiamo il cognome allora mettiamo il nome tutto per intero, non possiamo prendere le iniziali se non conosciamo il cognome
                        if (firstName !== '' && firstSurname === '') {
                            string += '<span data-style="apa" class="name">' + firstName + '</span>';
                        }
                        string += '</span>';
                        angular.forEach(newBiblElement.author, function(authorElement, key) {
                            //il primo autore lo abbiamo già sistemato prima, adesso (se ci sono) aggiungiamo gli altri
                            if (key > 0) {
                                var name = authorElement.name !== '' ? authorElement.name : firstAuthor.forename;
                                var surname = authorElement.surname !== '' ? authorElement.surname : '';


                                string += '<span data-style="apa" class="author">';
                                if (surname !== '') {
                                    string += '<span data-style="apa" class="surname">' + surname + '</span>';
                                }
                                if (name !== '' && surname !== '') {
                                    string += '<span data-style="apa" class="name">' + getInitials(name) + '</span>';
                                }
                                if (name !== '' && surname === '') {
                                    string += '<span data-style="apa" class="name">' + name + '</span>';
                                }
                                string += '</span>';
                            }
                        });
                        string += '</span>';
                    }
                    if (getDate(newBiblElement)) {
                        string += '<span data-style="apa" class="date">' + getDate(newBiblElement) + '</span>';
                    }

                    if (getTitleMonogr(newBiblElement)) {
                        string += '<span data-style="apa" data-attr="titolo" class="titleMonogr">' + getTitleMonogr(newBiblElement) + '</span>';
                    }
                    if (getPages(newBiblElement)) {
                        string += '<span data-style="apa" class="pp">' + getPages(newBiblElement) + '</span>';
                    }
                    if (getPubPlace(newBiblElement)) {
                        string += '<span data-style="apa" class="pubPlace">' + getPubPlace(newBiblElement) + '</span>';
                    }
                    if (getPublisher(newBiblElement)) {
                        string += '<span data-style="apa" class="publisher">' + getPublisher(newBiblElement) + '</span>';
                    }

                }
            }

            /*/
			Altro stile
			/*/
            else if (styleCode === MLA_STYLE) {
                if (newBiblElement.plainText !== '') {
                    string += '<span data-style="mla">' + newBiblElement.plainText + '<span>';
                }
                if (!isMonograph(newBiblElement) || true) {
                    if (newBiblElement.author && newBiblElement.author.length > 0) {
                        string += '<span data-style="mla" class="authors">';
                        firstAuthor = newBiblElement.author[0];
                        firstName = firstAuthor.name !== '' ? firstAuthor.name : firstAuthor.forename;
                        firstSurname = firstAuthor.surname;

                        string += '<span data-style="mla" class="author">';
                        //del primo autore prima si deve mettere il cognome
                        if (firstSurname !== '') {
                            string += '<span data-style="mla" class="surname">' + firstSurname + '</span>';
                        }
                        if (firstName !== '' && firstSurname !== '') {
                            string += '<span data-style="mla" class="name">' + getInitialsExceptFirstOne(firstName) + '</span>';
                        } else if (firstName !== '') {
                            string += '<span data-style="mla" class="name">' + firstName + '</span>';
                        }
                        string += '</span>';

                        angular.forEach(newBiblElement.author, function(authorElement, key) {
                            //il primo autore lo abbiamo già sistemato prima, adesso (se ci sono) aggiungiamo gli altri
                            if (key > 0) {
                                var name = authorElement.name !== '' ? authorElement.name : authorElement.forename;
                                var surname = authorElement.surname;
                                string += '<span data-style="mla" class="author">';
                                if (name !== '' && surname !== '') {
                                    string += '<span data-style="mla" class="name">' + getInitialsExceptFirstOne(name) + '</span>';
                                } else if (name !== '') {
                                    string += '<span data-style="mla" class="name">' + name + '</span>';
                                }
                                if (surname !== '') {
                                    string += '<span data-style="mla" class="surname">' + surname + '</span>';
                                }

                                string += '</span>';
                            }
                        });
                        string += '</span>';
                    }
                    if (getTitleAnalytic(newBiblElement)) {
                        string += '<span data-style="mla" data-attr="titolo" class="titleAnalytic">' + getTitleAnalytic(newBiblElement) + '</span>';
                    }
                    if (getTitleMonogr(newBiblElement)) {
                        string += '<span data-style="mla" data-attr="titolo" class="titleMonogr">' + getTitleMonogr(newBiblElement) + '</span>';
                    }

                    if (getPubPlace(newBiblElement)) {
                        string += '<span data-style="mla" class="pubPlace">' + getPubPlace(newBiblElement) + '</span>';
                    }
                    if (getPublisher(newBiblElement)) {
                        string += '<span data-style="mla" class="publisher">' + getPublisher(newBiblElement) + '</span>';
                    }

                    if (getDate(newBiblElement)) {
                        string += '<span data-style="mla" class="date">' + getDate(newBiblElement) + '</span>';
                    }

                    if (getPages(newBiblElement)) {
                        string += '<span data-style="mla" class="pp">' + getPages(newBiblElement) + '</span>';
                    }

                    if (getUrl(newBiblElement)) {
                        string += '<span data-style="mla" class="generic">Web</span>';
                    }
                }
            }
            if (string !== '' && getNotes(newBiblElement)) {
                var noteContent = '';
                angular.forEach(getNotes(newBiblElement), function(noteEl) {
                    noteContent += '<p>' + noteEl + '</p>';
                });
                string += '<evt-popover data-trigger="click"  data-tooltip="' + noteContent + '">' +
                    '<i class="icon-evt_note"></i>' +
                    '</evt-popover>';
            }
            newBiblElement.outputs[styleCode] = string;
        }
    };

    /*/serve a estrarre nome/cognome da una stringa con un certo pattern:
    	<cognome>+\s*,\s*<nome>* dove <cognome> e <nome> sono stringhe di testo rappresentanti un cognome/nome
    	Esempio: Rossi, Mario -> cognome= Rossi, nome= Mario
    			 Rossi, Mario, Luigi -> stringa non riconosciuta come valida
    /*/
    var extractSurnameNameFromString = function(string) {
        var author = {
            surname: '',
            name: ''
        };
        var nComma = 0,
            index = 0;
        for (var c = 0; c < string.length; c++) {
            if (string[c] === ',') {
                nComma++;
                index = c;
            }
        }
        //se c'è una virgola sola ok, altrimenti chissà quale sia il cognome/nome
        if (nComma === 1 && index > 0) {
            author.surname = string.substr(0, index);
            author.name = string.substr(index + 1, string.length - 1);
        }
        return author;
    };

    var getInitials = function(string) {
        var resultString = '';
        for (var c = 0; c < string.length; c++) {
            if ((c === 0 || string[c - 1] === ' ' || string[c - 1] === '.') && string[c] !== ' ' && string[c] === string[c].toUpperCase()) {
                resultString += '';
                resultString += string[c];
                resultString += '.';
            }
        }
		var l = resultString.length;
		if (resultString[l-1] === '.') {
			resultString = resultString.substr(0,l-1);
		}
        return resultString;
    };

    var getInitialsExceptFirstOne = function(string) {
        var resultString = '';
        var startIndex = -1;
        var endIndex = 0;
        //troviamo la posizione della prima iniziale
        for (var c = 0; c < string.length; c++) {
            if (startIndex === -1 && string[c] !== ' ' && string[c] === string[c].toUpperCase()) {
                startIndex = c;
                endIndex = c;
            }
            if (startIndex !== -1) {
                if (string[c] === ' ' || string[c] === '.') {
                    break;
                } else {
                    endIndex++;
                }
            }
        }
        //qua index avrà l'ultima posizione della prima iniziale
        //prendiamo la prima parte della stringa con la prima iniziale
        //per il resto della stringa lasciamo che la funzione getInitials faccia il suo lavoro
        var string1 = string.substr(startIndex, endIndex),
            string2 = getInitials(string.substr(endIndex + 1));
        if (string2 !== '') {
            string1 += ' ';
        }
        return string1 + string2;
    };

    /*/Getters, ritornano il valore richiesto relativo a una entrata bibliografica estratta, oppure undefined.
	Le funzioni senza argomenti ritornano il valore di variabili definite dentro al servizio (chiamato parser).
	Le funzioni che accettano un parametro (per facilità di comprensione chiamato newBiblElement) accedono dei campi di un oggetto definito 
	nella funzione parser.extractInfo; per una descrizione più completa del modello dei dati estratti, vedere la documentazione di questo file,
	alla voce newBiblElement. /*/
    parser.yearInfoDetected = function() {
        return yearTagDetected;
    };

    parser.authorInfoDetected = function() {
        return authorTagDetected;
    };

    parser.titleInfoDetected = function() {
        return titleTagDetected;
    };

    parser.publisherInfoDetected = function() {
        return publisherTagDetected;
    };

    parser.bibliographicStyleInfoDetected = function() {
        return bibliographicStyleInfoDetected;
    };

    parser.getType = function(newBiblElement) {
        //parser encapsulates an internal function
        return getPubblicationType(newBiblElement);
    };

    var getID = function(newBiblElement) {
        if (newBiblElement.id !== '') {
            return newBiblElement.id;
        }
    };

    var getIDNO = function(newBiblElement) {
        if (Object.keys(newBiblElement.idno).length > 0) {
            return newBiblElement.idno;
        }
    };

    var getAuthor = function(newBiblElement) {
        if (newBiblElement.author && newBiblElement.author.length > 0) {
            return newBiblElement.author;
        }
    };

    var getTitleAnalytic = function(newBiblElement) {
        if (newBiblElement.titleAnalytic !== '') {
            return newBiblElement.titleAnalytic;
        }
    };

    var getTitleMonogr = function(newBiblElement) {
        if (newBiblElement.titleMonogr !== '') {
            return newBiblElement.titleMonogr;
        }
    };

    var getEditionMonogr = function(newBiblElement) {
        if (newBiblElement.editionMonogr !== '') {
            return newBiblElement.editionMonogr;
        }
    };

    var getPubPlace = function(newBiblElement) {
        if (newBiblElement.pubPlace !== '') {
            return newBiblElement.pubPlace;
        }
    };

    var getDate = function(newBiblElement) {
        if (newBiblElement.date !== '') {
            return newBiblElement.date;
        }
    };

    var getPages = function(newBiblElement) {
        var pages;
        if (typeof newBiblElement.note !== 'undefined') {
            if (typeof newBiblElement.note.pp !== 'undefined') {
                pages = newBiblElement.note.pp;
            }
            //magari si chiama pages
            else if (typeof newBiblElement.note.pages !== 'undefined') {
                pages = newBiblElement.note.pages;
            }
        }
        if (typeof newBiblElement.biblScope.pages !== 'undefined') {
            pages = newBiblElement.biblScope.pages;
        } else if (typeof newBiblElement.biblScope.pp !== 'undefined') {
            pages = newBiblElement.biblScope.pp;
        } else if (typeof newBiblElement.biblScope.page !== 'undefined') {
            pages = newBiblElement.biblScope.page;
        }
        return pages;
    };


    var getAccessed = function(newBiblElement) {
        if (typeof newBiblElement.note.accessed !== 'undefined') {
            return newBiblElement.note.accessed;
        }
    };

    var getUrl = function(newBiblElement) {
        if (typeof newBiblElement.note.url !== 'undefined') {
            return '<a href="'+newBiblElement.note.url+'" target="_blank">'+newBiblElement.note.url+'</a>';
        }
    };

    var getVolumes = function(newBiblElement) {
        if (typeof newBiblElement.biblScope.vol !== 'undefined') {
            return newBiblElement.biblScope.vol;
        } else if (typeof newBiblElement.biblScope.volume !== 'undefined') {
            return newBiblElement.biblScope.volume;
        } else if (typeof newBiblElement.biblScope.volumes !== 'undefined') {
            return newBiblElement.biblScope.volumes;
        }
    };

    var getIssue = function(newBiblElement) {
        if (typeof newBiblElement.biblScope.issue !== 'undefined') {
            return newBiblElement.biblScope.issue;
        }
    };

    var getPubblicationType = function(newBiblElement) {
        if (newBiblElement.type !== '') {
            //am è un caso particolare, per gli altri casi ci rifacciamo a una forma più semplice per non complicare il css
            if (newBiblElement.type === 'am' || newBiblElement.type === 'ma') {

            } else if (newBiblElement.type === 'aj' || newBiblElement.type === 'ja') {
                newBiblElement.type = 'j';
            } else if (newBiblElement.type.includes('a')) {
                newBiblElement.type = 'a';
            } else {
                newBiblElement.type = newBiblElement.type.substr(0, 1);
            }
            return newBiblElement.type;
        }
    };

    var getNotes = function(newBiblElement) {
        if (newBiblElement.note && Object.keys(newBiblElement.note).length > 0) {
            return newBiblElement.note;
        }
    };

    var isMiscellanea = function(newBiblElement) {
        return (getPubblicationType(newBiblElement).toLowerCase().substr(0, 2) === 'ma') ||
            (getPubblicationType(newBiblElement).toLowerCase().substr(0, 2) === 'am');
    };

    var isMonograph = function(newBiblElement) {
        return getPubblicationType(newBiblElement) && (getPubblicationType(newBiblElement).toLowerCase().substr(0, 1) === 'm');
    };

    var isJournalArticle = function(newBiblElement) {
        return getPubblicationType(newBiblElement) && (getPubblicationType(newBiblElement).toLowerCase().substr(0, 1) === 'j');
    };

    var getPublisher = function(newBiblElement) {
        if (newBiblElement.publisher !== '') {
            return newBiblElement.publisher;
        }
    };

    var getEditor = function(newBiblElement) {
        if (newBiblElement.editor && newBiblElement.editor.length > 0) {
            return newBiblElement.editor;
        }
    };

    return parser;
});