/**
 * Custom theme JavaScript code used sitewide
 */
(function ($) {

  /* @functionality: refresh accordions on resize */
  /*
  Drupal.behaviors.accordionRefresh = {
    attach: function (context, settings) {
      if ($(".ui-accordion", context).length > 0) {
        $(".ui-accordion", context).accordion("resize");
        $(window).bind('resize', function() {
          $(".ui-accordion", context).accordion("resize");
        });
      }
    }
  }
  */

  /* @functionality: makes videos responsive */
  Drupal.behaviors.fluidVideos = {
    attach: function (context, settings) {
      if ($(".embedded-video", context).length > 0) {
        $(".embedded-video", context).fitVids();
      }
    }
  }

  /* @functionality: Hides and shows the comments listing on review overlay. */
  Drupal.behaviors.showHideComments = {
    attach: function (context, settings) {
      $(".page-cfp .pane-node-comments h2.pane-title").click(function () {
        $(".page-cfp .pane-node-comments .pane-content").slideToggle();
      });
    }
  };

  /* @functionality: Conditionally add divider class to ensure height of bar is consistent. */
  Drupal.behaviors.sponsorDividerConditional = {
    attach: function (context, settings) {
      $("#mini-panel-event_diamond_platinum_gold_spon .region, #mini-panel-event_silver_bronze_sponsors .region").each(
        function(){
          if ($(this).find(".views-row").length) {
            if($(this).prev().height() > $(this).height()) {
              $(this).prev().addClass('right-border');
            }
            if($(this).next().height() >= $(this).height()) {
              $(this).next().addClass('left-border');
            }
          }
        }
      );
    }
  };

  var hasFlash = function(){
    try {
      var fo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
      if (fo) {
        return true;
      }
    } catch (e) {
      if (navigator.mimeTypes
            && navigator.mimeTypes['application/x-shockwave-flash'] != undefined
            && navigator.mimeTypes['application/x-shockwave-flash'].enabledPlugin) {
        return true;
      } else {
        return false;
      }
    }
  }

  Drupal.behaviors.shadowboxDisableVideoIfnoFlash = {
    attach: function (context, settings) {
      $('.page-events #mini-panel-event_last_year_highlights a, .page-events .shadowboxed-video', context).once( 'shadowboxDisableVideoIfnoFlash', function () {
        if( !hasFlash() ) {
          var youtube_link = $(this);
          var youtube_mobile_url = '';

          // Trap click events on images so that shadowbox auto behavior doesn't kick in
          youtube_link.find('img').click( function(event) {
            event.stopPropagation();
          });

          // Try mobile Youtube without Shadowbox
          youtube_link.removeAttr('rel');
          youtube_mobile_url = youtube_link.attr('href').replace('www.youtube.com/v/', 'm.youtube.com/watch?v=').replace('?html5=1&autoplay=1', '?autoplay=1');
          youtube_link.attr('href', youtube_mobile_url );
        }
      });
    }
  };

  Drupal.behaviors.eventsHighlightsHideIfEmpty = {
    attach: function (context, settings) {
      $('#mini-panel-event_last_year_highlights', context).once( 'eventsHighlightsHideIfEmpty', function () {
        // Last Year's Highlights mini-panel contains two regions in row-1
        $('#mini-panel-event_last_year_highlights > .row-1 > .region > .region-inner', context).each(function() {
          // If one region is empty then hide it and expand the other one.
          if ($(this).find('.panel-pane').length == 0) {
            $(this).parent().hide();
            $(this).parent().parent().find('.region:visible').css({
              width: '100%',
              height: 330
            });
          }
        });
      });
    }
  };

  Drupal.behaviors.loginToCFPLink = {
    attach: function (context, settings) {
      $('.pane-events-events-submenu', context).once( 'loginToCFPLink', function () {
        $(this).find('.pane-container').append('<div class="login-to-cfp"><ul><li><a href="/cfp/dashboard">'+Drupal.t('CFP Dashboard')+'</a></li></ul></div>')
      });
    }
  };

  Drupal.behaviors.copyToClipboard = {
    attach: function (context, settings) {
      // Attach buttons to every <code> snippet.
      $('code').each(function(index, element) {
        $(this).attr('id', 'code-sample-' + index);
        // Before we attach a button, see if a <pre> is wrapping <code>. If
        // so, we'll want the button to come after the <pre>.
        if ($(element).parent('pre').length) {
          var parentElement = $(element).parent('pre');
          $('<button class="code-sample-button btn" data-clipboard-target="#code-sample-' + index + '" data-toggle="tooltip" data-trigger="click" title="Copied!">Copy Code</button>').insertAfter(parentElement);
        }
        else {
          $('<button class="code-sample-button btn" data-clipboard-target="#code-sample-' + index + '" data-toggle="tooltip" data-trigger="click" title="Copied!">Copy Code</button>').insertAfter(element);
        }
      });

      // Now bind clipboard.js to the buttons.
      var btns = document.querySelectorAll('button.code-sample-button');
      var clipboard = new Clipboard(btns);

      clipboard.on('success', function(e) {
        e.clearSelection();

        console.info('Action:', e.action);
        console.info('Text:', e.text);
        console.info('Trigger:', e.trigger);

        showTooltip(e.trigger, 'Copied!');
      });

      clipboard.on('error', function(e) {
        console.error('Action:', e.action);
        console.error('Trigger:', e.trigger);

        showTooltip(e.trigger, fallbackMessage(e.action));
      });

      // This code is a modified version of what is run on the clipboard.js
      // demo site.
      for (var i = 0; i < btns.length; i++) {
        btns[i].addEventListener('mouseleave', function(e) {
          // Dispose the tooltip when we leave the Copy button after click.
          // We cannot do a simple 'hide' as then we would see the tip after
          // every hover/focus from there on out.
          //$(e).tooltip('dispose');
          // @todo Because we are using outdated versions of jQuery/Bootstrap,
          // the 'dispose' command doesn't work. Instead we need to bind
          // a 'click' trigger to the button directly, which is not ideal.
          // When we have time to fully audit/upgrade jQuery/BS we can fix
          // this.
          // @todo Why do we need to hide all when trigger is click?
          $('[data-toggle="tooltip"]').tooltip('hide');
        });
      }

      function showTooltip(elem, msg) {
        // Swap out the title attr for the tooltip button.
        $(elem).attr('title', msg);
        $(elem).tooltip('show');
      }

      // This is code run on clipboard.js. They don't recommend this as
      // production code, but I don't see a better way (that's lightweight) to
      // warn Safari users that this won't work as expected.
      function fallbackMessage(action) {
        var actionMsg = '';
        var actionKey = (action === 'cut' ? 'X' : 'C');

        if(/iPhone|iPad/i.test(navigator.userAgent)) {
          actionMsg = 'Sorry, no support for iOS';
        }
        else if (/Mac/i.test(navigator.userAgent)) {
          actionMsg = 'Press ⌘-' + actionKey + ' to ' + action;
        }
        else {
          actionMsg = 'Press Ctrl-' + actionKey + ' to ' + action;
        }

        return actionMsg;
      }
    }
  };

  $('select#edit-field-presentation-event-und').chosen();
  $('select#edit-field-presentation-event-und--2').chosen();
  $('select#edit-field-presentation-event-target-id').chosen();
  $('.view-display-id-event_listing_jump_menu select#edit-jump').chosen();
  //hide sponsor logos
  if( $('#sponsor_display_cat_1').length == 0 && $('#sponsor_display_cat_2').length == 0 && $('#sponsor_display_cat_3').length == 0) {
    $('.pane-event-diamond-platinum-gold-spon').hide();
  }

})(jQuery);
