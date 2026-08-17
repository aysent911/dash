window.onload = function() {
    const timezone = document.getElementById('timezone');
    if (timezone) {
        timezone.value = Intl.DateTimeFormat().resolvedOptions().timeZone;
    }

    setupVerificationCodeInputs();
}

function setupVerificationCodeInputs() {
    const inputs = Array.from(document.querySelectorAll('.verification-code__digit'));
    if (!inputs.length) return;

    const fillInputs = (value, startIndex = 0) => {
        const digits = value.replace(/\D/g, '');

        digits.slice(0, inputs.length - startIndex).split('').forEach((digit, offset) => {
            inputs[startIndex + offset].value = digit;
        });

        const nextIndex = Math.min(startIndex + digits.length, inputs.length - 1);
        inputs[nextIndex].focus();
        inputs[nextIndex].select();
    };

    inputs.forEach((input, index) => {
        input.addEventListener('input', (event) => {
            const digits = event.target.value.replace(/\D/g, '');
            event.target.value = '';

            if (digits) {
                fillInputs(digits, index);
            }
        });

        input.addEventListener('keydown', (event) => {
            if (event.key === 'Backspace' && !input.value && index > 0) {
                inputs[index - 1].value = '';
                inputs[index - 1].focus();
                event.preventDefault();
            }

            if (event.key === 'ArrowLeft' && index > 0) {
                inputs[index - 1].focus();
                event.preventDefault();
            }

            if (event.key === 'ArrowRight' && index < inputs.length - 1) {
                inputs[index + 1].focus();
                event.preventDefault();
            }
        });

        input.addEventListener('paste', (event) => {
            event.preventDefault();
            fillInputs(event.clipboardData.getData('text'), index);
        });

        input.addEventListener('focus', () => input.select());
    });
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
