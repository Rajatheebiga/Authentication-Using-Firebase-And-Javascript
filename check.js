const firebaseConfig = {
    apiKey: "AIzaSyDZ5mlehhcrKcybM8Y5UTwzwP4Pk-nd3sw",
    authDomain: "classassignment-92528.firebaseapp.com",
    databaseURL: "https://classassignment-92528-default-rtdb.firebaseio.com",
    projectId: "classassignment-92528",
    storageBucket: "classassignment-92528.appspot.com",
    messagingSenderId: "471722851261",
    appId: "1:471722851261:web:cf27246cd3efe80f59b0d4"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

function getElementValue(id) {
    return document.getElementById(id).value;
}


document.getElementById("userSignOutBtn").style.visibility = "hidden";
document.getElementById("dbOutput").style.visibility = "hidden";
document.getElementById("dbOutput-msg").style.visibility = "hidden";
document.getElementById("dbOutput-author").style.visibility = "hidden"


// user signup details
function userSignDetails(event) {
    event.preventDefault();

    let obj = {
        Name: getElementValue("name"),
        Dateofbirth: getElementValue("dateOfBirth"),
        Email: getElementValue("userEmail"),
        Password: getElementValue("userPassword"),
    }
    if (obj.Dateofbirth !== "" && obj.Name !== "" && obj.Password !== "" && obj.Email !== "") {
        postToFirebaseUsingId(obj);
        auth.createUserWithEmailAndPassword(obj.Email, obj.Password)
            .then((userCredential) => {
                let user = userCredential.user.email;
                console.log("User created ", user);
            }).catch((err) => {
                console.log(err)
            })
    }

}

// posting user details to firebase
function postToFirebaseUsingId(obj) {
    const ref = firebase.database().ref("Users");
    const user_key = "newUser";
    const ref2 = ref.child(user_key)
    ref2.set(obj);
    // console.log(obj)
    document.getElementById("successMsg").innerHTML = `Account Created Successfully.`;
    console.log('user created')


}
let signUpBtn = document.getElementById("userSignup");
let signOutBtn = document.getElementById("userSignOutBtn");
let userSignInEmail = document.getElementById("usersignInEmail");
let userSignInPassword = document.getElementById("userSignInPassword");

// getting data from firebase
function getDatafromFirebase() {
    const ref = firebase.database().ref().child("Users");
    const UID = "newUser";
    ref.child(UID).get()
        .then((snapshot) => {
            if (snapshot.exists()) {
                let userData = snapshot.val();
                // console.log(userData)
                let Dob = userData.Dateofbirth
                let userNm = userData.Name
                daysCalculation(Dob, userNm)
            }
        })
        .catch((err) => {
            console.log("Error: ", err)
        })
}





// signInBUtton
document.getElementById("form-signIn").addEventListener('submit', (e) => {
    e.preventDefault();
    let emailSignIn = userSignInEmail.value;
    let passwordSignIn = userSignInPassword.value;

    auth.signInWithEmailAndPassword(emailSignIn, passwordSignIn)
        .then((userCredential) => {
            let user = userCredential.user.email;
            console.log(" User Signed In ", user);
            getDatafromFirebase();
            document.getElementById("signInSignUp").style.visibility = "hidden";

        }).catch((err) => {
            // location.reload()
            document.getElementById("errorMsg").innerHTML = `Invalid UserEmail or Password.`;
            console.log(err)
        })

})




const sendHttpRequest = (method, url) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        xhr.onload = () => {
            if (xhr.status > 300) {
                reject(`Error ${xhr.status}: ${xhr.statusText}`)
            } else {
                let data = xhr.response;
                resolve(data)
            }
        }
        xhr.open(method, url);
        xhr.send();
    })
}

// random birthdaymsg
async function getBirthdayMsg(userNm) {
    const productData = await sendHttpRequest('GET', 'https://type.fit/api/quotes')
    const msgLength = productData.length;
    const msgRandom = Math.floor(Math.random() * msgLength)
    let userName = userNm.charAt(0).toUpperCase() + userNm.slice(1);
    document.getElementById("dbOutput").innerHTML = `Happy birthday, ${userName}!`;
    document.getElementById("dbOutput-msg").innerHTML = `"${productData[msgRandom].text}"`;
    document.getElementById("dbOutput-author").innerHTML = `${productData[msgRandom].author}`;
    document.getElementById("userSignOutBtn").style.visibility = "visible";

}


//   // signOut
signOutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    location.reload()
    document.getElementById("userSignOutBtn").style.visibility = "hidden";
    document.getElementById("signInSignUp").style.visibility = "visible";
    document.getElementById("dbOutput").style.visibility = "hidden";
    document.getElementById("dbOutput-msg").style.visibility = "hidden";
    document.getElementById("dbOutput-author").style.visibility = "hidden";
    auth.signOut()
        .then(() => {
            console.log("User Signed Out")
        }).catch((err) => {
            console.log("User Signed Out")
        })

})

// days until birthday calculation
function daysCalculation(Dob, userNm) {
    var mdy = Dob.split('-');
    var date = mdy[2];
    var month = mdy[1];
    var birthdayArray = [parseFloat(date), parseFloat(month)]

    const today = new Date();
    //  console.log(birthdayArray )
    const bday = new Date(today.getFullYear(), birthdayArray[1] - 1, birthdayArray[0]);
    //  console.log(bday)
    if (today.getTime() > bday.getTime()) {
        bday.setFullYear(bday.getFullYear() + 1);
        //  console.log(bday)
    }

    diffDate = bday.getDate() - today.getDate();
    //  console.log(diffDate)
    diffMonth = bday.getMonth() - today.getMonth();
    //  console.log(diffMonth)

    if (diffDate === 0 && diffMonth === 0) {
        // console.log("Happy birthday")
        document.getElementById("dbOutput").style.visibility = "visible";
        document.getElementById("dbOutput-msg").style.visibility = "visible";
        document.getElementById("dbOutput-author").style.visibility = "visible";
        getBirthdayMsg(userNm)
    }
    else {
        diff = bday.getTime() - today.getTime();
        let days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        document.getElementById("dbOutput").style.visibility = "visible";
        document.getElementById("dbOutput-msg").style.visibility = "visible";
        document.getElementById("dbOutput-author").style.visibility = "visible";
        console.log(days + " days until Niet's birthday!");
        document.getElementById("dbOutput").innerHTML = `${days} DAYS LEFT`;
        document.getElementById("dbOutput-msg").innerHTML = `UNTIL YOUR BIRTHDAY!`;
        document.getElementById("userSignOutBtn").style.visibility = "visible";
    }
}


document.getElementById("form-signUp").addEventListener("submit", userSignDetails);