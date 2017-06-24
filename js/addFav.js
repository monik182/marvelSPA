
function addFavourite(array) {
    localStorage.setItem("myFavourites", JSON.stringify(array));
    //console.log("ADDED TO LOCAL STORAGE", localStorage.myFavourites);



    var html = "",
        row = "";

    array.forEach(function(item, index) {

        var img = item.images.length > 0 ? (item.images[0].path + '.' + item.images[0].extension) : (item.thumbnail.path + '.' + item.thumbnail.extension);

        row = '<div class="row favourite" id="' + item.id + '"><span class="delete"><img class="delete" src="icons/btn-delete.png" alt="Delete"></span><div class="col-sm-12 text-center"><img class="favourite" src="' + img + '" alt="' + item.title + '"><h4>' + item.title + '</h4></div></div>';

        html += row;

    });

    $('#favourites').html(html);
    $('.add img').attr('src', 'icons/btn-favourites-primary.png');
    $('.add .text').text('ADDED TO FAVOURITES');
    $('.add').addClass('added');

    $('img.delete').on('click', function(event) {
        //console.log("DELETE", event.target);

        var parent = $($(event.target).parents()[1])[0];
        //console.log("parent delete", parent);

        myFavourites.forEach(function(item, index) {
            if (item.id == parent.id) {
                myFavourites.splice(index, 1);
                localStorage.clear();
                //console.log("localStorage", localStorage);
                localStorage.setItem("myFavourites", JSON.stringify(myFavourites));

            }
        });
        //console.log("myFav after delete", myFavourites);
        $('#' + parent.id).remove();


    });

    setTimeout(function() {
        $('#comicItm').modal('hide');
    }, 1000);

}



function addRandom(comicList) {
    $('#addRandom').on('click', function() {
        var selected = [],
            length = comicList.length <= 3 ? comicList.length : 3;

        var counter = 0;
        while (selected.length < length) {
            if (counter == comicList.length) {
                break;
            }
            var random = Math.floor(Math.random() * comicList.length);
            var added = false;
            //console.log("random number", random);
            myFavourites.forEach(function(item, index) {
                if (item.id == comicList[random].id) {
                    added = true;
                }
            });
            if (!added) {
                selected.push(random);
                myFavourites.push(comicList[random]);
            }
            counter++;
        }
        //console.log("all Selected", selected);
        //console.log('myFavourites', myFavourites);
        addFavourite(myFavourites);

        $('#added').modal({backdrop: false});

        setTimeout(function(){
            $('#added').modal('hide');
        }, 700);

    });
}
