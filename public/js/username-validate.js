


$().ready(function() {
    $.validator.addMethod(
        "regex",
        function(value, element, regexp) {
            var re = new RegExp(regexp);
            return this.optional(element) || re.test(value);
        },
        "Please check your input."
    );
    // $("#newName").rules("add", { regex: "^[a-zA-Z'.\\s]{1,40}$" })
    $("#newName").validate({
        rules: {
            answerText: {
                maxlength: 15,
                regex: "^[a-zA-Z][a-zA-Z0-9-_\\.]{1,20}$"
            },
        }
    })
});