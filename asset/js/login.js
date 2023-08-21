var cd=false
var count = 0
var bg = ["https://images.hdqwalls.com/wallpapers/planet-science-fiction-among-stars-4k-27.jpg","https://sportishka.com/uploads/posts/2022-11/1667479858_2-sportishka-com-p-feliks-baumgartner-prizhok-iz-stratosferi-2.jpg","https://images.hdqwalls.com/wallpapers/urban-city-science-fiction-4k-or.jpg","https://wallpapercave.com/wp/wp4807893.jpg","https://images.hdqwalls.com/wallpapers/space-science-fiction-4k-de.jpg","https://wallpaperaccess.com/full/824584.jpg","https://www.albayan.ae/polopoly_fs/1.4563978.1669112103!/image/image.jpg"]

const API="https://64b00d29c60b8f941af524b6.mockapi.io/acc"

//Tạo cooldown đăng nhập tránh tạo acc nhiều lần
function initCd() {
    cd=true
    setTimeout(()=>{
        cd=false
    },3000)
}

//Set Cookie
function setCookie(username,email,remember) {
    let d = new Date()
    if (remember) {
        d.setTime(d.getTime() + Infinity)//Luu vinh vien
    }else{
        d.setTime(d.getTime() + 24*60*60*1000) //Luu 1 ngay = 24*60*60*1000
    }
    var expires = "expires="+ d.toUTCString();
    document.cookie = "username="+username+"; expires="+expires
    document.cookie = "email="+email+"; expires="+expires
}

//Tải thông tin đăng ký
async function fetchSignUp(upload) {
    var status = 200
    await fetch(API,{
        method:"GET",
        headers:{'content-type':'application/json'},
    }).then(async res =>{
        let data = await res.json()
        for (let i=0;i<data.length;i++) {
            if (upload["email"] == data[i]["email"]) {
                status = 301
                break
            }
            if (upload["username"] == data[i]["username"]) {
                status = 300
                break
            }            
        }
        if (status==200) {
            await fetch(API,{
                method:"POST",
                headers:{'content-type':'application/json'},
                body: JSON.stringify(upload)
            }).then(async res =>{
                data = res.json()
            }).catch(err => console.log(err))
        }
    }).catch(err => console.log(err))
    return status
}

//Kiểm tra đăng nhập
async function fetchLogin(){
    var status = 500
    await fetch(API,{
        method:"GET",
        headers:{'content-type':'application/json'}
    }).then(async (res)=>{
                let data=await res.json()
                let check=false;
                for (let i=0;i<data.length;i++) {
                   if ( data[i]["username"]==$('#emailLogin').val().trim() || data[i]["email"]==$('#emailLogin').val().trim() ) {
                        check=true;
                        if (data[i]["password"]==$('#passwordLogin').val()) {
                            setCookie(data[i]["username"],data[i]["email"],$('.input-check').eq(0).is(':checked'))
                            status=200                            
                        }else{
                            status=301                            
                        }
                        break
                    }
                }
                if (!check) {
                    status=300
                    
                }
            }).catch((err)=>{
                console.error(err)
                alert("The server is not responding")
            })
    return status
}

//Kiểm tra định form 
async function checkAcc(){
    let email = $('#emailSignUp').val().trim()
    if (!isValidEmail(email)) {
        $('.input-box').eq(2).addClass("invalid")
        $('.notify').eq(2).html(`
        <i class="fa-solid fa-circle-info"></i>
        Invalid email`)        
        return
    }
    let user = $('#username').val().trim()
    if (!isValidUsername(user)) {
        $('.input-box').eq(3).addClass("invalid")
        $('.notify').eq(3).html(`<i class="fa-solid fa-circle-info"></i>Invalid username`)
        return
    }
    let pw = $('#password').val()
    if (pw.length<8) {
        $('.input-box').eq(4).addClass("invalid")
        $('.notify').eq(4).html(`<i class="fa-solid fa-circle-info"></i>Password must be more 8 letters!`)
        return
    }
    if (pw != $('#c-password').val()) {
        $('.input-box').eq(4).addClass("invalid")
        $('.input-box').eq(5).addClass("invalid")
        $('.notify').eq(4).html(`<i class="fa-solid fa-circle-info"></i>Passwords do not match!`)
        return
    }
    if (!$('.input-check').eq(1).is(':checked')) {
        return
    }
    let temp = {
        "username":user,
        "email":email,
        "password":pw
    }
    let status = await fetchSignUp(temp)
    if (status==301) {
        $('.input-box').eq(2).addClass("invalid")
        $('.notify').eq(2).html(`
        <i class="fa-solid fa-circle-info"></i>
        Email had been used!`)        
        return
    }
    if (status==300) {
        $('.input-box').eq(3).addClass("invalid")
        $('.notify').eq(3).html(`<i class="fa-solid fa-circle-info"></i>Username had been used!`)
        return
    }
    if (status==200) {
        $('.input-box').eq(2).addClass("valid")
        $('.input-box').eq(3).addClass("valid")
        $('.input-box').eq(4).addClass("valid")
        $('.input-box').eq(5).addClass("valid")
        setTimeout(()=>{
            $('#emailLogin').val(user)
            $('.wrapper').removeClass('active');
        },2000)
        return
    }
}

$(document).ready(async(e)=>{
    //Tạo ảnh ngẫu nhiên
    $("body").css("backgroundImage",`url(${bg[Math.floor(Math.random()*bg.length)]})`)
    //Tạo sự kiện nút chuyển trang đăng kí
    $('.register-link').click((e)=> { 
        $('.wrapper').addClass('active')    
    });
    //Tạo sự kiện nút chuyển trang đăng nhập    
    $('.login-link').click((e)=>{
        $('.wrapper').removeClass('active');
    })
    //ĐĂNG NHẬP
    $('.submitBtn').eq(0).click(async (e)=>{
        $('.input-box').removeClass("invalid")
        $('.input-box').removeClass("valid")
        if ($('#emailLogin').val().trim() && $('#passwordLogin').val().trim()) {
            let status = await fetchLogin()
            switch (status) {
                case 200:{
                    setTimeout(()=>{
                        sessionStorage.clear()
                        location.href= nextPage //ở redirects.js
                    },1000)
                    break
                }
                case 300:{
                    $('.input-box').eq(0).addClass("invalid")
                    break
                }
                case 301:{
                    $('.input-box').eq(1).addClass("invalid")
                    break
                }
            }
        }
    })
    //ĐĂNG KÍ
    $('.submitBtn').eq(1).click(async (e)=>{
        $('.input-box').removeClass("invalid")
            if (!cd) {
                initCd()
                await checkAcc()
            }
    })
    forgotPw();
})

// Ham linh tinh
function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

function isValidUsername(username) {
    const usernameRegex = /^[a-zA-Z0-9_]{6,}$/;
    return usernameRegex.test(username);
  }

function forgotPw(){
    $('.remember-forgot a').click(()=>{
    alert('Try to remember your password!');
})
}