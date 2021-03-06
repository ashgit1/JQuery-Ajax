
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var streetStr = $('#street').val();
    var cityStr   = $('#city').val();
    var address   = streetStr + ', ' + cityStr;
    $greeting.text('So, you want to live at ' + address + '?');
    var streetviewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address + '';
    $body.append('<img class="bgimg" src="' + streetviewUrl + '">');

    // YOUR NY Times Ajax request goes here
    var nytimesUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + cityStr + 
                     '&sort=newest&api-key=0d29525d75fc4359948a5734821da08c'; 
    $.getJSON(nytimesUrl, function(data){

        $nytHeaderElem.text('New York Times Article About ' + cityStr );
        articles = data.response.docs;
        for(var i = 0; i < articles.length; i++ ){
            var article = articles[i];
            $nytElem.append('<li class="article">' + 
                            '<a href="' + article.web_url + '">' + article.headline.main + '</a>' + 
                            '<p>' + article.snippet + '</p>' + 
                            '</li>' 
                        );
        }
    }).error(function(e){
        $nytHeaderElem.text('New York Times Articles could not be loaded');
    });

    // Set a timer for wikipedia. Since jsonp doesn't support error()
    var wikiRequestTimer = setTimeout(function(){
        $wikiElem.text('failed to get Wikipedia resources');
    }, 8000);

    //Wikipedia Ajax request goes here
    var wikiURL = 'http://en.wikipedia.org/w/api.php?action=opensearch&search='+ cityStr + 
                  '&format=json&callback=wikiCallback';
    $.ajax({
        url: wikiURL,
        dataType: "jsonp",
        //jsonp : "callback",
        success : function( response ){
            var articleList = response[1];
            for(var i = 0; i < articleList.length; i++){
                articleStr = articleList[i];
                var url = 'http://en.wikipedia.org/wiki/' + articleStr ;
                $wikiElem.append('<li> <a href="' + url + '">' + 
                                    articleStr + '</a></li>');
            };
            // first comment the below line. After 8 secs the wikipedia error message will appear
            clearTimeout(wikiRequestTimer);
        }
    });

    return false;
    
};

$('#form-container').submit(loadData);
