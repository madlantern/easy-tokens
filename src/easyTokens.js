
window.onload = function() {
// Check if Jquery is already loaded, if not, load the jquery magic! Then load the instant sort list. Borrowed most of this from someone else's example, because it is awesome and works well.
    (function(url, position, callback){
        // default values
        url = url || 'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js';
        position = position || 0;

        // Check is jQuery exists
        if (!window.jQuery) {
            // Jquery not loaded -- insert jquery!
            // Initialize <head>
            var head = document.getElementsByTagName('head')[0];
            // Create <script> element
            var script = document.createElement("script");
            // Append URL
            script.src = url;
            // Append type
            script.type = 'text/javascript';
            // Append script to <head>
            head.appendChild(script);
            // Move script on proper position
            head.insertBefore(script,head.childNodes[position]);

            script.onload = function(){
                if(typeof callback == 'function') {
                    callback(jQuery);
                }
            };
        } 
        else {
            if(typeof callback == 'function') {
                callback(jQuery);
                // Jquery already loaded!             
            }
        }
    }('https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js', 5, function($){ 
        // Stuff that happens after jquery init confirmed (this case, call our token builder doorway function)
        easyTokens();
    }));

}


function easyTokens(){
// Jquery is loaded, let's build the token functionality!

    // Add the CSS (Find where the instant filter list files are stored and add the CSS file.)
    var easyTokensDir = $('script[src*="easyTokens-dist.js"').attr('src'),
        easyTokensCSS = (easyTokensDir.substr(0, easyTokensDir.indexOf('easyTokens-dist.js'))) + 'easyTokens-dist.css'; 
    $('head').append('<link rel="stylesheet" href="' + easyTokensCSS + '" type="text/css" />');

    // Check for tokens and styles
    $('.madln-easyTokens').each(function() {
        if ($(this).attr('data-filter-style') != undefined){
            $(this).addClass(($(this).attr('data-filter-style')));
        }
    });

    // Find any defined data sources and capture each one
    $('input[data-madln-token-rule]').each(function() {
        var dataSource = $(this).attr('value'), //fetches data source url from input
            dataSourceName = $(this).attr('name'), //fetches data source name from input
            dataSourceRefreshDays = $(this).attr('data-madln-token-refresh-days'), //fetches setting for how many days before data should refresh
            dateNow = (Date.now())/86400000; //gives alue of days since 1970
        
        if(dataSourceRefreshDays == undefined || dataSourceRefreshDays == '' || isNaN(dataSourceRefreshDays)){
            // refresh days was not provided or is invalid -- resetting back to 1
            dataSourceRefreshDays = 1;
        }
        
        // Check that datasource was not set blank or not defined, then check that local storage is not already set within last defined timeframe
        if ( dataSource != undefined && dataSource != '' && dataSourceName != undefined && dataSourceName != '') {
        
            if( localStorage.getItem(dataSourceName) == undefined || localStorage.getItem(dataSourceName) == '' || 
                localStorage.getItem('madln-token-date') == undefined || localStorage.getItem('madln-token-date') == '' ){
                // local storage items not set. Try to load them from source.
                loadData(dataSource, dataSourceName, dateNow);          
            }
            else {
                // local storage item IS set. Only refresh data if older than defined number of days.
                var cachedDate = localStorage.getItem('madln-token-date'),
                    elapsedDays = dateNow - cachedDate;
                if(elapsedDays > dataSourceRefreshDays){
                    // Data was last loaded longer than defined amount of time ago, reload from source.
                    loadData(dataSource, dataSourceName, dateNow);
                }  
                else{
                    readTokens(dataSourceName);
                }
            }
            
        }
    });

}

function loadData(dataSource, dataSourceName, dateNow){

    $.getJSON( dataSource, function( data ) {
        // Try loading the data source and caching it in storage
        localStorage.setItem(dataSourceName, JSON.stringify(data));    
        localStorage.setItem('madln-token-date', dateNow);
        readTokens(dataSourceName);
    })

    .fail(function() {
        // If we failed to load data from the source...
        console.error('Easy Tokens: Failed to load data from source (' + dataSource + ');');
    });

}

function readTokens(dataSourceName) {

    // Read the stored tokens from local storage
    var gotFromStorage = jQuery.parseJSON(localStorage.getItem(dataSourceName));

    // Resolve the instances of individual tokens
    $.each($('span.madln-easyTokens'), function(i, item) {
        var whichToken = $(this).attr('data-madln-token-find'),
            tokenBuild = 'gotFromStorage.' + whichToken,
            tokenValue = eval(tokenBuild); // Changes the string from tokenBuild into a variable name, which is what we need to fish out the value we need from the object.
        if(tokenValue == undefined || tokenValue == ''){
            tokenValue = '(value unavailable)';
        }
        $(this).text(tokenValue);

    });  

    // Set up any token tables and resolve tokens
    $.each($('table.madln-easyTokens'), function(i, item) {
        var actOnElement = $(this),
            rowCount = 0,
            objectItemCount = (Object.keys(gotFromStorage)).length;
        $.each(gotFromStorage, function(i, item) {
            actOnElement.append('<tr>');
            $.each(item, function(i, item) {
                actOnElement.find('tr:eq(' + rowCount + ')').append('<td>' + item + '</td>');
            });  
            actOnElement.append('</tr>');
            rowCount ++;
            if(rowCount == (objectItemCount)){
                actOnElement.prepend('<tr></tr>');         
                $.each(item, function(i, item) {
                    actOnElement.find('tr:eq(0)').append('<th>' + i + '</th>');
                }); 
            }
        });  
    });  

    // Set up any token lists and resolve tokens
    $.each($('ol.madln-easyTokens, ul.madln-easyTokens'), function(i, item) {
        var actOnElement = $(this),
            rowCount = 0,
            objectItemCount = (Object.keys(gotFromStorage)).length;
        $.each(gotFromStorage, function(i, item) {
            actOnElement.append('<li>');
            $.each(item, function(i, item) {
                actOnElement.find('li:eq(' + rowCount + ')').append('<span class="itemLabel">' + i + ':</span> ' + '<span class="itemName">' + item + '</span> <br />');
            });  
            actOnElement.append('</li>');
            rowCount ++;
        });  
    }); 
    
}

