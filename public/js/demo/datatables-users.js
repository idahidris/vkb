
$('#dataTableUsers').DataTable( {
  serverSide: true,
  processing: true,
  responsive: true,
  searchable: true,
  ajax: {
    url: '/users-data-source',
    type: 'GET'
  },
  success: function (data) {
  console.log(data)
  },
  onFilter: function (data) {
  console.log(data)
  },
  "columns": [
    { "data": "firstName" },
    { "data": "lastName" },
    { "data": "gender" },
    { "data": "email" },
    { "data": "phone" },
    { "data": "description" },
    { "data": "location" },
    { "data": "registeredDate" },
    { "data": "id" }

  ],
  columnDefs: [
    {  targets: 8,
      render: function (data, type, row, meta) {
        return '<button id='+data+' type="button" onclick="myFunction(this.id)" class="btn btn-success btn-xs" data-toggle="modal" data-target="#editUserModal" data-info='+data+'><i class="fas fa-user-edit fa-fw"></i></button>';
      },


    },
    {  targets: [7],
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



function myFunction(id) {
  $("editUserModal").modal(true);
}





