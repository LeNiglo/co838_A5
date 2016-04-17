$(document).ready(function () {

	$(".sparkline").each(function () {
		var $this = $(this);
		$this.sparkline('html', $this.data());
	});

	$('#sidebar').find('li.route').each(function () {
		if ($(this).data('route') === window.location.pathname) {
			$(this).addClass('active');
		}
	});

});
