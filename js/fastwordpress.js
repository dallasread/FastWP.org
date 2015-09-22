(function($){
	$(document).on('click', 'li.show-menu', function() {
		$('body').toggleClass('show-menu');
		return false;
	});
})(jQuery);
