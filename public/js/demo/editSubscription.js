
$('#editSubscriptionModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget); // Button that triggered the modal
    var id = button.attr('id'); // Extract info from data-* attributes

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


                    let rec;
                    let prevLink ='';
                    try {
                        rec = JSON.parse(data.documentLink);
                        let name = rec['fileName'];
                        let link = rec['path'];
                        prevLink = '<a  href='+link+'>Existing File<i class="fas fa-arrow-right fa-fw"></i>'+name+'<i class="fas fa-download fa-fw"></i></a>';
                    }
                    catch (e) {
                        prevLink = '<a  >'+data.documentLink+'</a>';
                    }

                    $('#previousDocumentLink').html(prevLink);



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

    var data1 = new FormData();

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


    var fileInput= $('#documentLink2').prop('files');

    if(fileInput && fileInput[0]) {
        data1.append("file", fileInput[0], fileInput[0].name);
        documentLink= fileInput[0].name;
    }




        data1.append( "id", id);
        data1.append( "serviceTitle", serviceTitle);
        data1.append( "description", description);
        data1.append( "price", price);
        data1.append("paidAmount", paidAmount);
        data1.append("documentLink", documentLink);
        data1.append( "lastPaymentReference", lastPaymentRef);
        data1.append("paidAmountDate", paidAmountDate);
        data1.append("expectedDeliveryDate", expectedDeliveryDate);
        data1.append("actualDeliveryDate", actualDeliveryDate);
        data1.append("status", status);


    $.ajax(
        '/submit-edited-subscription',
        {
            data: data1,
            type: 'POST',
            contentType: false,
            processData: false,

            success: function (data) {
                if(data.success){
                    $("#alertMessage").attr('class', "alert alert-success alert-dismissible text-center");
                    $('#alertMessage').html(data.success);
                    $("#alertMessage").attr('hidden', false);

                }
                else {
                    $("#alertMessage").attr('class', "alert alert-danger alert-dismissible text-center");
                    $('#alertMessage').html(data.error);
                    $("#alertMessage").attr('hidden', false);
                }
            },
            error: function (jqXhr, textStatus, errorMessage) {

                $("#alertMessage").attr('class', "alert alert-danger alert-dismissible text-center");
                $('#alertMessage').html("error occurred updating subscription, please contact admin: \""+ errorMessage+"\"");
                $("#alertMessage").attr('hidden', false);

            },
            complete: function () {
                $('#spinner-div').hide();

            }
        });






}