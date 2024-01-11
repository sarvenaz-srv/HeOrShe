function onSubmitClick(event){
    event.preventDefault()
    // clear last data
    let errElement = document.getElementById("prediction-error")
    hideError(errElement)
    document.getElementById("gender").innerHTML = ""
    document.getElementById("probability").innerHTML = ""
    hideSavedAnswerBox()

    // get input value
    let nameField = document.getElementById("name")
    let name = nameField.value.toLowerCase()

    //validate input
    if(!validateName(name)){
        if (name.length < 1 || name.length > 255){
            showError(errElement, "Invalid name length")
            return
        }else{
            showError(errElement, "Invalid name pattern")
            return
        }
    }

    // send request to server
    let url = `https://api.genderize.io/?name=${name}`
    fetch(url)
    .then(response => {
        if (!response.ok){ // show error
            showError(errElement, "Network Error")
            return
        }
        return response.json()
    })
    .then(data => { // show results
        if (data.gender === null) {
            showError(errElement, "Could not predict")
            return
        }else{
            document.getElementById("gender").innerHTML = data.gender
            document.getElementById("probability").innerHTML = data.probability
        }
    });

    showSavedAnswerBox(name)
}


function onSaveClick(){
    // get input
    let gender = document.querySelector('input[name = "gender"]:checked')
    let name = document.getElementById("name").value.toLowerCase()
    let errElement = document.getElementById("save-error")
    hideError(errElement)

    // validate input
    if(!validateName(name)){ // show error
        if (name.length < 1 || name.length > 255){
            showError(errElement, "Invalid name length")
            return
        }else{
            showError(errElement, "Invalid name pattern")
            return
        }
    } else if(gender === null){
        showError(errElement, "Gender is not selected")
        return
    }

    // remove last saved value
    if(localStorage.getItem(name) !== null){
        localStorage.removeItem(name)
    }

    // save new value in local storage
    gender = gender.value
    localStorage.setItem(name, gender)
   
}

function onClearClick(name){
    // clear the saved value
    localStorage.removeItem(name)
    hideSavedAnswerBox()
}


function showSavedAnswerBox(name){

    if(localStorage.getItem(name) !== null){
        // display saved answer box if there exists any saved answer
        let box = document.getElementById("saved-answer-box")
        box.style.visibility = 'visible'
        let el = document.getElementById("saved-gender")
        el.innerHTML = localStorage.getItem(name)
        document.getElementById("clear-btn").onclick = () => onClearClick(name)
    }
    
}

function hideSavedAnswerBox(){
    // hide saved answer box
    document.getElementById("saved-answer-box").style.visibility = 'hidden'
    document.getElementById("saved-gender").innerHTML = ""
}

function showError(el, msg){
    // display an error message in a given error element
    el.style.color = "red"
    el.innerHTML = msg
    el.style.visibility = 'visible'
}

function hideError(el){
    // hide the given error element
    el.style.visibility = 'hidden'
    el.innerHTML = ""
}

function validateName(str){
    // validate name input's length and pattern
    let pattern = /^[a-z\s]{1,255}$/;
    return pattern.test(str)
}

hideSavedAnswerBox()
// set event handlers
document.getElementById("form").onsubmit = onSubmitClick
document.getElementById("save-btn").onclick = onSaveClick


