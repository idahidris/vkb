
$('#editUserModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget); // Button that triggered the modal
    var id = button.attr('id'); // Extract info from data-* attributes
    var modal = $(this);
    $.ajax(
        '/user-account-id',
        {
            data:{"id": id },
            type: 'GET',
            success: function (data) {
                if(typeof data !=='undefined') {
                    $('#userId').val("User-ID: "+id);
                    $('#first_name').val(data.firstName);
                    $('#description').val(data.description);
                    $('#location').val(data.location);
                    $('#last_name').val(data.lastName);
                    $('#email').val(data.email);
                    $('#phone').val(data.phone);
                    $('#submitEditedUser').attr("data", data.id);
                    $('#'+(data.gender).trim()).attr("selected", true);
                    $("#alertMessage").attr('hidden', true);

                }
            },
            error: function (jqXhr, textStatus, errorMessage) {

            }

        }
    );
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.


   // modal.find('.modal-body input').val(recipient);
});


$("#submitEditedUser").on('click', updateUser);


function updateUser() {


    var firstName = $('#first_name').val();
    var description = $('#description').val();
    var location = $('#location').val();
    var lastName = $('#last_name').val();
    var email = $('#email').val();
    var phone = $('#phone').val();
    var id = $('#submitEditedUser').attr("data");
    var gender = $('#gender').val();
    $("#alertMessage").attr('hidden', true);

    let obj = {
        "id": id,
        "firstName": firstName,
        "description": description,
        "lastName": lastName,
        "email": email,
        "phone": phone,
        "gender": gender,
        "location": location
    };





    $.ajax(
        '/submit-edited-user',
        {
            data: obj,
            type: 'POST',
            success: function (data) {
                if(data.success){
                    $("#alertUserMessage").attr('class', "alert alert-success alert-dismissible");
                    $('#alertUserMessage').html(data.success);
                    $("#alertUserMessage").attr('hidden', false);

                }
                else {
                    $("#alertUserMessage").attr('class', "alert alert-danger alert-dismissible");
                    $('#alertUserMessage').html(data.error);
                    $("#alertUserMessage").attr('hidden', false);
                }
            },
            error: function (jqXhr, textStatus, errorMessage) {

                $("#alertUserMessage").attr('class', "alert alert-danger alert-dismissible");
                $('#alertUserMessage').html("error occurred updating user, please contact admin: \""+ errorMessage+"\"");
                $("#alertUserMessage").attr('hidden', false);

            }
        });



}
