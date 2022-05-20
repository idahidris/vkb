
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

  ],
  columnDefs: [
    {  targets: [7,8,10],
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





