currentStep = 0;

function nextStep() {
    showWarning(false);
    document.querySelector(`#step${currentStep}`).classList.add('done');
    currentStep++;
    document.querySelector(`#step${currentStep}`).classList.remove('hidden');
    document.querySelector(`#step${currentStep}`).classList.remove('done');
}

function previousStep() {
    showWarning(false);
    if (currentStep == 0) {
        window.open('landing.html', '_self');
        return;
    }
    document.querySelector(`#step${currentStep}`).classList.add('hidden');
    currentStep--;
    document.querySelector(`#step${currentStep}`).classList.remove('done');
}

function setStep(value) {
    document.querySelector(`#step${currentStep}`).classList.add('hidden');
    currentStep = value;
    document.querySelector(`#step${currentStep}`).classList.remove('done');
    document.querySelector(`#step${currentStep}`).classList.remove('hidden');
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

function showWarning(value) {
    if (!value) {
        document.querySelector('.warning').classList.remove('shown');
        return;
    }
    document.querySelector('.warning').classList.add('shown');
    document.querySelector('.warning').innerHTML = `<i class="ph-warning"></i>${value}`;
}

function checkAllData() {
    let email = document.querySelector(`#email`).value;
    let password = document.querySelector(`#password`).value;
    let first_name = document.querySelector(`#name`).value;
    let last_name = document.querySelector(`#last_name`).value;

    if (!isValidEmail(email)) {
        setStep(0);
        showWarning('Введите правильный адрес электронной почты.');
        return;
    }
    if (password.length < 6) {
        setStep(0);
        showWarning('Слишком короткий пароль. Минимальная длина: 6 символов.');
        return;
    }
    if (first_name.trim().length == 0) {
        setStep(1);
        showWarning('Введите ваше имя.');
        return;
    }
    if (last_name.trim().length == 0) {
        setStep(1);
        showWarning('Введите вашу фамилию.');
        return;
    }

    signUp();
}

async function signUp() {
    try {

        let email = document.querySelector(`#email`).value;
        let password = document.querySelector(`#password`).value;
        let first_name = document.querySelector(`#name`).value;
        let last_name = document.querySelector(`#last_name`).value;

        document.querySelector('#finish_btn').disabled = true;

        console.log(JSON.stringify({
            email: email,
            password: password,
            name: first_name,
            last_name: last_name,
            image: loadedImage.split(',')[1]
        }));
    
        const response = await fetch('php/signup.php', {
          method: 'POST',
          body: JSON.stringify({
            email: email,
            password: password,
            name: first_name,
            last_name: last_name,
            image: loadedImage.split(',')[1]
          })
        })
        
        const result_json = await response.json();
        console.log(result_json);
    
        if (result_json.success) {
          window.open('index.html', '_self');
        } else if (result_json.error) {
            showWarning(result_json.error);
            console.log(result_json);
        }
      } catch (error) {
        console.error('Error: ', error)
        showWarning(error);
      }
}