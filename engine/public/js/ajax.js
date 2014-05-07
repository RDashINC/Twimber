function ajax(url, method, data, async)
{
    method = typeof method !== 'undefined' ? method : 'GET';
    async = typeof async !== 'undefined' ? async : false;
    
    if (window.XMLHttpRequest)
    {
        var xhReq = new XMLHttpRequest();
    }
    else
    {
        var xhReq = new ActiveXObject("Microsoft.XMLHTTP");
    }
    
    
    if (method == 'POST')
    {
        xhReq.open(method, url, async);
        xhReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhReq.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xhReq.send(data);
    }
    else
    {
        if(typeof data !== 'undefined' && data !== null)
        {
            url = url+'?'+data;
        }
        xhReq.open(method, url, async);
        xhReq.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xhReq.send(null);
    }
    
	return xhReq.responseText;
	console.log("[ajax] Request Completed.");
}

var ajax_ver = "1.0";
console.log("[ajax] Ajax Version: "+ajax_ver+" Loaded");