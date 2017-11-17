

// Section control
var currentSection = 1,
    loadTimer = null;

$('#fullpage').fullpage({
    menu: '#menu',
    anchors: ['intro', '2016', '2015', '2014', '2013', '2012', '2011', '2010', '2009', '2008', '2007', '2006', '2005', '2004', '2003', '2002', '2001', '2000', 'jumper', 'outro', 'footer'],
    sectionsColor: ['transparent', '#000000', '#292d32', '#000000', '#292d32', '#000000', '#292d32', '#000000', '#292d32', '#000000', '#292d32', '#000000', '#292d32', '#000000', '#292d32', '#000000',  '#292d32', '#000000', '#292d32', '#000000','#292d32', '#000000'],
    autoScrolling: false,
    fitToSection: false,
    bigSectionsDestination: 'top',
    paddingTop: '36px',
    onLeave: function(index, nextIndex, direction) {
        currentSection = nextIndex;
        enteredSection(currentSection);
    }
});

function enteredSection(sectionNumber) {
    if (loadTimer !== null) {
        clearTimeout(loadTimer);
        loadTimer = null;
    }

    loadTimer = setTimeout(function() {
        loadContent(sectionNumber);
    }, 500);
}



//Create initial carousel
function carousel(){

    var year = (new Date().getFullYear()) - 1;
    var dateToSearchFor = getDateToSearchFor(year);

    slidesurl = 'http://www.rte.ie/sitesearch/newsnowlive/select/?q=*:*&fq=type:article&fq=sub_type:newsdocument&fq=pillar:news&fq=date_created:[' + dateToSearchFor + 'T00:00:00Z TO ' + dateToSearchFor + 'T23:59:59Z]&sort=date_modified desc&rows=3&wt=json';


    slides = "";

    $.ajax({
        'url': slidesurl,
        'success': function (data) {
            articles = data.response.docs;

            $.each(articles, function (i, article) {
                img = (article.thumbnail_refcode=="")?"000ba79f":article.thumbnail_refcode;
                slide = '<div style="background:-moz-linear-gradient(top,rgba(255,255,255,0) 0%,rgba(0,0,0,1) 100%),url(https://img.rasset.ie/' + img + '-800.jpg) no-repeat;\
                background:-webkit-linear-gradient(top,rgba(255,255,255,0) 0%,rgba(0,0,0,1) 100%),url(https://img.rasset.ie/' + img + '-800.jpg) no-repeat;\
                background:linear-gradient(to bottom,rgba(255,255,255, 0) 0%,rgba(0,0,0, 1) 100%),url(https://img.rasset.ie/' + img + '-800.jpg) no-repeat; background-size: cover;\
                "></div>';
                slides = slides + slide;
            });

            $('#carousel').html(slides);
            $('body').addClass('loaded');

        },
        'dataType': 'jsonp',
        'jsonp': 'json.wrf'
    });




}

//will prob use moment.js for this stuff
todaysDate = function() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd
    }

    if (mm < 10) {
        mm = '0' + mm
    }

    today = mm + '/' + dd + '/' + yyyy;
    return today
};


getDateToSearchFor = function(year) {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    //January is 0!
    var yyyy = (typeof year != 'undefined') ? year : today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd
    }

    if (mm < 10) {
        mm = '0' + mm
    }

    today = yyyy + '-' + mm + '-' + dd;
    return today

};

function loadContent(sectionNumber) {
    var $el = $('#section' + (sectionNumber - 2));

    if ($el.attr('data-rendered') === 'true' || !$el.attr('data-anchor')) {
        return;
    }

    var $spinner = $el.find('.loader'),
        $container = $el.find('.load-async');

    if (!$container.length) {
        return;
    }

    $spinner.css('visibility', 'visible');

    var year = $($el).data('anchor');
    var dateToSearchFor = getDateToSearchFor(year);


    dateurl = 'http://www.rte.ie/sitesearch/newsnowlive/select/?q=*:*&fq=-(categories:weather and categories:nuacht)&fq=type:article&fq=sub_type:newsdocument&fq=pillar:news&fq=date_created:[' + dateToSearchFor + 'T00:00:00Z TO ' + dateToSearchFor + 'T23:59:59Z]&sort=date_modified desc&rows=100&wt=json';


    items = "";

    $.ajax({
        'url': dateurl,
        'success': function (data) {
            articles = data.response.docs;


            $sectionContainer = $container.parent();

            $.each(articles, function (i, article) {

                img = article.thumbnail_refcode;
                imgClass = "";

                if(img == ""){
                    imgClass = "no-image";
                    img = "000ba79f";
                }


                items = items + '<li><a href="'+article.url+'" class="event '+ imgClass +'" target="_blank" data-id="'+article.id+'"> \
                <img src="https://img.rasset.ie/' + img + '-800.jpg"  class="gallery" /> \
                <div class="event-description"> \
                    <span class="event-date">' + article.title + '</span> \
                    ' + article.excerpt + '\
                </div> \
                </a></li>';
            });

            $list = "<ul>" + items + "</ul>";

            $($sectionContainer).find('.load-async').html($list);

            $spinner.css('visibility', 'hidden');
            $container.css({
                'visibility': 'visible',
                'opacity': 1
            });
            $el.attr('data-rendered', 'true');

        },
        'dataType': 'jsonp',
        'jsonp': 'json.wrf'
    });

}


// Menu
var $header = $('#header'),
    $nav = $('.menu-container'),
    lastScrollTop = 0,
    delta = 5,
    doNotHide = false,
    doNotHideTimeout = null,
    navbarHeight = $header.outerHeight();


function hasScrolled() {
    var st = $(window).scrollTop();

    if (Math.abs(lastScrollTop - st) <= delta) {
        return;
    }

    if (st > lastScrollTop && st > navbarHeight) {
        // Scroll Down
        $header[0].className = 'nav-up';

        if( $nav.hasClass('open') ){
                $nav.removeClass('open');
                $('#year-toggle').removeClass('open');
        }

    } else {
        // Scroll Up
        if (st + $(window).height() < $(document).height()) {
            $header[0].className = 'nav-down';
        }
    }

    lastScrollTop = st;
}

// Register the event handler after 1 second after the page has loaded
setTimeout(function() {
    $(window).on('scroll', function() {
        !doNotHide && hasScrolled();
    });
}, 1000);

// If the page changes height, rebuild
var oldHeight = $(window).height();
$(window).on('resize', function() {
    var currHeight = $(window).height();

    if (Math.abs(currHeight - oldHeight) > 100) {
        $.fn.fullpage.reBuild();
        oldHeight = currHeight;
    }
});


$('#year-toggle').click(function(e){
    $(this).toggleClass("open");
    $('.menu-container').toggleClass("open");
});

$(document).on('click touchstart', '.accordion-button > a', function(e) {
    e.preventDefault();

    var button = $(this).parent(),
        slidesSuperContainer = button.siblings('.fp-slides').eq(0),
        slidesContainer = slidesSuperContainer.find('.fp-slidesContainer'),
        slides = slidesContainer.children()/*,
        imgsToLazyLoad = slidesContainer.find('img[data-src]');*/

    slides.removeClass('active fp-slide fp-table');
    slides.css('width', '100%');
    slidesContainer.css('width', '100%');
    slidesSuperContainer.addClass('no-transition');

    button.animate({'opacity': 0}, {
        'duration': 1000,
        'complete': function() {
            slidesSuperContainer.show();
        }
    });
});

$( document ).ready(function() {
   carousel();
});
