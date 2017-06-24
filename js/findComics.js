

function formatComics(item, id, callback) {

    //console.log("comics", item.comics.items);


    var url = 'https://gateway.marvel.com:443/v1/public/characters/' + id + '/comics?format=comic&formatType=comic&limit=100&apikey=fcdc0d88c77212285a0bbe0a6ab1774a';

    $.getJSON(url, function() {
        //console.log( "success" );
    })
        .done(function(data) {
        //console.log( "second success" );

        //console.log("The comics", data);
        var comics = data.data.results,
            content = "",
            row = "";

        if (comics.length > 0) {
            comics.forEach(function(item, index) {
                var count = index + 1;

                var img = item.images.length > 0 ? item.images[0] : item.thumbnail;

                //console.log("comic item", item);
                row += '<div class="col-sm-4 parent text-center" id="' + item.id + '"> <figure class="comic"> <a class="comicItm"><img src="' + img.path + '.' + item.thumbnail.extension + '" class="comic" alt="' + item.title + '"> <figcaption class="title">' + item.title + '</figcaption> </a> </figure> </div>';



                if ((count % 3 == 0 && index !== 0) || index == comics.length - 1) {
                    //console.log("inside add row to html", index);
                    content += '<div class="row comic">' + row + '</div>';
                    row = '';
                }

            });

        } else {
            content = 'No available comics.';
        }




        //console.log("comic content", content);

        var button = comics.length > 0 ? "   <button id='addRandom' class='redBg btn btn-xs'>Add 3 comics to favourites!</button>" : "";

        var html = '<p class="text-justify">' + item.description + '</p> <h4>Related Comics ' + button + '</h4>' + content;
        var resp = {
            name: item.name,
            html: html,
            comics: comics
        };

        callback(null, resp);

    })
        .fail(function() {
        //console.log( "error" );
        callback({error: 'We reached our target server, but it returned an error'});
    });


}
