//	Use this plugin to show a toolbar sliding by the left
//	Olivier Kaisin 2012
// 	WARNING: This plugin requires a minimal (or a complete) distribution of jQuery

(function($) {
	$.fn.initSideBar = function() {
		// create unique backdrop id
		var backdropID = "backdrop" + (new Date).getTime().toString();
		// append the body with a new backdrop element
		$("body").append("<div id='" + backdropID + "' class='backdrop backdrop-hidden'></div>");
		// set lock disabled
		var backdrop = $("#" + backdropID);
		backdrop.css("visibility", "hidden");
		var self = this;
		backdrop.click(function() {
			self.toggleSideBar()
		});
		// attach our backdrop ID in an attribute
		this.attr("data-backdrop-id", backdropID);
		this.addClass("side-toolbar");
	}

	$.fn.toggleSideBar = function() {
		if(this.hasClass("side-toolbar-opened")) {
			// set closed
			this.removeClass("side-toolbar-opened");
			// find our backdrop ID
			var backdropID = this.attr("data-backdrop-id");
			// hide it
			var backdrop = $("#" + backdropID);
			backdrop.addClass("backdrop-hidden");
			setTimeout(
				function() { backdrop.css("visibility", "hidden"); },
				300
			);
		}
		else {
			// set opened
			this.addClass("side-toolbar-opened");
			// set our backdrop visible
			$("#" + this.attr("data-backdrop-id")).removeClass("backdrop-hidden").css("visibility", "visible");
		}
	} 
})(jQuery);