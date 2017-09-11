(function ($) {
  /* @functionality: Geocoded maps using Google Maps API */
  Drupal.behaviors.geocodedMaps = {
    attach: function (context, settings) {
      $('#map_canvas', context).once( 'geocodedMaps', function () {
        var map = null;
        var geocoder = new google.maps.Geocoder();
        var address = $('#event_complete_address').text();
        geocoder.geocode( { 'address': address}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            var mapOptions = {
              zoom: 15,
              center: results[0].geometry.location
            }
            map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
            var marker = new google.maps.Marker({
              map: map,
              position: results[0].geometry.location
            });
          }
          else {
            $('.event-venue-map').hide();
            $('.event-venue-information').css('width','100%');
          }
        });
      });
    }
  }
})(jQuery);
