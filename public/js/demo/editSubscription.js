
$('#editSubscriptionModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget); // Button that triggered the modal
    var id = button.attr('id'); // Extract info from data-* attributes
    var modal = $(this);
    $.ajax(
        '/subscription-id',
        {
            data:{"id": id },
            type: 'GET',
            success: function (data) {
                if(typeof data !=='undefined') {
                    $('#customerId').val("Customer-ID: "+data.customerId +" - Service Type: "+ data.serviceType+ " - Status: "+data.status);
                    $('#serviceTitle').val(data.serviceTitle);
                    $('#description').val(data.description);
                    $('#price').val(data.price);
                    $('#paidAmount').val(data.paidAmount);
                    $('#lastPaymentRef').val(data.lastPaymentReference);
                    $('#documentLink').val(data.documentLink);
                    $('#paidAmountDate').val(getDate(data.paidAmountDate));
                    $('#expectedDeliveryDate').val(getDate(data.expectedDeliveryDate));
                    $('#actualDeliveryDate').val(getDate(data.actualDeliveryDate));
                    $('#submitEditedSubscription').attr("data", data.id);
                    $('#'+(data.status).trim()).attr("selected", true);
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


function getDate(dateString){

    if(typeof dateString === 'undefined' || dateString===null || dateString.trim().length===0 )
        return "";
    let data = dateString.split("T");
    let datePart = data[0].split("-");
    return datePart[2]+"-"+datePart[1]+"-"+datePart[0];

}



$("#submitEditedSubscription").click(function(){
    $('#spinner-div').show();
    updateSubscription();

} );


function updateSubscription() {
   var id =  $('#submitEditedSubscription').attr("data");
   var serviceTitle = $('#serviceTitle').val();
   var description = $('#description').val();
   var price = $('#price').val()
   var paidAmount = $('#paidAmount').val();
   var lastPaymentRef =$('#lastPaymentRef').val();

   var documentLink = $('#documentLink').val();
   var paidAmountDate = $('#paidAmountDate').val();
   var expectedDeliveryDate = $('#expectedDeliveryDate').val();
   var actualDeliveryDate = $('#actualDeliveryDate').val();
   var status = $('#status').val();

   let obj = {
       "id": id,
       "serviceTitle": serviceTitle,
       "description": description,
       "price": price,
       "paidAmount": paidAmount,
       "documentLink": documentLink,
       "lastPaymentReference": lastPaymentRef,
       "paidAmountDate": paidAmountDate,
       "expectedDeliveryDate": expectedDeliveryDate,
       "actualDeliveryDate": actualDeliveryDate,
       "status": status
   };




    $.ajax(
        '/submit-edited-subscription',
        {
            data: obj,
            type: 'POST',
            success: function (data) {
                if(data.success){
                    $("#alertMessage").attr('class', "alert alert-success alert-dismissible");
                    $('#alertMessage').html(data.success);
                    $("#alertMessage").attr('hidden', false);

                }
                else {
                    $("#alertMessage").attr('class', "alert alert-danger alert-dismissible");
                    $('#alertMessage').html(data.error);
                    $("#alertMessage").attr('hidden', false);
                }
            },
            error: function (jqXhr, textStatus, errorMessage) {

                $("#alertMessage").attr('class', "alert alert-danger alert-dismissible");
                $('#alertMessage').html("error occurred updating subscription, please contact admin: \""+ errorMessage+"\"");
                $("#alertMessage").attr('hidden', false);

            },
            complete: function () {
                $('#spinner-div').hide();

            }
        });



}