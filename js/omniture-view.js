var OmnitureView = (function(){ 

    function create(){
      var omnitureView = {};
      omnitureView.dom = {};
      bind(omnitureView);
      omnitureView.gatherSelectors();
      omnitureView.attachEvents(); 
    }
    
    function bind(omnitureView){
      omnitureView.gatherSelectors = gatherSelectors.bind(omnitureView);
      omnitureView.attachEvents = attachEvents.bind(omnitureView);
      omnitureView.onRequestFinished = onRequestFinished.bind(omnitureView);
      omnitureView.print = print.bind(omnitureView);
    }
    
    function gatherSelectors(){
      this.dom.requests = document.getElementById("requests");
      this.dom.clearButton = document.getElementById("clear");
    }
      
    function onRequestFinished(requestData){ 
      var request = requestData.request; 
      var url = request.url; 
      var queryParams = request.queryString; 
          
      if(/b\/ss\//g.test(url)){ 
        var mappedParams = mapParams(queryParams); 
        var ul = this.print(mappedParams);
        this.dom.requests.appendChild(ul); 
        ul.scrollIntoView(true); 
      } 
    } 
      
    function attachEvents(){ 
      chrome.devtools.network.onRequestFinished.addListener(this.onRequestFinished);
      this.dom.clearButton.addEventListener("click", clear.bind(this, this.dom.requests));
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
        case 'products':
            mappingArray.products = value;
            break;
        case 'ch':
            mappingArray.channel = value; 
            break;
        case 'cc':
            mappingArray.currencyCode = value;
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
      
      var masterLi = document.createElement("li");
      masterLi.appendChild(ul);

      return masterLi;
    } 
      
    function clear(node){ 
      while (node.firstChild) {
        node.removeChild(node.firstChild);
      }
    } 
      
    return{ 
      create : create
    } 
      
})(); 