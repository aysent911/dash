window.onload = function() {
    document.getElementById('timezone').value = Intl.DateTimeFormat().resolvedOptions().timeZone;  //
}
let forgotPassword = function() {
    var body = JSON.stringify({
        email: document.getElementById('email').value,
    });
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4){
            //console.log(this.responseText);
            var response = JSON.parse(this.responseText);
            if(response){
                if(response.info){
                    window.location.href='/reset_info';
                }else {
                    document.getElementById('email').value = response.email;
                    document.getElementById('emailError').innerHTML = response.emailError;
                }
            }
        }
    };
    xhttp.open('POST', 'forgot_password', true);
    xhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhttp.send(body);
}