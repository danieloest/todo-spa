/***************************************
 * Loads sign up form
 ***************************************/
function loadSignUp() {
    let holder = document.getElementById("loginHolder");
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '../signUp.html', true);
    xhr.onreadystatechange= function() {
        if (this.readyState!==4) return;
        if (this.status!==200) return;
        holder.innerHTML= this.responseText;
    };
    xhr.send();
}
/***************************************
 * Loads log in form
 ***************************************/
function loadLogIn() {
    let holder = document.getElementById("loginHolder");
    // holder.innerHTML = "???";
    var xhr= new XMLHttpRequest();
    xhr.open('GET', '../logIn.html', true);
    xhr.onreadystatechange= function() {
        if (this.readyState!==4) return;
        if (this.status!==200) return;
        holder.innerHTML= this.responseText;
    };
    xhr.send();
}

/***************************************
 * Checks if the passwords are valid
 ***************************************/
function signUp() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var passwordConfirm = document.getElementById("confirm-password").value;
    // Confirm passwords are the same
    if (password != passwordConfirm) {
        var error = document.getElementsByClassName("error");
        for (var i = 0; i < error.length; i++) {
            error[i].innerHTML = "*";
        }
        document.getElementById("errorMessage").innerHTML = "Passwords did not match";
        return false;
    }
    // Confirm password has a number and is longer than 7 characters
    else if (/\d/.test(password) == false || password.length < 7) {
        var error = document.getElementsByClassName("error");
        for (var i = 0; i < error.length; i++) {
            error[i].innerHTML = "*";
        }
        document.getElementById("errorMessage").innerHTML = "Password must contain at least 7 charactes and a number";
        return false;
    }
    else {
        return true;
    }
}


function removeTask(id) {
    alert("Task id: " + id);
    $.post('/removeTask', {taskId: id},function() {

    })
}

function addX(taskIds) {
    console.log("Adding the x thing");
    var taskList = document.getElementsByClassName("task");
    for (let  i = 0; i < taskList.length; i++) {
        var span = document.createElement("SPAN");
        var txt = document.createTextNode("\u00D7");
        span.className = "close";
        $(span).click(function(event) {
            // alert("Clicked the x thing!");
            let id = jQuery(this).attr("id");
            removeTask(id);
        })
        span.id = taskIds[i];
        span.appendChild(txt);
        taskList[i].appendChild(span);
}
}

/**************************************************************
* Loads the to do list
**************************************************************/
function loadTodoList() {
    $.get('/loadTodoList', function(results) {
        // console.log(results);
        let tasks = JSON.parse(results);
        console.log(tasks);
        let taskIds = [];
        let taskHolder = document.getElementById("taskHolder");
        taskHolder.innerHTML = "<ul id=\"tasks\" class=\"list-group\">";
        tasks.forEach(task => {
            console.log(task);
            taskHolder.innerHTML += `<li class=\"task list-group-item\" id=\"${task.itemid}\">${task.task}</li>`;
            taskIds.push(task.itemid);
        });
        addX(taskIds);
    });
}


/**************************************************************
* Check whether or not the user is logged in
**************************************************************/
function checkLoggedIn() {
    $.get('/isLoggedIn', function(result) {
        console.log(result.success);
        let jumbotron = document.getElementById("jumbotron");
        // User logged in
        if (result.success) {
            // Display Log out button
            jumbotron.innerHTML = '<ul class="nav justify-content-center"><li class="nav-item"><a class="nav-link" href="#" onclick="logOut()">Log Out</a></li></ul>';
            loadTodoList();
        }
        else {
            // Display "Log In" and "Sign Up" button
            jumbotron.innerHTML = '<ul class="nav justify-content-center"><li class="nav-item"><a class="nav-link" href="#" onclick="loadLogIn()">Log In</a></li><li class="nav-item"><a class="nav-link" href="#" onclick="loadSignUp()">Sign Up</a></li></ul>';
        }
    })
}

/**************************************************************
* Communicates with the server to log out the user
**************************************************************/
function logOut() {
    console.log("In logout()");
    $.post('/logOut', function(data) {
        console.log("logging out");
        console.log(data);
        if (data.success) {
            window.location.href = "/todo";
        }
    });
}