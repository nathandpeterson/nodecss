// Script file for homepage pardot form iframe.
// Iterate through each form field and apply inline labels.
$('.form-field').each(function() {
  var fieldInput = null;
  var fieldSelect = null;
  var label = $(this).children("label").html();

  // Inline label for dropdown select element.
  if ($(this).children("select")) {
    fieldSelect = $(this).children("select");
    fieldSelect.children("option[value='']").html(label);
  }

  // Inline labels for text input and textarea element.
  if ($(this).children("input[type='text']").length > 0 || $(this).children("textarea").length > 0){
    var fieldInput = $(this).children("input").length > 0 ? $(this).children("input") : $(this).children("textarea");
    if (!fieldInput.val()) {
      fieldInput.val(label);
    };
    fieldInput.focus(function() {
      if (fieldInput.val() === label) {
        fieldInput.val('');
      }
    });
    fieldInput.blur(function() {
      if(!fieldInput.val()) {
        fieldInput.val(label);
      }
    });
  }
});

// On form submit clear input values if unchanged from default inline label.
$("#pardot-form").submit(function(){
  $('.form-field').each(function() {
    var fieldInput = null;
    var label = $(this).children("label").html();

    if ($(this).children("input[type='text']").length > 0 || $(this).children("textarea").length > 0){
      var fieldInput = $(this).children("input").length > 0 ? $(this).children("input") : $(this).children("textarea");
      if (fieldInput.val() === label) {
        fieldInput.val('');
      }
    }
  });
});