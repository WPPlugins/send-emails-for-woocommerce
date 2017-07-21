(function($) {
	$( document ).ready( function() {
		
		// WooCommerce Order Admin Page
		// ----------------------------------------
		
		// From HTML string
		$('#preview-email-button').click(function(event) {
			
			var val_email_type;
			if ( $("select#cxsemls_order_action" ).val() != "") val_email_type = $( "select#cxsemls_order_action" ).val().replace("send_email_","");
			else val_email_type = "new_order";
			
			var val_email_order = $( "#post_ID" ).val();
			
			var new_src = "";
			new_src += woocommerce_send_emails.admin_url;
			new_src += "/admin.php?";
			new_src += "page=woocommerce_send_emails";
			new_src += "&";
			new_src += "cxsemls_render_email=yes";
			new_src += "&";
			new_src += "cxsemls_email_type=" + val_email_type;
			new_src += "&";
			new_src += "cxsemls_email_order=" + val_email_order;
			new_src += "&";
			new_src += "cxsemls_in_popup=true";
			
			email_control_popup(new_src);

			return false;

		});
		
		function email_control_popup(src) {
			
			cxsemls_loading({ backgroundColor: "rgba(0,0,0,0)" });
			
			jQuery.magnificPopup.open({
				items: {
					src:	src,
					type:	"iframe"
				},
				//closeBtnInside: true,
				overflowY: false,
				closeOnBgClick:	true,
				closeMarkup: '<button title="%title%" class="mfp-close button-primary"><i class="mfp-close-icn">&times;</i></button>',
				mainClass: 'cxsemls-mfp',
			});
			
		}
		
		$('select#cxsemls_order_action').change(function() {
			
			if ( $(this).val().indexOf("send_email") != -1 ) {
				$('#actions').after( $('#preview-email-row') );
				//$('#preview-email-row').css({display:"block"});
				$('#actions .button.wc-reload').fadeOut(150);
				$('#preview-email-row').slideDown(150);
			}
			else {
				//$('#preview-email-row').css({display:"none"});
				$('#actions .button.wc-reload').fadeIn(150);
				$('#preview-email-row').slideUp(150);
			}
			
		});
		
		$('#send-email').click(function(event) {
			
			var val_email_type;
			if ( $("select#cxsemls_order_action" ).val() != "" )
				val_email_type = $( "select#cxsemls_order_action" ).val().replace("send_email_","");
			else
				val_email_type = "new_order";
			
			var val_email_type_name;
			if ( $("select#cxsemls_order_action" ).val() != "" )
				val_email_type_name = $( "select#cxsemls_order_action :selected" ).text().trim();
			else
				val_email_type_name = 'New Order';
			
			var val_email_order = $( "#post_ID" ).val();
			var val_billing_email = $("#_billing_email").val();
			
			var email_prompt = prompt( "Send a '" + val_email_type_name + "' Email to:", val_billing_email );
			if (email_prompt != null)
				val_billing_email = email_prompt;
			else
				return; // Bail if no email address.
			
			// Display loading text.
			cxsemls_loading({ text: "Sending Email" });
			
			jQuery.ajax({
				type:     "post",
				dataType: "json",
				url:      woocommerce_send_emails.ajaxurl,
				data: {
					action                   : "cxsemls_send_email",
					cxsemls_email_type       : val_email_type,
					cxsemls_email_order      : val_email_order,
					cxsemls_email_addresses  : val_billing_email,
					cxsemls_send_email_nonce : woocommerce_send_emails.send_email_nonce,
				},
				success: function( data ) {
					
					if ( 'incorrect-email-format' == data.status ) {
						cxsemls_loading_end();
						cxsemls_notify( "The email address you provided is not vaild.", { id: "second-thing" } );
						return false;
					}
					
					cxsemls_loading_end();
					cxsemls_notify( "Email Sent!", { id: "second-thing" } );
				},
				error: function(xhr, status, error) {
					cxsemls_loading_end();
					cxsemls_notify( "Email sending failed!", { id: "second-thing" } );
				}
			});

			return false;
			
		});


		function cxsemls_notify( content, options ) {
			
			// set up default options
			var defaults = {
				id:				false,
				display_time:	5000,
			};
			options = jQuery.extend({}, defaults, options);
			
			// Check the holder element is on the page.
			if ( ! $("#cxsemls-notification-holder").length ) {
				$("body").append( '<div id="cxsemls-notification-holder"></div>' );
			}
			
			// Check if  a notification with same id on the page already.
			var $existing_element = $(".cxsemls-notification-" + options.id );
			if ( $existing_element.length ) {
				
				// Fade out existing notification.
				$existing_element.addClass('cxsemls-notification-fade-out');
				
				// Remove existing notification.
				setTimeout( function() {
					$existing_element.remove();
				}, 1000 );
			}
			
			// Create the new notification element.
			var $new_element = $( '<div/>', {
				class : "cxsemls-notification cxsemls-notification-hidden cxsemls-notification-" + options.id,
				text  : content,
			});
			
			// Add new notification to page.
			$("#cxsemls-notification-holder").append( $new_element );
			
			// Reveal the new notification.
			$new_element.removeClass( 'cxsemls-notification-hidden' );
			
			// Fade-out the new notification.
			var element_timeout = setTimeout(function() {
				$new_element.addClass( 'cxsemls-notification-hidden' );
			}, options.display_time );
			
			// Remove new notification.
			setTimeout(function() {
				$new_element.remove();
			}, options.display_time + 1000 );
		}
		
		
		// Loading Testing
		if (false) {
			time_interval = 3000;
			setTimeout(function() { /* cxsemls_loading(); */ }, 0 * time_interval);
			setTimeout(function() { /* cxsemls_loading( { text: "Loadski!..." } ); */ }, 1 * time_interval);
			setTimeout(function() { /* cxsemls_loading_end(); */ }, 2 * time_interval);
			
			time_interval = 300;
			setTimeout(function() { /* cxsemls_notify("First thing done!", {id: "first-thing"}); */ }, 0 * time_interval);
			setTimeout(function() { /* cxsemls_notify("Second thing done!", {id: "second-thing", size: "large"}); */ }, 1 * time_interval);
			setTimeout(function() { /* cxsemls_notify("First thing done again!", {id: "first-thing"}); */ }, 2 * time_interval);
			setTimeout(function() { /* cxsemls_notify("Third thing done!", {id: "third-thing"}); */ }, 3 * time_interval);
			setTimeout(function() { /* cxsemls_notify("Fourth thing done!", {id: "fourth-thing", display_time:10000}); */ }, 4 * time_interval);
			setTimeout(function() { /* cxsemls_notify("Fifth thing done!", {id: "fifth-thing", size: "medium"} ); */ }, 5 * time_interval);
			setTimeout(function() { /* cxsemls_notify("Third thing done again!", {id: "third-thing"} ); */ }, 6 * time_interval);
			setTimeout(function() { /* cxsemls_notify("Sixth thing done!", {id: "sixth-thing"} ); */ }, 7 * time_interval);
		}
	});

	$( window ).load( function() {
		
		if ( $("#cxsemls-template").length ) {
			parent.cxsemls_resize_frames();
		}
		
	});
	
})( jQuery );


function cxsemls_resize_frames() {
	
	// End the Loading Spinner
	parent.cxsemls_loading_end();

	// Show the Popup
	jQuery( parent.document ).find('.mfp-content').addClass('mfp-show');
}


function cxsemls_loading(options) {
			
	// set up default options
	var defaults = {
		id:      false,
		text: "Loading...",
		backgroundColor: "rgba(0,0,0,.3)"
		
	};
	options = jQuery.extend({}, defaults, options);
	
	if ( !jQuery(".cx-loading-holder").length ) {
		jQuery("body").append('<div class="cx-loading-holder" style="display: none; background-color:' + options.backgroundColor + '; "><div class="cx-loading-inner-holder"><div class="cx-loading-graphic"></div><div class="cx-loading-text"></div></div></div>' );
	}
	
	jQuery(".cx-loading-text").append( options.content );
	jQuery(".cx-loading-holder").fadeIn(300);
}


function cxsemls_loading_end() {
	
	jQuery(".cx-loading-holder").fadeOut(300, function() {
		jQuery(this).remove();
	});
}
