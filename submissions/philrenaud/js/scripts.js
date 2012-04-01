$(document).ready(function(){
    //console.log('document ready');
    universalController();

    $('body').addClass('mobile'); //assume mobile!

}); //document.ready


/*==( ^ Run Universal Functions )======================================================*/

function universalController() {
    //console.log('universalController Fired');
    grabPics();
    getInputty();

}; //universalController



function getInputty(){
    //console.log('getInputty fired');
        $('.inputty').change(function(){
        searchingOn = $('.inputty').val().split('');
        $('.bins').remove();
        $('body').append('<div class="bins"></div>');
        for (i=1;i<=searchingOn.length;i++) {
            //console.log('newbin fired');
            $('.bins').append('<div class="bin'+i+'"></div>');
        }; //for
        //$('body').append($('.inputty').val().split("."));
        grabPics();
    }); //change
}; //getInputty


function grabPics(){
    //console.log('grabPics fired');

    $('.bins').children().each(function(j){
        theLetter = searchingOn[j];
        $(this).append('<span>Letter '+theLetter+'</span>');
        $(this).jflickrfeed({
            flickrbase: 'http://api.flickr.com/services/feeds/',
            feedapi: 'photos_public.gne',
            limit: 1,
            qstrings: {
                lang: 'en-us',
                format: 'json',
                tags: 'Letter '+theLetter+', alphabet',
                jsoncallback: '?'
            },
            cleanDescription: true,
            useTemplate: true,
            itemTemplate: '<a href="{{image_b}}"><img src="{{image_s}}" alt="{{title}}" /></a>',
            itemCallback: function(){}
        });
    }); //each

}; //grabPics