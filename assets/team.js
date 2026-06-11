(function () {
  var cards = document.querySelectorAll(".team-card");
  if (!cards.length) return;

  cards.forEach(function (card) {
    var trigger = card.querySelector(".team-card__trigger");
    var bio = card.querySelector(".team-bio");
    if (!trigger || !bio) return;

    trigger.addEventListener("click", function () {
      var isOpen = card.classList.toggle("is-open");
      trigger.setAttribute("aria-expanded", isOpen ? "true" : "false");
      bio.setAttribute("aria-hidden", isOpen ? "false" : "true");
      trigger.setAttribute(
        "aria-label",
        isOpen
          ? "Jonathan Feasby, Founder. Close bio."
          : "Jonathan Feasby, Founder. Bio."
      );
    });
  });
})();
