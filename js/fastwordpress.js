(function($){
	$(document).on('click', 'li.show-menu', function() {
		$('body').toggleClass('show-menu');
		return false;
	});

    $(document).on('ready', function() {
        // $.get('https://twitter.com/dallasread.json', function(tweets) {
        //     var tweet, i;

        //     for (var key in tweets) {
        //         if (i > 5) return;

        //         tweet = tweets[key];

        //         $('.tweets').prepend('<li><p class="body">' + tweet.body + '</p><p class="date">' + tweet.publishedAt + '</p></li>');

        //         i++;
        //     }
        // });
    });
})(jQuery);
