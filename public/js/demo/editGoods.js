
$('#editGoodsModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget); // Button that triggered the modal
    var id = button.attr('data-info'); // Extract info from data-* attributes

    $.ajax(
        '/goods-id',
        {
            data:{"id": id },
            type: 'GET',
            success: function (data) {
                if(typeof data !=='undefined') {
                    $('#id').val("Goods-ID: "+data.id);
                    $('#name').val(data.name);
                    $('#quantity').val(data.quantity);
                    $('#unitPrice').val(data.unitPrice);
                    $('#description').val(data.description);
                    $('#manufacturedDate').val(getDate(data.manufacturedDate));
                    $('#expiryDate').val(getDate(data.expiryDate));
                    $('#submitEditedGoods').attr("data", data.id);
                    $("#alertMessage").attr('hidden', true);

                }
            },
            error: function (jqXhr, textStatus, errorMessage) {

            }

        }
    );
    //If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    //Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.


   // modal.find('.modal-body input').val(recipient);
});


function getDate(dateString){

    if(typeof dateString === 'undefined' || dateString===null || dateString.trim().length===0 )
        return "";
    let data = dateString.split("T");
    let datePart = data[0].split("-");
    return datePart[2]+"-"+datePart[1]+"-"+datePart[0];

}



$("#submitEditedGoods").click(function(){
    $('#spinner-div').show();
    updateSubscription();

} );


function updateSubscription() {


    var name = $('#name').val();
    var description = $('#description').val();
    var quantity = $('#quantity').val();
    var unitPrice = $('#unitPrice').val();
    var manufacturedDate = $('#manufacturedDate').val();
    var expiryDate = $('#expiryDate').val();
    var id = $('#submitEditedGoods').attr("data");
    $("#alertMessage").attr('hidden', true);

    let obj = {
        "id": id,
        "name": name,
        "description": description,
        "quantity": quantity,
        "manufacturedDate": manufacturedDate,
        "expiryDate": expiryDate,
        "unitPrice": unitPrice
    };


    $.ajax(
        '/submit-edited-goods',
        {
            data: obj,
            type: 'POST',
            success: function (data) {
                if(data.success){
                    $("#alertUserMessage").attr('class', "alert alert-success alert-dismissible text-center");
                    $('#alertUserMessage').html(data.success);
                    $("#alertUserMessage").attr('hidden', false);

                }
                else {
                    $("#alertUserMessage").attr('class', "alert alert-danger alert-dismissible text-center");
                    $('#alertUserMessage').html(data.error);
                    $("#alertUserMessage").attr('hidden', false);
                }
                // $('#spinner-div').hide();
            },
            error: function (jqXhr, textStatus, errorMessage) {

                $("#alertUserMessage").attr('class', "alert alert-danger alert-dismissible text-center");
                $('#alertUserMessage').html("error occurred updating goods, please contact admin: \""+ errorMessage+"\"");
                $("#alertUserMessage").attr('hidden', false);
                // $('#spinner-div').hide();

            },
            complete: function () {
                $('#spinner-div').hide();

            }
        });




}