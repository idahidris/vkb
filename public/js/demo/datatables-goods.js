
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
        return '<button id='+data+' type="button" onclick="myFunc(this.id)" class="btn btn-primary btn-xs mr-1" data-toggle="modal" data-target="#addToCartModal" data-info='+data+'><i class="fas fa-cart-plus fa-fw"></i></button>' +
                '<button id=e'+data+' type="button" onclick="myFunc2(this.id)" class="btn btn-success btn-xs" data-toggle="modal" data-target="#editGoodsModal" data-info='+data+'><i class="fas fa-edit fa-fw"></i></button>';
   }

    },
    {  targets: [5,6],
      render: function (data, type, row, meta) {
        if(data===null || data.trim()==='')
          return "";

        var d = new Date(data);
        return d.getDate() + "-"+(d.getMonth()+1).toLocaleString().padStart(2,"0")+'-'+d.getFullYear() + " "+ d.getHours() + ":"+ d.getMinutes() + " "+ d.getSeconds();
      }

    }
  ]

} )
;

function myFunc(id) {
  $("addToCartModal").modal(true);
}


function myFunc2(id) {
  $("editGoodsModal").modal(true);
}





