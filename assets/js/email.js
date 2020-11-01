window.onload = function () {
    document.getElementById('contact-form').addEventListener('submit', function (event) {
        event.preventDefault();
        // "gmail" is service ID, "template_ihdtu89" is the template ID
        emailjs.sendForm('gmail', 'template_ihdtu89', this)
            .then(function (response) {
                alert("Your message was sent successfully!");
                location.reload();
            }, function (error) {
                alert("Ooops, something went wrong...", error);
            });
    });
};