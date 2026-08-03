//import { tsParticles } from "@tsparticles/engine";
//import { loadConfettiExplosionsPreset } from "@tsparticles/preset-confetti-explosions";

const BIRTHDAY_DATE = new Date(); //new Date(2026,6,27); //FIXME: change to real date
const birthdayTime = (BIRTHDAY_DATE.getTime()) + 5000; //FIXME: remove 5 seconds only for testing
const DELITA = "/Delita.jpg"
const BIRTHDAY_DELITA = "/BirthdayDelita.jpg"

const DAY = 1000 * 60 * 60 * 24;
const HOUR = DAY / 24;
const MINUTE = HOUR / 60;
const SECOND = 1000;

function setBackground(path: string){
    const element = document.getElementById("element");
    if(!element){
        return;
    }
    element.style.backgroundImage = `url('${path}')`;
    element.style.backgroundSize = "contain";
    element.style.backgroundPosition = "center";
}

//once the birthday has arrived, cosmetic effects will be initialized
async function birthday(){
    setBackground(BIRTHDAY_DELITA);

    const message = document.getElementById("birthday-message");
    if(message){
        message.textContent = "HAPPY BIRTHDAY DELOITTE!!!"
        message.style.display = "block"; //temporary display for testing - TODO: change this later
    }
}

export interface Countdown{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

function calculateCountdown(): Countdown{
    const msLeft = Math.max(0, birthdayTime - Date.now());

    return {
        days: Math.floor(msLeft / DAY),
        hours: Math.floor((msLeft % DAY) / HOUR),
        minutes: Math.floor((msLeft % HOUR) / MINUTE),
        seconds: Math.floor((msLeft % MINUTE) / SECOND)
    };
}

async function init() {
    setBackground(DELITA);
}

//when page loads
document.addEventListener("DOMContentLoaded", init);

let birthdayTriggered = false;

//local pad helper bc im encountering errors with packages atm - TEMPORARY FIX
function pad2(value: number): string {
    return value < 10 ? `0${value}` : String(value);
}

function updateCountdown() {
    const { days, hours, minutes, seconds } = calculateCountdown();

    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    // Update display
    if (daysEl) daysEl.textContent = pad2(days);
    if (hoursEl) hoursEl.textContent = pad2(hours);
    if (minutesEl) minutesEl.textContent = pad2(minutes);
    if (secondsEl) secondsEl.textContent = pad2(seconds);

    // Check if birthday arrived (only trigger once)
    if (days === 0 && hours === 0 && minutes === 0 && seconds === 0 && !birthdayTriggered) {
        birthdayTriggered = true;
        birthday();
    }
}

updateCountdown();
setInterval(updateCountdown, 1000);
