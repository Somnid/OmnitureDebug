var oDebug = (function(){ 
      
    var body; 
      
    function init(){ 
        body = document.getElementsByTagName("body")[0]; 
        attachNetworkListener(); 
    } 
      
    function onRequestFinished(requestData){ 
        var request = requestData.request; 
        var url = request.url; 
        var queryParams = request.queryString; 
          
        if(/b\/ss\//g.test(url)){ 
            var mappedParams = mapParams(queryParams); 
            var ul = print(mappedParams); 
            ul.scrollIntoView(true); 
        } 
    } 
      
    function attachNetworkListener(){ 
        chrome.devtools.network.onRequestFinished.addListener(onRequestFinished); 
    } 
      
    function mapParams(queryParams){ 
        var mappedParams = {}; 
          
        for(var i = 0; i < queryParams.length; i++){ 
            mapParam(queryParams[i], mappedParams); 
        } 
          
        return mappedParams; 
    } 
      
    function mapParam(param, mappingArray){ 
        var value = decodeURIComponent(param.value); 
        switch(param.name){ 
            case 'pageName': 
                mappingArray.pageName = value; 
                break; 
            case 'events': 
                mappingArray.events = value; 
                break; 
            case 'ch': 
                mappingArray.channel = value; 
                break; 
            case 'pe': 
                mappingArray.linkType = getLinkType(value); 
                break; 
            case 'pev2': 
                mappingArray.friendlyLinkName = value; 
                break; 
            case 'pageType': 
                mappingArray.pageType = value; 
                break; 
            default: 
                mapCustomVar(param, mappingArray); 
        } 
    } 
      
    function mapCustomVar(param, mappingArray){ 
        if(/^[c|v][0-9]+$/.test(param.name)){ 
            var value = decodeURIComponent(param.value); 
            var character = param.name.substring(0,1); 
            var number = param.name.substr(1); 
              
            switch(character){ 
                case 'c' : 
                    mappingArray["prop" + number] = value; 
                    break; 
                case 'v' :  
                    mappingArray["eVar" + number] = value; 
                    break; 
                case 'h' : 
                    mappingArray["heir" + number] = value; 
                    break; 
            } 
        } 
    } 
      
    function getLinkType(value){ 
        switch(value){ 
            case 'lnk_o': 
                return "Other"; 
            case 'lnk_d': 
                return "Download"; 
            case 'lnk_e': 
                return "Exit"; 
        } 
    } 
      
    function print(params){ 
        var ul = document.createElement("ul"); 
        var isCustom = false; 
          
        for(var key in params){ 
            var value = params[key]; 
            var li = document.createElement("li"); 
              
            li.textContent = key + ": " + value; 
            ul.appendChild(li); 
        } 
          
        if(params.hasOwnProperty("friendlyLinkName")){ 
            ul.className = "custom"; 
        } 
          
        body.appendChild(ul); 
          
        return ul; 
    } 
      
    function clear(){ 
        var uls = body.querySelectorAll("ul"); 
        for(var i = 0; i < uls.length; i++){ 
            var ul = uls[i]; 
            body.removeChild(ul); 
        } 
    } 
      
    return{ 
        init : init, 
        clear : clear 
    } 
      
})(); 
  
document.addEventListener("DOMContentLoaded", function(){ 
    var clear = document.getElementById("clear"); 
    oDebug.init(); 
      
    clear.addEventListener("click", function(){ 
        oDebug.clear(); 
    }, true); 
}, true);