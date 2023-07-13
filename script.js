document.addEventListener("DOMContentLoaded", function () {
  const typed = new Typed("#typing-heading", {
    strings: [
      "NAVEENAKRISHNAN.S",
      "A Coder",
      "A Developer",
      "A Software Engineer",
    ],
    typeSpeed: 80,
    backSpeed: 60,
    loop: true,
  });
});

$(document).ready(function() {
  var slideCount = $(".project-container .project-item").length;
  var slideWidth = $(".project-container .project-item").outerWidth();
  var slideContainerWidth = slideCount * slideWidth;

  $(".project-container").css("width", slideContainerWidth);

  var currentPosition = 0;
  var slideOffset = slideWidth;

  function slideLeft() {
    if (currentPosition > 0) {
      currentPosition -= slideOffset;
      $(".project-container").css("transform", "translateX(-" + currentPosition + "px)");
    }
  }

  function slideRight() {
    if (currentPosition < (slideContainerWidth - slideOffset)) {
      currentPosition += slideOffset;
      $(".project-container").css("transform", "translateX(-" + currentPosition + "px)");
    }
  }

  $("#prevBtn").click(function() {
    slideLeft();
  });

  $("#nextBtn").click(function() {
    slideRight();
  });
});
