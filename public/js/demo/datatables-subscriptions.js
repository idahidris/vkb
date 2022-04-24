
$('#dataTableSubscriptions').DataTable( {
  serverSide: true,
  processing: true,
  responsive: true,
  searchable: true,
  ajax: {
    url: '/subscriptions-data-source',
    type: 'GET'
  },
  success: function (data) {
  console.log(data)
  },
  onFilter: function (data) {
  console.log(data)
  },
  "columns": [
    { "data": "customerId" },
    { "data": "serviceType" },
    { "data": "serviceTitle" },
    { "data": "documentLink" },
    { "data": "price" },
    { "data": "paidAmount" },
    { "data": "paidAmountDate" },
    { "data": "lastPaymentReference" },
    { "data": "subscriptionDate" },
    { "data": "expectedDeliveryDate" },
    { "data": "actualDeliveryDate" },
    { "data": "status" },
    { "data": "id" },
  ],
  columnDefs: [
    {  targets: 12,
      render: function (data, type, row, meta) {
        return '<button id='+data+' type="button" onclick="myFunc(this.id)" class="btn btn-success btn-xs" data-toggle="modal" data-target="#editSubscriptionModal" data-info='+data+'><i class="fas fa-edit fa-fw"></i></button>';
      }

    },
    {  targets: [6,8,9,10],
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
  $("editSubscriptionModal").modal(true);
}





