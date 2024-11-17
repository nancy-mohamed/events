$(document).ready(function() {
  $(".progress-container").each(function() {
      const $container = $(this);
      const $progress = $container.find(".progress");
      const $progressCircle = $container.find(".progress-circle");
      const $progressPercentage = $container.find(".progress-percentage");

      // Get the value from the progress element and update CSS and text
      const value = $progress.val();
      $progressCircle.css("--progress", value);
      $progressPercentage.text(value + "%");
  });
});