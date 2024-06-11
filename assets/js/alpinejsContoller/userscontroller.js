document.addEventListener('alpine:init', () => {
        Alpine.data('usersData', function(){
            return{
                mainUsers:[],
                users:[],
                pageUsers:[],
                isloading :false,
                showAddModal:false,
                pageCount:1,
                itemCount:4,
                currentPage:1,
                searchChar:"",
                newUserInfo:{
                    name:"",
                    username:"",
                    email:"",
                },

                getUsers(){
                    this.isloading=true
                    axios.get("https://jsonplaceholder.typicode.com/users").then((res)=>{
                    this.mainUsers=res.data
                    this.users=res.data
                        this.pagination()
                    }).finally(()=>{
                        this.isloading=false
                    })
                },

                pagination(){
                    this.pageCount=Math.ceil(this.users.length / this.itemCount) //    10 / 4 =3
                    let start = (this.currentPage * this.itemCount) - this.itemCount   // 0
                    let end = this.currentPage * this.itemCount   // 4
                    this.pageUsers=this.users.slice(start,end)
                },

                nextPage(){
                    this.currentPage++
                    if(this.currentPage > this.pageCount)  this.currentPage = this.pageCount
                    this.pagination()
                },

                prevPage(){
                    this.currentPage--
                    if(this.currentPage < 1)  this.currentPage = 1
                    this.pagination()
                },

                handleChangeItemCount(e){
                    this.currentPage=1
                    this.itemCount = e.value
                    if ( this.itemCount < 1) this.itemCount = 1
                    if ( this.itemCount > this.users.length) this.itemCount = this.users.length
                    this.pagination()
                 },

                 handleSearch(value){
                        this.users= this.mainUsers.filter(user=>(user.name.includes(value) ||
                         user.username.includes(value) ||
                          user.email.includes(value)))
                        this.currentPage = 1
                        this.pagination()
                 },

                 handleSubmitAddUserForm(){
                    this.isloading=true
                    axios.post("https://jsonplaceholder.typicode.com/users",this.newUserInfo).then(
                        (res)=>{
                            if(res.status == 201) {
                                this.mainUsers.push(res.data)
                                this.showAddModal=false
                                this.handleResetForm()
                                this.pagination()
                                M.toast({html: 'User added successfully ...', classes: 'rounded green'});
                            }

                        this.pagination()
                    }).finally(()=>{
                        this.isloading=false
                    })
                 },

                 handleResetForm(){

                    this.newUserInfo={
                        name:"",
                        username:"",
                        email:"",
                    }
                 },

                 handleDeleteUser(userId){
                    var toastHTML = '<span>Are you sure ?(' + userId + ')</span><button class="btn-flat toast-action" x-on:click="handleConfirmDeleteUser(' + userId + ')">Delete</button>';
                    M.toast({html: toastHTML});
                 },

                 handleConfirmDeleteUser(userId){
                    this.isloading=true
                    axios.delete("https://jsonplaceholder.typicode.com/users/"+userId).then(
                        (res)=>{
                            if(res.status == 200) {
                                this.mainUsers=this.mainUsers.filter(user=>user.id !=  userId)
                                this.users=this.users.filter(user=>user.id !=  userId)
                                this.pagination()
                                M.toast({html: 'The deletion was successful ...', classes: 'rounded green'});
                                console.log(res);
                            }
                        this.pagination()
                    }).finally(()=>{
                        this.isloading=false
                    })
                 }
            
            }})

})