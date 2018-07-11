$().ready(function() {
        $("#addItemt").validate({
            rules: {
                itemText: {
                    maxlength: 255},

            },

        });
    });