
$('#dataTableSales').DataTable( {
  serverSide: true,
  processing: true,
  responsive: true,
  searchable: true,
  ajax: {
    url: '/sales-data-source',
    type: 'GET'
  },
  success: function (data) {

  },
  onFilter: function (data) {

  },
  "columns": [
    { "data": "batchId" },
    { "data": "salesId" },
    { "data": "itemName" },
    { "data": "quantity" },
    { "data": "unitPrice" },
    { "data": "totalPrice" },
    { "data": "itemDescription" },
    { "data": "manufacturedDate" },
    { "data": "expiryDate" },
    { "data": "customerRef" },
    { "data": "salesDate" },
    { "data": "itemId" },
    { "data": "storeName"}

  ]

} )
;





