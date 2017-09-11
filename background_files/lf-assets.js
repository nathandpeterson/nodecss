/**
 * @file
 * Add Drupal functions
 */

(function (window, document, $, Drupal) {
  'use strict';

  var $html = $('html'),
    mobileOnly = "screen and (max-width: 47.9375em)", // 767px.
    mobileLandscape = "(min-width: 30em)", // 480px.
    tablet = "(min-width: 48em)",
    small = "(max-width: 959px)",
    large = "(min-width: 960px)",
    topHeaderHeight = function() {
      return $('.header-top').outerHeight();
    },
    stickyHeaderHeight = function() {
      var $topHeader = $('.header-top');
      // Check if header top is sticky.
      if ($topHeader.css('position') === 'fixed') {
        return $topHeader.outerHeight();
      }
      else {
        return 0;
      }
    };

  Drupal.behaviors.mainNav = {
    attach: function(context, settings) {

      var $navItem = $('.header-bottom__nav .expanded > a', context),
        $menu_button = $('#hamburger', context),
        expand_class = 'menu-expanded',
        navClass = 'js-nav',
        menuItemToggle = function(e) {
          e.preventDefault();

          var $this = $(this),
            $parent_item = $this.parent('.expanded');

          $parent_item.siblings().removeClass(expand_class);
          $parent_item.siblings().removeClass(expand_class);
          $parent_item.find('.expanded').removeClass(expand_class);
          $parent_item.toggleClass(expand_class);

          return false;
        };

      if ($menu_button.length) {
        $menu_button.on('click', function(e) {
          e.preventDefault();

          if (!$html.hasClass(navClass)) {
            $html.addClass(navClass);
          }
          else {
            // Get and close expanded menu items if they are.
            $html.removeClass(navClass);
          }
        });
      }

      enquire.register(small, {
        match: function () {
          $navItem.on('click', menuItemToggle);
        }
      });

      enquire.register(large, {
        match: function () {
          $navItem.off('click');
          $html.removeClass(navClass);
        }
      });
    }
  };

  Drupal.behaviors.globalNav = {
    attach: function(context, settings) {
      var $navItem = $('.menu--secondary-menu .expanded > a.nolink', context),
      menuItemToggle = function(e) {
        e.preventDefault();
        return false;
      };
      // We don't want the global menu dropdown to change page on click/touch
      $navItem.on('click touch', menuItemToggle);
    }
  };

}(this, this.document, this.jQuery, Drupal));
