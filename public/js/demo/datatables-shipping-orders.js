
$('#dataTableShippingOrder').DataTable( {
  serverSide: true,
  processing: true,
  responsive: true,
  searchable: true,
  ajax: {
    url: '/shipping-order-data-source',
    type: 'GET'
  },
  success: function (data) {

  },
  onFilter: function (data) {

  },
  "columns": [
    { "data": "batchId" },
    { "data": "description" },
    { "data": "shippingVendor" },
    { "data": "shippingVendorEmail" },
    { "data": "shippingOrderItems"},
    { "data": "orderDate" },
    { "data": "status" },
    { "data": "batchId"}
  ],
  columnDefs: [
    {  targets: 7,
      render: function (data, type, row, meta) {
        return '<a href="view-shipping-cart?id='+data+'" type="button" class="btn btn-primary btn-xs mr-1"><i class="fas fa-list fa-fw"></i></a>' +
                '<button id=e'+data+' type="button" onclick="myFunc2(this.id)" class="btn btn-success btn-xs" data-toggle="modal" data-target="#editGoodsModal" data-info='+data+'><i class="fas fa-edit fa-fw"></i></button>';
   }

    },
    {  targets: [5],
      render: function (data, type, row, meta) {
        if(data===null || data.trim()==='')
          return "";

        var d = new Date(data);
        return d.getDate() + "-"+(d.getMonth()+1).toLocaleString().padStart(2,"0")+'-'+d.getFullYear() + " "+ d.getHours() + ":"+ d.getMinutes() + " "+ d.getSeconds();
      }

    },
    {  targets: [4],
      render: function (data, type, row, meta) {
        if(data===null)
          return "";
        return data.length;


        }

    }
  ]

} )
;


function myFunc2(id) {
  $("editGoodsModal").modal(true);
}





