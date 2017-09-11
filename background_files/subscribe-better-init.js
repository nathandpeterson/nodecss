/**
 * @file
 * Initializes the Subscribe Better modal.
 */

(function ($, Drupal, window, document, undefined) {

  Drupal.behaviors.linuxNewsletter = {
    attach: function(context, settings) {
      // Subscribe Better settings.
      // @see https://github.com/peachananr/subscribe-better

      // @todo Is the delay long enough? Stakeholder input?
      // @todo Is there a way to query Pardot for authenticated users in case
      // their cookie is nuked?
      // @todo Do we want to introduce a hidden field in the User entity so
      // we can log if authenticated users have or have not already seen
      // this modal?

      // Check to see if a cookie has been set saying user has seen popup.
      if (!Cookies.get('has_seen_newsletter_popup')) {
        $('.subscribe-me').subscribeBetter({
          trigger: 'onidle',
          animation: 'fade',
          delay: 250,
          showOnce: true, // @todo Change this back to true.
          // Bug: Setting autoClose to true causes the modal to never appear.
          autoClose: false,
          scrollableModal: false,
        });

        // Set cookie so user does not see the pop-up for 60 days.
        Cookies.set('has_seen_newsletter_popup', 1, { expires: 60 });
      }

      // Add ESC key support to close the modal.
      $(document).keyup(function(e) {
        if (e.keyCode == 27) {
          $('.subscribe-me').closeWindow();
        }
      });

      // Add simple form validation before submission.
      // @todo This would be nicer to do via Form API.
      $('.subscribe-me form').submit(function(e) {
        // Don't automatically submit the form.
        e.preventDefault();

        // Set simple check to display error.
        var validForm = true;

        // Make sure all required fields are filled out.
        $('.required').each(function() {
          if ($.trim($(this).val()).length == 0) {
            $(this).addClass('error');
            validForm = false;
          }
          else {
            $(this).removeClass('error');
          }
        });

        // Display error if the form has an empty required field.
        if (!validForm) {
          // Remove any previous errors before rendering a new one.
          $('.subscribe-me p.form-error').remove();
          $('<p class="form-error">Please fill out all fields</p>').insertBefore('.subscribe-me form');
          return false;
        }

        // Ensure email fields are actually email address before submitting.
        var emailAddress = $('#sb-email').val();
        var emailRegex = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;;
		    if (!emailRegex.test(emailAddress)) {
          validForm = false;
          $('#sb-email').addClass('error');
        }
        else {
          $('#sb-email').removeClass('error');
        }

        // Display error the user hasn't entered a valid email address.
        if (!validForm) {
          // Remove any previous errors before rendering a new one.
          $('.subscribe-me p.form-error').remove();
          $('<p class="form-error">You must enter a valid email address.</p>').insertBefore('.subscribe-me form');
          return false;
        }
        else {
          // Serialize form data so we can submit to Pardot.
          var formData = $(this).serialize();

          // Get the POST url.
          var postUrl = $('.subscribe-me form').attr('action');

          // Try to send the data to Pardot.
          var formPost = $.post(postUrl, formData);
          // @todo the .success() and .fail() functions do no work because
          // Pardot always returns an error (even on success).
          formPost.always(function(data) {
            // Set a cookie for one year, as they've signed up.
            Cookies.set('has_seen_newsletter_popup', 1, { expires: 365 });

            // Set a success message.
            $('<p class="form-success">Thank you for subscribing to our newsletter! Please check your inbox for a confirmation message.</p><p class="form-success form-success-close"><a href="#close" class="sb-close-text">Close</a></p>').insertBefore('.subscribe-me form');

            // Remove the subscription form and any errors.
            $('.subscribe-me form').remove();
            $('.subscribe-me p.form-error').remove();
            // Remove subscription prompt hed and dek.
            $('.subscribe-me .sb-header-text').remove();

            // Bind an action to the close button.
            $('.subscribe-me a.sb-close-text').click(function() {
              $('.subscribe-me').closeWindow();
            });
          });
        }
      });
    }
  };

})(jQuery, Drupal, this, this.document);
