(function ($) {

// upload 5 photoAddress

$('#trip-photo-input').on('click',()=>{
  $('#trip-photo-input').clone().appendTo(`#formnew`).attr('style', `display:none`);

});

//ends

//delete modal
// $(document).ready(function() {
// 	$('a[data-confirm]').click(function(ev) {
// 		var href = $(this).attr('href');
// 		if (!$('#dataConfirmModal').length) {
// 			$('body').append('<div id="dataConfirmModal" class="modal" role="dialog" aria-labelledby="dataConfirmLabel" aria-hidden="true"><div class="modal-header"><button type="submit" class="close" data-dismiss="modal" aria-hidden="true">×</button><h3 id="dataConfirmLabel">Please Confirm</h3></div><div class="modal-body"></div><div class="modal-footer"><button type="submit" class="btn" data-dismiss="modal" aria-hidden="true">Cancel</button><a class="btn btn-primary" id="dataConfirmOK">OK</a></div></div>');
// 		}
// 		$('#dataConfirmModal').find('.modal-body').text($(this).attr('data-confirm'));
// 		$('#dataConfirmOK').attr('href', href);
// 		$('#dataConfirmModal').modal({show:true});
// 		return false;
// 	});
//   });
//eds here


  $('#submitbut').on('click',()=>{
    if ($('#user-photo-input').val()) {
      console.log('workssss');
      $('#pic').val('true');
      console.log(  $('#pic').val());

    }else if (!$('#user-photo-input').val()){

      $('#pic').val('false');
      console.log(  $('#pic').val());
    }
    $('#edit_form').submit();
  });
    // Init Wow
    wow = new WOW( {
        animateClass: 'animated',
        offset:       100
    });
    wow.init();

    // Navigation scrolls
    $('.navbar-nav li a').bind('click', function(event) {
        $('.navbar-nav li').removeClass('active');
        $(this).closest('li').addClass('active');
        var $anchor = $(this);
        var nav = $($anchor.attr('href'));
        if (nav.length) {
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');

        event.preventDefault();
        }
    });

    // About section scroll
    $(".overlay-detail a").on('click', function(event) {
        event.preventDefault();
        var hash = this.hash;
        $('html, body').animate({
            scrollTop: $(hash).offset().top
        }, 900, function(){
            window.location.hash = hash;
        });
    });

    //jQuery to collapse the navbar on scroll
    $(window).scroll(function() {
        if ($(".navbar-default").offset().top > 50) {
            $(".navbar-fixed-top").addClass("top-nav-collapse");
        } else {
            $(".navbar-fixed-top").removeClass("top-nav-collapse");
        }
    });

    // Testimonials Slider
    $('.bxslider').bxSlider({
      adaptiveHeight: true,
      mode: 'fade'
    });

})(jQuery);
