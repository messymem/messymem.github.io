window.HELP_IMPROVE_VIDEOJS = false;

$(document).ready(function () {
  // Mobile navbar toggle.
  $(".navbar-burger").click(function () {
    $(".navbar-burger").toggleClass("is-active");
    $(".navbar-menu").toggleClass("is-active");
  });

  // Initialize every element with the `carousel` class.
  // Tweak slidesToShow if you want more/fewer videos visible at once.
  bulmaCarousel.attach(".carousel", {
    slidesToScroll: 1,
    slidesToShow: 3,
    loop: true,
    infinite: true,
    autoplay: false,
    autoplaySpeed: 3000,
    breakpoints: [
      { changePoint: 640, slidesToShow: 1, slidesToScroll: 1 },
      { changePoint: 900, slidesToShow: 2, slidesToScroll: 1 }
    ]
  });

  bulmaSlider.attach();
});
