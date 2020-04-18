$(document).ready(function(){
    var product_id
    var socket = io();
    socket.emit('getAll')
    //Lấy dữ liệu từ server realtime
    socket.on('data',function(data){
        $('#dataTable >tbody').html("")
        for(item of data){
            $('#dataTable >tbody').append(
                `<tr>
                    <td>${item._id}</td>
                    <td>${item.Name}</td>
                    <td>${item.Author}</td>
                    <td>${item.NXB}</td>
                    <td>${item.Prices}</td>
                    <td>${item.Quantity}</td>
                    <td>
                        <button class="btn btn-warning" data-toggle="modal" data-target="#EditModal" data-prop="Chỉnh Sửa" data-role="update">
                            <i class="far fa-edit p-1 m-1"></i>
                            Sửa
                        </button>
                        <button class="btn btn-danger btn-del" data-toggle="modal" data-target="#ConfirmModal" data-role="delete">
                            <i class="far fa-trash-alt m-1 p-1"></i>
                            Xóa
                        </button>
                    </td>
                </tr>`
            );
        }
    })

    //Thao tác với EditModal===========================================================================================
    $('#EditModal')
    .on('show.bs.modal', function (event) {   
        let button = $(event.relatedTarget) 
        let recipient = button.data('prop') 
        let modal = $(this)
        modal.find('.modal-title').text(recipient + " Sản Phẩm")
        modal.find('.btn-edit').text(recipient)
        modal.find('.btn-edit').click(function(){
            let Name = $("#txtName").val()
            let Author = $("#txtAuthor").val()
            let NXB = $("#txtNXB").val()
            let Prices = $("#txtPrices").val()
            let Quantity = $("#txtQuantity").val()
            if(validate(Name,Author,NXB,Prices,Quantity)){
                //tạo sản phẩm sau khi validate thành công
                let Product ={
                    Name,
                    Author,
                    NXB,
                    Prices:parseInt(Prices),
                    Quantity:parseInt(Quantity)
                }
                //kiểm tra update hay insert
                if(button.data('role')==="update"){
                    //đưa dữ liệu lên server để update
                   socket.emit('update',{_id:product_id,Product}) 
                }else{
                    //đưa dữ liệu lên server để thêm
                    socket.emit('insert',Product)
                }
                //lắng nghe kết quả sau khi server thực hiện insert hoặc update
                socket.on('edit_result',data=>{
                    data?Alert(true):Alert(false)
                    $('#EditModal').modal("hide")
                })
            }
        })   
    })
    .on('hide.bs.modal', function (event) {   
        $('#txtName').val('');
        $('#txtAuthor').val('');
        $('#txtNXB').val(''); 
        $('#txtPrices').val('');
        $('#txtQuantity').val('');   
    })

     //Modal Xác Nhận===================================================================================================
    $('#ConfirmModal').on('show.bs.modal',function(event){
        let modal = $(this)
        modal.find('.btn-confirm').click(function(){
            console.log(product_id)
            socket.emit('delete',product_id)
            socket.on('delete_result',data=>{
                data?Alert(true):Alert(false)  
                $('#ConfirmModal').modal("hide")  
            })
        })       
    })  

    //Thao tác nút xóa===================================================================================================
    $(document).on('click','button[data-role=delete]',function(){
        $tr = $(this).closest('tr')
        product_id = $tr.children('td:first').text()      
    })

    //Thao tác với nút sửa ==============================================================================================
    $(document).on('click','button[data-role=update]',function(){
        //Tìm đến tr gần nhất lấy toàn bộ dữ liệu của các td trong đó, gán cho các ô trong modal
        $tr = $(this).closest('tr')
        let data = $tr.children('td').map(function(){
            return $(this).text()
        }).get()
        product_id = data[0]
        $('#txtName').val(data[1]);
        $('#txtAuthor').val(data[2]);
        $('#txtNXB').val(data[3]); 
        $('#txtPrices').val(data[4]);
        $('#txtQuantity').val(data[5]);   
    })

     //Hiện Thông Báo=================================================================================================
    function Alert(success){
        $('.alert').removeClass("default")
        if(success){
            $('.alert').removeClass("fail")
            $('.alert').addClass("success")
            $("#alertIcon").html('<i class="fas fa-check"></i>')
            $('#alertMessage').html('Chỉnh Sửa Danh Sách Thành Công')
        }else{
            $('.alert').removeClass("success")
            $('.alert').addClass("fail")
            $("#alertIcon").html('<i class="fas fa-exclamation"></i>')
            $('#alertMessage').html('Chỉnh Sửa Danh Sách Thất Bại')
        }
        $('.alert').removeClass("hide")
        $('.alert').addClass("show")
        setTimeout(()=>{
            $('.alert').removeClass("show")
            $('.alert').addClass("hide") 
        },2000)
        
    }
  
    //Hàm Validate dữ liệu trước khi gửi lên server======================================================================
    const validate = (Name,Author,NXB,Prices,Quantity)=>{
        if(Name===""){
            $('#errorName').text("Tên Không Được Để Trống").show()
             return false
        }else{
            if(Name.length<6){
                $('#errorName').text("Tên Phải Lớn Hơn 6 Ký Tự").show()
                return false
            }
            $('#errorName').text("").hide()
        }
        if(Author===""){
            $('#errorAuthor').text("Tác Giả Không Được Để Trống").show()
            return false
        }else{
            if(Author.length<6){
                $('#errorAuthor').text("Tên Tác Giả Phải Lớn Hơn 6 Ký Tự").show()
                return false
            }
            $('#errorAuthor').text("").hide()
        }
        if(NXB===""){
            $('#errorNXB').text("Nhà Xuất Bản Không Được Để Trống").show()
            return false
    
        }else{
            if(NXB.length<6){
                $('#errorNXB').text("Tên Nhà Xuất Bản Phải Lớn Hơn 6 Ký Tự").show()
                return false
            }
            $('#errorNXB').text("").hide()
        }
        if(Prices===""){
            $('#errorPrices').text("Giá Tiền Không Được Để Trống").show()
            return false
    
        }else{
            for(number of Prices){
                if(isNaN(parseInt(number))){
                    $('#errorPrices').text("Giá Tiền Phải Là Dạng Số").show()
                    return false
                }
            }
            if(parseInt(Prices)<1000){
                $('#errorPrices').text("Giá Tiền Phải Lớn Hơn 1000").show()
                return false
            }
            $('#errorPrices').text("").hide()
        }
        if(Quantity===""){
            $('#errorQuantity').text("Số Lượng Không Được Để Trống").show()
            return false
        }else{
            for(number of Quantity){
                if(isNaN(parseInt(number))){
                    $('#errorQuantity').text("Số Lượng Phải Là Dạng Số").show()
                    return false
                }
            }
            if(parseInt(Quantity)<0){
                $('#errorQuantity').text("Số Lượng Phải Lớn Hơn 0").show()
                return false
            }
            $('#errorQuantity').text("").hide()
        }
        return true
    }  
})

       
        

       
  

