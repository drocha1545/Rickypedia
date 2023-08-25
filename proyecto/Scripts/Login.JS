document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const usernameDisplay = document.getElementById('usernameDisplay');
    checkUserSession();

    registerForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('registerName').value;
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if(password !== confirmPassword) {
            alert('Las contraseñas no coinciden.');
            return;
        }

        document.cookie = `name=${name}`;
        document.cookie = `username=${username}`;
        document.cookie = `password=${password}`;
        
        alert('Usuario registrado con éxito');
        usernameDisplay.innerText = name;

        hideLoginAndRegister();
    });

    function checkUserSession() {
        const savedName = getCookie('name');
        if (savedName) {
            usernameDisplay.innerText = savedName;
            hideLoginAndRegister();
        } else {
            showLoginAndRegister();
        }
    }

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        const savedUsername = getCookie('username');
        const savedPassword = getCookie('password');
        const savedName = getCookie('name');

        if (username === savedUsername && password === savedPassword) {
            alert('Inicio de sesión exitoso');
            usernameDisplay.innerText = savedName;

            hideLoginAndRegister();
        } else {
            alert('Usuario o contraseña incorrectos');
        }
    });

    document.getElementById('logoutButton').addEventListener('click', function() {
        deleteCookie('name');
        deleteCookie('username');
        deleteCookie('password');
        alert('Sesión cerrada con éxito.');
        showLoginAndRegister();
    });


    function hideLoginAndRegister() {
        document.getElementById('registerNavItem').style.display = 'none';
        document.getElementById('loginNavItem').style.display = 'none';
        document.getElementById('welcomeMessage').style.display = 'block';
        document.getElementById('logoutNavItem').style.display = 'block';
    }

    function showLoginAndRegister() {
        document.getElementById('registerNavItem').style.display = 'block';
        document.getElementById('loginNavItem').style.display = 'block';
        document.getElementById('welcomeMessage').style.display = 'none';
        document.getElementById('logoutNavItem').style.display = 'none';
    }
    function getCookie(cname) {
        const name = cname + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
    
    function deleteCookie(name) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
});
