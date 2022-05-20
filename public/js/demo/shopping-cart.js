

$('#shoppingCartModal').on('show.bs.modal', function (event) {

    $("#myShoppingCartForm").trigger('reset');

    $('#imgPreview').css({
        "background": "none"
    });

});


try {
    $("#shoppingQuantity").on('keyup', changeTotal);
}
catch (e) {
    console.log(e);
}


try {
    $("#shoppingUnitPrice").on('keyup', changeTotal);
}
catch (e) {
    console.log(e);
}



try {
    $("#rate").on('keyup', changeTotalWithRate);
}
catch (e) {
    console.log(e);
}



try {
    $("#imageLink").on('keyup', loadImage);
}
catch (e) {

}

function loadImage() {
    var path = $("#imageLink").val();
    if(typeof path !=="undefined" && path.length>3) {
        $('#imgPreview').css({
            "background": "url(" + path + ")",
            "background-position": "center",
            "background-size": "cover"
        });
    }

}


function changeTotal() {
  try {
          var unitPrice = $('#shoppingUnitPrice').val();
          var qty = $('#shoppingQuantity').val();
          if(typeof unitPrice !=='undefined' && typeof qty !=='undefined') {
              if(unitPrice.length===0 )
                  unitPrice = 0;
              if(qty.length ===0)
                  qty = 0;
              var total = unitPrice * qty;
            var rate = $('#rate').val();
            if(typeof rate !=='undefined'  ) {
                if(rate.length ===0)
                    rate =1;

                total = total * rate;
            }
              $('#totalSingleShopping').val("NGN " + total.toLocaleString());
          }

  }
  catch(error){
      console.log("Error :", error);
  }

}


function changeTotalWithRate() {
    try {
        var rate = $('#rate').val();
        var unitPrice = $('#shoppingUnitPrice').val();
        var qty = $('#shoppingQuantity').val();
        if(typeof unitPrice !=='undefined' && typeof qty !=='undefined' && typeof rate !=='undefined' && rate.length>0 && unitPrice.length>0 && qty.length>0) {
            var total = unitPrice * qty * rate;
            $('#totalSingleShopping').val("NGN " + total.toLocaleString());
        }

    }
    catch(error){
        console.log("Error :", error);
    }

}




$("#shoppingButtonId").click(function(){
    addToCart();

} );




function addToCart() {

    var unitPrice = $('#shoppingUnitPrice').val();
    var quantity = $('#shoppingQuantity').val();
    var productName= $('#productName').val();
    var sellerName =$('#sellerName').val();
    var pageLink =$('#pageLink').val();
    var imageLink =  $('#imageLink').val();
    var rate =  $('#rate').val();

    var result=[];
    var i =0;

    i = validate(productName,'Product Name',result,i);
    i = validate(pageLink,'Page Link',result,i);
    i = validate(quantity,'Quantity',result,i);
    i = validate(unitPrice,'Unit Price',result,i);

    if(i>0){

        $("#alertShoppingMessage").attr('class', "alert alert-danger alert-dismissible");
        $("#alertShoppingMessage").attr('hidden', false);
        var msgHtml="";
        for(var err of result) {
            msgHtml =msgHtml + "<li class='text-center'>"+err+"</li>";
        }
        $('#alertShoppingMessage').html(msgHtml);
        return;
    }

    if(typeof rate ==='undefined' || rate.length===0)
        rate = 1;

    let obj = {
        "unitPrice": unitPrice,
        "quantity": quantity,
        "productName": productName,
        "sellerName": sellerName,
        "pageLink": pageLink,
        "imageLink": imageLink,
        "rate": rate
    };



    $.ajax(
        '/add-to-shopping-cart',
        {
            data: obj,
            type: 'POST',
            success: function (data) {
                if(data.success){
                    $("#alertShoppingMessage").attr('class', "alert alert-success alert-dismissible");
                    $("#alertShoppingMessage").attr('hidden', false);
                    $('#alertShoppingMessage').html(data.success);
                    $("#myShoppingCartForm").trigger('reset');

                    $('#imgPreview').css({
                        "background": "none",
                        "background-position": "center",
                        "background-size": "cover"
                    });

                }
                else {
                    $("#alertShoppingMessage").attr('class', "alert alert-danger alert-dismissible");
                    $("#alertShoppingMessage").attr('hidden', false);
                    $('#alertShoppingMessage').html(data.error);
                }
            },
            error: function (jqXhr, textStatus, errorMessage) {

            }
        });



}

function validate(data, name, result, i){
    if(typeof data ==="undefined" || data.trim().length===0){
        result[i] = "Kindly fill " +name ;
        i=i+1;
    }
    return i;
}