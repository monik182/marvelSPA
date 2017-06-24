function ready(fn) {
    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}
ready(init);

var $finder = $('#finder'),
    $characters = $('#characters'),
    myFavourites = [];

function init() {
    myFavourites = JSON.parse(localStorage.getItem("myFavourites")) || [];
    //console.log("inside init!", myFavourites);

    if (myFavourites) {
        addFavourite(myFavourites);
    }

    find();
}
