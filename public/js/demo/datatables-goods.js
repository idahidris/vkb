
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
  console.log(data)
  },
  onFilter: function (data) {
  console.log(data)
  },
  "columns": [
    { "data": "id" },
    { "data": "name" },
    { "data": "description" },
    { "data": "unitPrice" },
    { "data": "quantity" },
    { "data": "manufacturedDate" },
    { "data": "expiryDate" }
  ]
} )
;




