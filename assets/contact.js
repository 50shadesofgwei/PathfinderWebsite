(function () {
  var form = document.getElementById("contactForm");
  if (!form) return;

  var statusEl = document.getElementById("contactStatus");
  var submitBtn = form.querySelector(".contact-form__submit");
  var nameInput = form.querySelector('[name="name"]');
  var emailInput = form.querySelector('[name="email"]');
  var messageInput = form.querySelector('[name="message"]');
  var CONTACT_EMAIL = "jonathan@pathfinderquantum.com";

  function isFormValid() {
    return (
      nameInput.value.trim() !== "" &&
      emailInput.value.trim() !== "" &&
      emailInput.checkValidity() &&
      messageInput.value.trim() !== ""
    );
  }

  function updateSubmitState() {
    submitBtn.disabled = !isFormValid();
  }

  [nameInput, emailInput, messageInput].forEach(function (input) {
    input.addEventListener("input", updateSubmitState);
  });

  updateSubmitState();

  function setStatus(message, isError) {
    if (!statusEl) return;
    statusEl.hidden = !message;
    statusEl.textContent = message || "";
    statusEl.classList.toggle("contact-form__status--error", !!isError);
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    setStatus("");

    if (!isFormValid()) {
      form.reportValidity();
      updateSubmitState();
      return;
    }

    var honey = form.querySelector('[name="_honey"]');
    if (honey && honey.value) return;

    var name = nameInput.value.trim();
    var email = emailInput.value.trim();
    var message = messageInput.value.trim();

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";

    fetch("https://formsubmit.co/ajax/" + encodeURIComponent(CONTACT_EMAIL), {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        name: name,
        email: email,
        message: message,
        _subject: "New contact from Pathfinder website",
        _replyto: email,
        _captcha: false,
      }),
    })
      .then(function (res) {
        return res.json().then(function (data) {
          if (!res.ok) throw new Error("Something went wrong. Please try again.");
          if (!data.success) throw new Error("Something went wrong. Please try again.");
          return data;
        });
      })
      .then(function () {
        form.reset();
        setStatus("Message sent. We'll be in touch soon.");
      })
      .catch(function () {
        setStatus("Something went wrong. Please try again or email jonathan@pathfinderquantum.com directly.", true);
      })
      .finally(function () {
        submitBtn.textContent = "Send";
        updateSubmitState();
      });
  });
})();
