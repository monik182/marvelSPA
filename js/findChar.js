function find() {


    $finder.on('keydown', function(event) {
        //console.log("event keydown", event.keyCode);

        if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 65 && event.keyCode <= 90) || (event.keyCode == 8)) {
            $characters.html('<p class="text-center spinner"><i class="fa fa-spinner fa-spin fa-6 red" aria-hidden="true"></i></p>');
            $('#sort').addClass('hidden');
        }
    });

    $finder.on('keyup', function(event) {
        //console.log("inside keyup", event.keyCode);
        if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 65 && event.keyCode <= 90) || (event.keyCode == 8)) {


        delay(function(){
            if ($finder.val() == '') {
                console.log("cannot be empty!");
                $characters.html('<p class="text-center message">Search character.</p>');

                $('#loading').modal('hide');
                return;
            } else {
                //console.log($finder.val());
                getChar($finder.val(), function(err, res) {
                    if (err) {
                        console.log("Error", err);

                        $characters.html('<p class="text-center message"><i class="fa fa-exclamation-triangle"></i> ' + err.error + '</p>');
                        $('#pagination').html('');
                        $('#sort').addClass('hidden');

                    } else {
                        //console.log("Data from API", res);

                        var characterList = res.data.results;

                        if (characterList.length == 0) {
                            $characters.html('<p class="text-center message">There are no characters associated with your search.</p>');
                            $finder.val('');
                            $('#sort').addClass('hidden');
                            $('#pagination').html('');
                        } else {
                            formatCharacters(characterList);
                            $('#sort').removeClass('hidden');

                            $('#sort').on('click', function() {
                                //console.log("sort clicked", $('#sort').val());

                                if ($('#sort').val() == '-name') {
                                    characterList.sort(function(a,b) {return (b.name > a.name) ? 1 : ((a.name > b.name) ? -1 : 0);} );

                                } else if ($('#sort').val() == 'name') {
                                    characterList.sort(function(a,b) {return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);} );
                                }

                                formatCharacters(characterList);


                            });


                            var $figure = $('.figure'),
                                $view = $('.view'),
                                comicList = [];


                            $figure.on('click', function(event) {

                                $("#loading").modal({backdrop: "static"});

                                comicList = [];
                                //console.log("this is a figure event", event.target);

                                $figure.addClass('fig');
                                $figure.removeClass('figure');


                                var parent = $($(event.target).parents()[2])[0];
                                //console.log("parent", parent);
                                //console.log('parent id', parent.id);

                                characterList.forEach(function(item, index) {
                                    if (item.id == parent.id) {
                                        //console.log('item', item)

                                        formatComics(item, parent.id, function(err, res) {
                                            if (err) {
                                                $('#comics .modal-title').html('Error');
                                                $('#comics .modal-body').html('<p class="text-center"><i class="fa fa-exclamation-triangle"></i> ' + err.error + '</p>');
                                            } else {

                                                comicList = res.comics;
                                                $('#comics .modal-title').html(res.name);
                                                $('#comics .modal-body').html(res.html);

                                                addRandom(comicList);

                                            }

                                            $('#loading').modal('hide');


                                            $('#comics').modal({backdrop: true});
                                            $('.fig').addClass('figure');
                                            $figure.removeClass('fig');

                                            $('.comicItm').on('click', function(event) {
                                                //console.log("This is a comic", event.target);


                                                $('#comics').modal('hide');

                                                var comic = $($(event.target).parents()[2])[0];
                                                //console.log("parent", comic.id);

                                                var html = "",
                                                    price = "",
                                                    link = "";
                                                comicList.forEach(function(item, index) {
                                                    if (item.id == comic.id) {

                                                        var img = item.images.length > 0 ? (item.images[0].path + '.' + item.images[0].extension) : (item.thumbnail.path + '.' + item.thumbnail.extension);

                                                        //console.log("this comic", item);
                                                        html = '<div class="row"><div class="col-sm-4"><img class="comicThumbnail" src="' + img + '"></div><div class="col-sm-8"><h4 class="title">' + item.title + '</h4><p class="text-justify">' + item.description + '</p></div></div>';


                                                        price = item.prices[0].price || '1.99';
                                                        link = item.urls[0].url || '//marvel.com';

                                                    }
                                                });
                                                $('#comicItm .content').html(html);
                                                $('#comicItm .price').html(price);
                                                $('#comicItm .buy').attr('href', link);
                                                $('#comicItm .add').attr('id', comic.id);

                                                $('.add').removeClass('added');
                                                $('.add .text').text('ADD TO FAVOURITES');
                                                $('.add img').attr('src', 'icons/btn-favourites-default.png');

                                                $('#comicItm').modal({backdrop: true});





                                            });


                                        });

                                    }
                                });

                            }); //figureOn


                            $view.on('click', function(event) {
                                comicList = [];
                                //console.log("view event", event.target);

                                var parent = $($(event.target).parents()[3])[0];
                                //console.log('parent', parent.id);

                                var html = "",
                                    name = "",
                                    price = "",
                                    link = "";
                                characterList.forEach(function(item, index) {
                                    if (item.id == parent.id) {
                                        name = item.name;
                                        html = '<div class="row"><div class="col-sm-4"><img src="' + item.thumbnail.path + '.' + item.thumbnail.extension + '" class="img-circle character" alt="' + item.name + '"></div><div class="col-sm-8"><p class="text-justify">' + item.description + '</p></div></div>';


                                        $('#viewMore .modal-title').html(name);
                                        $('#viewMore .modal-body').html(html);
                                        $('#viewMore').modal({backdrop: true});

                                    }
                                });





                            });//viewOn



                            $('.add').on('click', function(event) {
                                var comic = $(event.target)[0];

                                if (comic.localName == 'img' || comic.localName == 'span') {
                                    comic = $(comic).parents()[0];
                                }

                                //console.log('comic add', comic.id);

                                var repeated = false;
                                myFavourites.forEach(function(item, index) {
                                    if (item.id == comic.id) {
                                        repeated = true;
                                    }
                                });

                                if (!repeated) {
                                    comicList.forEach(function(item, index) {
                                        if (item.id == comic.id) {
                                            //console.log("add this comic", item);
                                            myFavourites.push(item);



                                        }
                                    });
                                    addFavourite(myFavourites);




                                } else {
                                    $('#comicItm').modal('hide');
                                    $('#repeated .modal-title').html('<i class="fa fa-exclamation-triangle"></i> Repeated Comic');
                                    $('#repeated .modal-body').text("You've already added this comic.");
                                    $('#repeated').modal({backdrop: true});
                                }



                            });//add





                        }


                    }
                });
            }
        }, 500 ); //Delay

        }


    });




}











function formatCharacters(data) {

    var characters = [];
    var html = '',
        row = '';
    data.forEach(function(item, index) {
        var count = index + 1;

        var cls = '';
        var view = '<button class="btn redBg view">View More</button>';
        if (item.description.trim().length == 0) {
            item.description = 'No description available.';
            view = '';
            cls = 'noDescription';
        } else if (item.description.length <= 100) {
            view = '';
        }

        row += '<div class="col-sm-6 parent" id="' + item.id + '"> <figure class="character"> <a class="figure"><img src="' + item.thumbnail.path + '.' + item.thumbnail.extension + '" class="img-circle character" alt="' + item.name + '"></a> ' + figCaption(item.name) + '</figure> <div class="square character"> <div class="row"> <div class="col-sm-offset-6 col-sm-6 description"><p class="text-left ' + cls + '">' + truncateText(item.description, 0) + '</p>' + view + '</div> </div> <div class="row related"> <h3>Related Comics</h3> ' + listComics(item.comics.items) + ' </div> </div> </div>';



        if ((count % 2 == 0 && index !== 0) || index == data.length - 1) {
            //console.log("inside add row to html", index);
            html += '<div class="row">' + row + '</div>';
            row = '';
        }


        if ((count % 10 == 0 && index != 0) || index == data.length - 1) {
            //console.log("index before push", index);
            //console.log("html before push", html);

            characters.push(html);
            html = '';
            row = '';
        }



    });

    $characters.html(characters[0]);

    //console.log("characters array", characters);

    $('#pagination').bootpag({
        total: characters.length,
        page: 1,
        maxVisible: 5,
        leaps: true,
        firstLastUse: true,
        //first: '←',
        //last: '→',
        wrapClass: 'pagination',
        activeClass: 'active',
        disabledClass: 'disabled',
        nextClass: 'next',
        prevClass: 'prev',
        lastClass: 'last',
        firstClass: 'first'
    }).on("page", function(event, num){
        //console.log("num", num);
        $characters.html(characters[num - 1]);
    });




}



function listComics(comics) {

    var length = comics.length;

    if (length > 4) {
        length = 4;
    } else if (length == 0) {
        return '<p class="text-center noDescription">No available comics.</p>';
    }

    var html = '';

    for (var i = 0; i < length; i++) {
        if (i % 2 == 0) {
            if (i !== 0) {
                html += '</ul></div>';
            }

            html += '<div class="col-sm-6"><ul>';
        }


        html += '<li>' + truncateText(comics[i].name, 1) + '</li>'

        if (length % 2 != 0 && i == length - 1 || i == length - 1) {
            html += '</ul></div>';
        }

    }

    //console.log("comic html", html);
    return html;


}


function figCaption (text) {
    var cls = '';

    if (text.length > 16) {
        cls = 'captionSm';
    } else {
        cls = 'captionLg';
    }
    text = '<figcaption class="' + cls + '"><a class="figure">' + text + '</a></figcaption>'

    return text;
}

function truncateText(text, type) {

    var length = type == 0 ? 100 : 42;

    if (text.length > length) {
        text = text.substring(0, length) + '...';
    }
    return text;
}



var delay = (function(){
    var timer = 0;
    return function(callback, ms){
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
    };
})();



function getChar(text, callback) {

    var url = 'https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=' + text + '&limit=100&apikey=fcdc0d88c77212285a0bbe0a6ab1774a';

    $.getJSON(url, function() {
        //console.log( "success" );
    })
    .done(function(data) {
        //console.log( "second success" );
        callback(null, data);

    })
    .fail(function() {
        //console.log( "error" );
        callback({error: 'We reached our target server, but it returned an error'});

    });

}
