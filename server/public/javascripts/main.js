$(document).ready(function () {

	// Draw graphics using Sparkline
	$(".sparkline").each(function () {
		var $this = $(this);
		$this.sparkline('html', $this.data());
	});

	// Highlight selected route
	$('#sidebar').find('li.route').each(function () {
		if ($(this).data('route') === window.location.pathname) {
			$(this).addClass('active');
		}
	});

	// Hide un-relevant devices from choice
	$('form#add-product-form').find('input[type="number"], input#enableAllDevices').change(function () {
		var $form = $('form#add-product-form');

		var productTemp = parseInt($('input#product-temp').val());
		var productMargin = parseInt($('input#product-temp-margin').val()) || 0;

		$form.find('select#device').find('option').show();
		if (!$('input#enableAllDevices').is(':checked') && productTemp != NaN) {
			$form.find('select#device').find('option').each(function () {
				if ($(this).data('temp') > productTemp + productMargin || $(this).data('temp') < productTemp - productMargin) {
					$(this).hide();
				}
			});
		}

	});

});
