//Dichiarazione dei moduli 
angular.module("evtviewer.UItools",[]), 
//
angular.module("evtviewer.UItools").service("evtImageTextLinking",[ "evtInterface", "Utils", "parsedData", "imageViewerHandler", 
function (a, b, c, d) {
    var e = {
    };
/* Metodo di evtviewer.UItools.evtImageTextLinking attiva tool Image-Text . */
    const f = /lb/, g = "line"; e.turnOnITL = function () {
        this.activateITL(), 
        this.activateHotSpots(), 
        a.setToolStatus("ITL", "active"), // Metodo che salva lo stato del tool nel servizio {@link evtviewer.interface.evtInterface evtInterface} 
        console.log("TurnONITL")
    },
/* Metodo di evtviewer.UItools.evtImageTextLinking disattiva tool Image-Text . */
    e.turnOffITL = function () {
        this.deactivateITL(), 
        this.deactivateHotSpots(), 
        a.setToolStatus("ITL", "inactive"), 
        a.updateCurrentHighlightedZone(void 0), /* La zona higlited corrente è settata "undefined" con il metodo {@link evtviewer.interface.evtInterface#updateCurrentHighlightedZone updateCurrentHighlightedZone} del service {@link evtviewer.interface.evtInterface evtInterface}*/
        this.switchingOffHighlightInImage(), 
        this.switchingOffHighlightInImageSelected(), console.log("TurnOFFITL")
    },
    e.activateITL = function () {
        console.log("in activateITL"), this.prepareLines(), this.prepareZoneInImgInteractions()
    },
    e.activateHotSpots = function () {
        console.log("in activateHotSpots");
        var a = e.prepareHotSpotZones();
        d.showHotSpot(a)
    },
    e.prepareHotSpotZones = function () {
        for (var a = c.getZones(), b = a._indexes, d =[], e = 0; e < b.length; e++) {
            var f = b[e]; if (f) {
                var g, h = a[f], i = f.replace(/SM_hs_/, "SM_div_hs_");
                console.log("hotSpotId", i), g = c.getHotSpot(i), g &&(h.content = g.content), console.log("hot spot in prepare hotspot", h), d.push(h)
            }
        }
        console.log(d);
        var j = d.filter(function (a) {
            return "HotSpot" === a.rendition
        });
        return console.log("hotspotzones", j), j
    },
    e.deactivateITL = function () {
        var b = a.getState("currentHighlightedZone");
        console.log("currentHzone in deactivateITL " + b), b && this.changeLinesHighlightStatus(b.id, "unselect"), this.resetTextNodes()
    },
    e.deactivateHotSpots = function () {
        console.log("in deactivateHotSpots");
        var a = e.prepareHotSpotZones();
        d.hiddenHotSpot(a)
    },
// Cerca elementi tra due <lb/>s e aggiunge le info.       
       /* Text Node trasformati in <span class="textNode"> per aggiungere o rimuovere le classi "lineHover" e "lineSelected" */
    e.prepareLines = function () {
        console.log("in prepareLines");
        for (var a = document.getElementsByClassName("lb"), c = 0; c < a.length; c++) {
            var d; if (c === a.length -1) {
                var e = a[c].nextSibling; for (d = a[c].id; e &&(3 === e.nodeType || e.className && e.className.indexOf("inLine") < 0);) {
                    if (3 === e.nodeType) {
                        var f = document.createElement("span");
                        f.className = "textNode", f.textContent = e.textContent, e.parentElement.replaceChild(f, e), e = f
                    }
                    this.preapareElementInLine(e, d), e = e.nextSibling || a[c].parentNode.nextSibling || void 0
                }
            } else {
                var g = a[c], h = a[c + 1]; if (d = g.id, d && g && h) {
                    var i = b.DOMutils.getElementsBetweenTree(g, h);
                    for (var j in i) {
                        var k = i[j]; if (3 === k.nodeType) {
                            var l = document.createElement("span");
                            l.className = "textNode", l.textContent = k.textContent, k.parentElement.replaceChild(l, k), k = l
                        }
                        this.preapareElementInLine(k, d)
                    }
                }
            }
        }
    },
/* Prepara elemento che si trova in una linea precisa aggiungendo la classe "inLine" e l'attributo data-line con il riferimento ID */
    e.preapareElementInLine = function (b, c) {
        b.className && b.className.indexOf("inLine") < 0 &&(b.className += " inLine", b.setAttribute("data-line", c), b.onmouseover = function () {
            var a = this.getAttribute("data-line");
            e.changeLinesHighlightStatus(a, "over");
            var b = a.replace(f, g);
            console.log("zoneID in onmouseover", b), e.highlightZoneInImage(b)
        },
        b.onmouseout = function () {
            var a = this.getAttribute("data-line");
            e.changeLinesHighlightStatus(a, "out"), e.switchingOffHighlightInImage()
        },
        b.onclick = function () {
            var b = this.getAttribute("data-line"), c = a.getState("currentHighlightedZone");
            console.log("onclick: ", b, c), c && "Line" === c.name &&(e.changeLinesHighlightStatus(c.id, "unselect"), e.switchingOffHighlightInImage(), e.switchingOffHighlightInImageSelected()), ! c || "Line" === c.name && c.id !== b ?(a.updateCurrentHighlightedZone({
                name: "Line", id: b
            }), e.changeLinesHighlightStatus(b, "select"), e.selectHighlightedZone(b)): a.updateCurrentHighlightedZone(void 0)
        })
    },
    e.resetTextNodes = function () {
        console.log("in reset Text Nodes");
        var a = document.getElementsByClassName("textNode");
        for (var b in a) {
            var c = a[b]; if (console.log("text node", c), c && c.textContent) {
                var d = document.createTextNode(c.textContent);
                c.parentElement.replaceChild(d, c)
            }
        }
    },
    e.changeLinesHighlightStatus = function (b, c) {
        var d = "active" === a.getToolState("ITL"), e = a.getState("currentViewMode");
        if (d && "imgTxt" === e) for (var f = document.querySelectorAll("[data-line='" + b + "']"), g = 0; g < f.length; g++) switch (c) {
            case "over": f[g].className += " lineHover"; break; case "out": f[g].className = f[g].className.replace(" lineHover", "") || ""; break; case "select": f[g].className += " lineSelected"; break; case "unselect": f[g].className = f[g].className.replace(" lineSelected", "") || ""
        }
    },
    e.prepareZoneInImgInteractions = function () {
        console.log("prepare zone in Image");
        var a = document.getElementsByClassName("zoneInImg");
        console.log("zones in Image:", a);
        for (var b = 0; b < a.length; b++) {
            var c = a[b]; c.onmouseover = h, c.onmouseout = i, c.onclick = j
        }
    };
    var h = function () {
        var a = this.getAttribute("data-corresp-id");
        e.changeLinesHighlightStatus(a, "over")
    },
    i = function () {
        var a = this.getAttribute("data-corresp-id");
        e.changeLinesHighlightStatus(a, "out")
    },
    j = function () {
        var b = this.getAttribute("data-corresp-id"), c = this.getAttribute("data-zone-name"), d = a.getState("currentHighlightedZone");
        d && e.changeLinesHighlightStatus(d.id, "unselect"), ! d || d.name === c && d.id !== b ?(a.updateCurrentHighlightedZone({
            name: c, id: b
        }), e.changeLinesHighlightStatus(b, "select")): a.updateCurrentHighlightedZone(void 0)
    };
    return e.highlightZoneInImage = function (b) {
        var e = "active" === a.getToolState("ITL");
        if (e) {
            console.log("zoneId in highlight ITLutils", b);
            var f = c.getZone(b);
            f &&(console.log("## HIGHLIGHT ZONE : ", f), console.log("## PRENDERE RIFERIMENTO al VIEWER ##"), d.highlightOverlay(f), console.log("GESTIRE OVERLAY A PARTIRE DAI DATI ESTRATTI DA ZONE"))
        }
    },
    e.switchingOffHighlightInImage = function () {
        d.turnOffOverlay()
    },
    e.switchingOffHighlightInImageSelected = function () {
        d.turnOffOverlaySelected()
    },
    e.selectHighlightedZone = function (b) {
        console.log("selectHighlightedZone: ", b);
        var e = "active" === a.getToolState("ITL");
        if (e) {
            console.log("ITLactive true - selectHighlightedZone: ", b);
            var h = c.getZone(b.replace(f, g));
            d.turnOffOverlaySelected(), d.highlightSelectedOverlay(h, b.replace(f, g)), d.moveToZone(h)
        }
    },
    e
}]),


/* OSD */
angular.module("evtviewer.openseadragonService",[ "evtviewer.interface"]).service("imageViewerHandler",[ "evtInterface", "imageScrollMap", function (a, b) {
    function c(a) {
        var b = {
        };
        return b.x = d(a.ulx), b.y = d(a.uly), b.width = d(a.lrx - a.ulx), b.hight = d(a.lry - a.uly), console.log("in convert zone to OSD", b), new OpenSeadragon.Rect(b.x / e, b.y / e, b.width / e, b.hight / e)
    }
    function d(a) {
        return a
    }
    const e = 3500; var f = this; f.viewer = void 0, f.scope = void 0, f.setViewer = function (a) {
        f.viewer = a
    },
    f.setScope = function (a) {
        f.scope = a
    },
    f.open = function () {
        console.log("openHandler");
        var a = f.viewer.viewport.getBounds();
        console.log("openHandler", a);
        var b = a.height / a.width, c = new OpenSeadragon.Rect(0, .1, 1, b);
        console.log(c), f.viewer.viewport.fitBounds(c, ! 0), console.log("element navigator", f.viewer.navigator.element)
    },
    f.home = function () {
        console.log("pigiato home");
        var a = f.viewer.viewport.getBounds(), b = a.height / a.width, c = new OpenSeadragon.Rect(0, .1, 1, b);
        f.viewer.viewport.fitBounds(c, ! 0)
    },
    f.navigatorScroll = function (b) {
        console.log("navigator-scroll", a), console.log("navigator-scroll", b), b.scroll > 0 ? console.log("scroll-in"): console.log("scroll-out")
    },
    f.pan = function (c) {
        try {
            console.log("pan", c);
            var d = c.center.y, e = c.eventSource.viewport._oldCenterY; if (console.log("ok event pan", d), console.log("ok viewer pan", e), 1 === f.viewer.viewport.getZoom()) {
                var g, h; console.log("aggiorna testo");
                var i = f.viewer.viewport.getBounds();
                d > e ?(console.log("mostro riga sotto"), console.log("bounds:", i), g = b.mapDown(c.eventSource.viewport.getBounds()), h = a.getState("currentPage"), g !== h && f.scope.$apply(function () {
                    a.updateState("currentPage", g), console.log("in pan handler:", a.getState("currentPage"))
                })): e > d &&(console.log("mostro riga sopra"), console.log("bounds:", i), g = b.mapUP(c.eventSource.viewport.getBounds()), h = a.getState("currentPage"), g !== h && f.scope.$apply(function () {
                    a.updateState("currentPage", "" !== g ? g: h), console.log("in pan handler:", a.getState("currentPage"))
                }))
            }
        }
        catch (j) {
            console.log("error in pan", j)
        }
    },
    f.updateViewerBounds = function (a) {
        console.log("updateViewerBounds: ", f.viewer, a);
        var c = f.viewer.viewport.getBounds();
        console.log("updateViewerBounds: ", c), b.isInBounds(c.y, a) ||(console.log("updateViewerBounds", a), b.updateBounds(f.viewer, a))
    },
    f.highlightOverlay = function (a) {
        if (console.log("in highlight Overlay: ", a), ! a) throw "problem in zone data extraction"; try {
            f.viewer.removeOverlay("line-overlay")
        }
        catch (b) {
            console.error("no line overlay", b)
        }
        var d = c(a), e = document.createElement("div");
        e.id = "line-overlay", e.className = "highlight", f.viewer.addOverlay({
            element: e, location: d
        })
    },
    f.highlightSelectedOverlay = function (a, b) {
        if (console.log("in highlight Overlay: ", a), ! a) throw "problem in zone data extraction"; try {
            f.viewer.removeOverlay("line-overlay")
        }
        catch (d) {
            console.error("no line overlay", d)
        }
        var e = c(a), g = document.createElement("div");
        g.id = "line-overlay_selected", g.className = "selectedHighlight", f.viewer.addOverlay({
            element: g, location: e
        })
    },
    f.turnOffOverlay = function () {
        try {
            f.viewer.removeOverlay("line-overlay")
        }
        catch (a) {
            console.error("no line overlay", a)
        }
    },
    f.turnOffOverlaySelected = function () {
        try {
            f.viewer.removeOverlay("line-overlay_selected")
        }
        catch (a) {
            console.error("no line overlay", a)
        }
    },
    f.moveToZone = function (a) {
        console.log("moveTo: ", a), console.log("viewport center: ", f.viewer.viewport.getCenter());
        var b = f.viewer.viewport.getCenter(), c = f.viewer.viewport.getBounds(! 0);
        console.log("current bounds", c);
        var d = a.uly / e; console.log("old center y", b.y), console.log("zone y normalized", d), console.log("differential y", b.y - d);
        var g = d < c.y + c.height && d > c.y ? b.y: d < c.y ? c.y: c.y + c.height; console.log("new center y", g);
        var h = new OpenSeadragon.Point(b.x, g);
        console.log("new center", h), f.viewer.viewport.panTo(h), console.log("center after pan", f.viewer.viewport.getCenter())
    },
    f.showHotSpot = function (a) {
        var b = ! 1; console.log("in showHotSpot di ViewerHandler", a);
        for (var c =[], d = 0; d < a.length; d++) {
            console.log("zona iesima", a[d]);
            var i = new OpenSeadragon.Rect(a[d].ulx / e, a[d].uly / e,(a[d].lrx - a[d].ulx) / e,(a[d].lry - a[d].uly) / e);
            c.push(i)
        }
        console.log("point hotspot: ", c);
        for (var j =[], k = 0; k < a.length; k++) {
            var l = a[k].content, m = a[k].id, n = a[k]; console.log("content", n);
            var o = document.createElement("div");
            o.id = "hotspot-overlay_selected-" + m, o.className = "hotspot", o.dataset.id = m, o.dataset.content = l, o.onclick = function () {
                b = g(b, this)
            },
            o.onmouseleave = function () {
                b = h(b, this)
            },
            j.push(o)
        }
        console.log("hotspots: ", j), f.viewer.zoomPerClick = 1; for (var p = 0; p < a.length; p++) f.viewer.addOverlay({
            element: j[p], location: c[p]
        })
    };
    var g = function (a, b) {
        if (! a) {
            console.log("elem id", b.id);
            var c = $(b), d = c.position().left, e = c.position().top, g = c.width(), h = c.height(), i = new OpenSeadragon.Point(d, e), j = new OpenSeadragon.Point(d + g, e + h), k = f.viewer.viewport.pointFromPixel(i), l = f.viewer.viewport.pointFromPixel(j), m = 0; m = k.x <= .2 ? k.x +(l.x - k.x) + .01: k.x -(l.x - k.x + .1);
            var n = new OpenSeadragon.Rect(m, k.y, .1, .20), o = document.createElement("div");
            o.id = "div-hotspot-overlay_selected-" + b.dataset.id, o.className = "hotspot-dida"; var p = document.createElement("div");
            p.id = "div-title-hotspot-overlay_selected-" + b.dataset.id, p.className = "hotspot-dida-title", p.innerHTML = "Hotspot " + b.dataset.id.replace(/SM_hs_01r_/, "tomba n° ");
            var q = document.createElement("div");
            q.id = "div-body-hotspot-overlay_selected-" + b.dataset.id, q.className = "hotspot-dida-body", q.innerHTML = b.dataset.content, o.appendChild(p), o.appendChild(q), console.log("content", o);
            var r = {
                element: o, location: n
            };
            console.log(r.element), f.viewer.addOverlay(r), a = ! a
        }
        return a
    },
    h = function (a, b) {
        console.log("hiddenDivHotSpot: " + a);
        try {
            var c = b.dataset.id; f.viewer.removeOverlay("div-hotspot-overlay_selected-" + c)
        }
        catch (d) {
            console.error("no hotspot overlay", d)
        }
        return a = ! 1
    };
    f.hiddenHotSpot = function (a) {
        console.log("in hiddenHotSpot di ViewerHandler");
        try {
            for (var b = 0; b < a.length; b++) f.viewer.removeOverlay("hotspot-overlay_selected-" + a[b].id);
            f.viewer.zoomPerClick = 1
        }
        catch (c) {
            console.error("no hotspot overlay", c)
        }
    },
    f.testFun = function () {
        return console.log("testFunction: ", f), "test ok"
    },
    console.log("caricato servizio  imageViewerHandler")
}])
}
(), angular.module("evtviewer.openseadragonService").service("imageScrollMap",[ "evtInterface", function (a) {
console.log("in service imageScrollMap");
var b = "yPage", c = this, d = {
    yPage1: {
        from: 1, to: 1.15
    },
    yPage2: {
        from: 1.15, to: 2.3
    },
    yPage3: {
        from: 2.3, to: 3.45
    },
    yPage4: {
        from: 3.45, to: 4.48
    },
    yPage5: {
        from: 4.48, to: 5.6
    },
    yPage6: {
        from: 5.6, to: 6.7
    },
    yPage7: {
        from: 6.7, to: 7.95
    },
    yPage8: {
        from: 7.95, to: 9
    },
    yPage9: {
        from: 9, to: 10.1
    },
    yPage10: {
        from: 10.1, to: 10.5
    },
    yPage11: {
        from: 10.5, to: 11.2
    },
    yPage12: {
        from: 11.2, to: 11.7
    },
    yPage13: {
        from: 11.7, to: 12.23
    },
    yPage14: {
        from: 12.23, to: 12.75
    },
    yPage15: {
        from: 12.75, to: 13.25
    },
    yPage16: {
        from: 13.25, to: 13.75
    },
    yPage17: {
        from: 13.75, to: 14.3
    },
    yPage18: {
        from: 14.3, to: 15.3
    },
    size: 18
};
c.mapDown = function (a) {
    return e(a, "down")
},
c.mapUP = function (a) {
    return e(a, "up")
};
var e = function (a, c) {
    var e = a.getBoundingBox();
    switch (console.log("mapping boungs-pages", e), console.log(d), console.log(b), c) {
        case "down": if (console.log("mapping moving down"), e.y < d[b + "1"].to) return (b + "1").substr(1).toLowerCase();
        for (var f = 2; f <= d.size; f++) if (e.y < d[b + f].to && e.y > d[b + f]. from) return console.log(b + f),(b + f).substr(1).toLowerCase();
        break; case "up": console.log("mapping moving up");
        for (var f = 1; f <= d.size; f++) if (console.log("nel for di scrolling up",(d[b + f]. from + d[b + f].to) / 2), console.log("box y:", e.y), console.log("from:", d[b + f]. from), e.y <(d[b + f]. from + d[b + f].to) / 2 && e.y > d[b + f]. from) return console.log("nel if di scrolling up", f), console.log(b + f),(b + f).substr(1).toLowerCase();
        return ""; default: return ""
    }
};
c.isInBounds = function (a, c) {
    console.log("isInBounds", a, c);
    var e = void 0; return e = 5 == c.length ? b + c.substr(c.length -1): b + c.substr(c.length -2), console.log("isInBounds", e), a >= d[e]. from && a < d[e].to ?(console.log("true"), ! 0):(console.log("false"), ! 1)
},
c.updateBounds = function (a, c) {
    console.log("updateBounds");
    var e = a.viewport.getBounds(), f = void 0; f = 5 == c.length ? b + c.substr(c.length -1): b + c.substr(c.length -2), console.log("updateBounds", f);
    var g = e.height / e.width, h = new OpenSeadragon.Rect(0, d[f]. from, 1, g);
    console.log("updateBounds", h), a.viewport.fitBounds(h, ! 1)
}
}]);