
$('#dataTable').DataTable( {
  serverSide: true,
  processing: true,
  responsive: true,
  searchable: true,
  ajax: {
    url: '/goods-data-source',
    type: 'GET'
  },
  success: function (data) {

  },
  onFilter: function (data) {

  },
  "columns": [
    { "data": "id" },
    { "data": "name" },
    { "data": "description" },
    { "data": "unitPrice" },
    { "data": "quantity" },
    { "data": "manufacturedDate" },
    { "data": "expiryDate" },
    { "data": "id"}

  ],
  columnDefs: [
    {  targets: 7,
      render: function (data, type, row, meta) {
        return '<button id='+data+' type="button" onclick="myFunc(this.id)" class="btn btn-success btn-xs" data-toggle="modal" data-target="#addToCartModal" data-info='+data+'><i class="fas fa-cart-plus fa-fw"></i></button>';
   }

    }
  ]

} )
;

function myFunc(id) {
  $("addToCartModal").modal(true);
}




