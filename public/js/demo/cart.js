
$('#addToCartModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget); // Button that triggered the modal
    var id = button.attr('id'); // Extract info from data-* attributes
    var modal = $(this);
    $.ajax(
        '/goods-by-id',
        {
            data:{"id": id },
            type: 'GET',
            success: function (data) {
                if(typeof data !=='undefined' && data.length > 0) {
                    var totalPrice = 1000;
                    modal.find('#itemTotalPrice').html("&#8358; " + totalPrice);
                    modal.find('#itemName').text(data[0].name);
                    modal.find('#itemUnitPrice').html("&#8358; " + data[0].unitPrice);
                    modal.find('#itemDescription').text(data[0].description);
                    modal.find('#itemQuantity').val(1);

                    modal.find('.modal-title').text('Available Quantity '+ data[0].quantity);
                    modal.find('#itemTotalPrice').html("&#8358; " + data[0].unitPrice);
                    modal.find('#cartSubmitButton').attr('data-info', data[0].id);
                    $("#alert").attr('hidden', true);
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


try {
    $("#itemQuantity").on('keyup', changeTotal);
}
catch (e) {
    console.log(e);
}


function changeTotal() {
  try {
      var qty = this.value;
      if(typeof qty !=='undefined' && qty.length>0) {
          var unitPrice = document.getElementById("itemUnitPrice").innerText.split(" ")[1].trim();

          var total = unitPrice * qty;
          $('#itemTotalPrice').html ("&#8358; " + total);

      }
  }
  catch(error){
      console.log("Error :", error);
  }

}



function addToCart() {
    var qty = $('#itemQuantity').val();
    var id = $('#cartSubmitButton').attr('data-info');

    $.ajax(
        '/add-to-cart',
        {
            data: {"id": id, "qty": qty},
            type: 'POST',
            success: function (data) {
                if(data.successful){
                    $("#alert").attr('class', "alert alert-success alert-dismissible");
                    $("#alert").attr('hidden', false);
                    $('#message').html(data.message);

                }
                else {
                    $("#alert").attr('class', "alert alert-danger alert-dismissible");
                    $("#alert").attr('hidden', false);
                    $('#message').html(data.message[0]);
                }
            },
            error: function (jqXhr, textStatus, errorMessage) {

            }
        });



}