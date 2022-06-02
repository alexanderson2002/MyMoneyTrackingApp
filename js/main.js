/* FIREBASE IMPORT */
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-analytics.js";
import {getDatabase, ref, get, set, child} from "http://www.gstatic.com/firebasejs/9.8.1/firebase-database.js";
const firebaseConfig = { //Burner Firebase account,
    apiKey: "AIzaSyBidm7cgI3FPvx_1Ij-NAgBAqnFRiyDfWo",
    authDomain: "my-money-tracking-app-eddf9.firebaseapp.com",
    projectId: "my-money-tracking-app-eddf9",
    storageBucket: "my-money-tracking-app-eddf9.appspot.com",
    messagingSenderId: "628266866505",
    appId: "1:628266866505:web:de69fcc5a9434b36e4ec98",
    measurementId: "G-HNBPGSH97K"
  };
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase();

/* VARIABLES */
var pin = 0;
var name = "";
var wants = 0;
var needs = 0;
var savings = 0;
var payRate = 0;
var hours = 0;
var validated = false;

const content = document.getElementById("content");
const buttonSection = document.getElementById("buttons");
const hoursWorked = document.getElementById("hoursWorked");
const start = document.getElementById("start");

/* DISPLAY */
content.style.display = "none";
buttonSection.style.display = "none";
hoursWorked.style.display = "none";

/* UPDATE DISPLAY */
function updateDisplay(){
    document.getElementById("wants").innerText = ("$" + Number(wants).toLocaleString('en'));
    document.getElementById("needs").innerText =  ("$" + Number(needs).toLocaleString('en'));
    document.getElementById("savings").innerText =  ("$" + Number(savings).toLocaleString('en'));
    document.getElementById("name").innerText = ("Hello " + name );
    document.getElementById("payrate").innerText = ("your payrate: $" + payRate + "/hour");
}

/* SET PAY RATE */
/* can only be changed in console or firebase */
function setPayRate(newPayRate){
    payRate = newPayRate;
}

/* PIN */
/* Allows only numerical pins */
document.getElementById("pin").addEventListener("keypress", function(evt) {
    if (evt.which < 48 || evt.which > 57) {
        evt.preventDefault();
    }
});

/* OLD BUTTONS */
document.getElementById("submit").addEventListener("click", submited);
function submited(){;
    pin = document.getElementById("pin").value + "/";
    validation();
}

document.getElementById("hoursAdd").addEventListener("click", addHoursWorked);
function addHoursWorked(){
    hours = Number(document.getElementById("hours").value);
    wants += (payRate / 3) * hours;
    needs += (payRate / 3) * hours;
    savings += (payRate / 3) * hours;
    updateDisplay();
}

document.getElementById("hoursSub").addEventListener("click", removeHoursWorked);
function removeHoursWorked(){
    hours = Number(document.getElementById("hours").value);
    wants -= (payRate / 3) * hours;
    needs -= (payRate / 3) * hours;
    savings -= (payRate / 3) * hours;
    updateDisplay();
}

document.getElementById("wantsAdd").addEventListener("click", addWants);
function addWants(){
    wants += Number(document.getElementById("wantsInput").value);
    updateDisplay();
}

document.getElementById("wantsSub").addEventListener("click", removeWants);
function removeWants(){
    wants -= Number(document.getElementById("wantsInput").value);
    updateDisplay();
}

document.getElementById("needsAdd").addEventListener("click", addNeeds);
function addNeeds(){
    needs += Number(document.getElementById("needsInput").value);
    updateDisplay();
}

document.getElementById("needsSub").addEventListener("click", removeNeeds);
function removeNeeds(){
    needs -= Number(document.getElementById("needsInput").value);
    updateDisplay();
}

document.getElementById("savingsAdd").addEventListener("click", addSavings);
function addSavings(){
    savings += Number(document.getElementById("savingsInput").value);
    updateDisplay();
}

document.getElementById("savingsSub").addEventListener("click", removeSavings);
function removeSavings(){
    savings -= Number(document.getElementById("savingsInput").value);
    updateDisplay();
}

/* -FIREBASE STUFF- */
/* GET DATA */
function SelectData(request){
    get(child(ref(db), pin + request)).then((snapshot)=>{
        if(snapshot.exists()){
            getValue(request, snapshot.val());
        }
    });
}
function getValue(request, value){
    switch (request) {
        case "wants":
            wants = value; break;
        case "name":
            name = value; break;
        case "needs":
            needs = value; break;
        case "savings":
            savings = value; break;
        case "payRate":
            payRate = value; break;
        case "pin":
            validated = value; break;
    }
    updateDisplay();
}

/* VALIDATION */
function validation(){
    get(child(ref(db), pin)).then((snapshot)=>{
        if(snapshot.exists() && pin != "/"){
            getValue("pin", snapshot.exists());
            SelectData("name");
            SelectData("wants");
            SelectData("needs");
            SelectData("savings");
            SelectData("payRate");
            content.style.display = "grid";
            buttonSection.style.display = "grid";
            hoursWorked.style.display = "block";
            start.style.display = "none";
            updateDisplay();
        }
        else{
            alert("You do not have an account, to sign up ask me: Email:alexaanderson2002@hotmail.com Discord:L3X3#8291");
        }
    });
}

/* SAVE */
document.getElementById("save").addEventListener("click", InsertData);
function InsertData(){
    if(validated){
        set(ref(db, pin),{
            "name": name,
            "wants": wants,
            "needs": needs,
            "savings": savings,
            "payRate": payRate
        })
        .then(()=>{
            alert("data stored");
        })
        .catch((error)=>{
            alert("you fucked up " + error);
        });
    }
}