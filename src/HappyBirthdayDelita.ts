import { tsParticles } from "@tsparticles/engine";
import { loadConfettiExplosionsPreset } from "@tsparticles/preset-confetti-explosions";

const BIRTHDAY_DATE = new Date(2026,6,27);
const birthdayTime = BIRTHDAY_DATE.getTime();
const DELITA = "/Delita.jpg"
const BIRTHDAY_DELITA = "/BirthdayDelita.jpg"

const DAY = 1000 * 60 * 60 * 24;
const HOUR = DAY / 24;
const MINUTE = HOUR / 60;
const SECOND = 1000;

function changeBackground(path: string){
    const element = document.getElementById("element");
    if(element){
        element.style.backgroundImage = `url('${path}')`;
        element.style.backgroundSize = "cover";
        element.style.backgroundPosition = "center";
    }

}

//once the birthday has arrived, cosmetic effects will be initialized
function birthday(){
    changeBackground(BIRTHDAY_DELITA);
    showConfetti();

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

function calculate(): Countdown{
    const currTime = Date.now();
    let msLeft = birthdayTime - currTime;

    //FIXME: no need for this if we check it in updateCountdown
    if(msLeft <= 0){
        return {days: 0, hours: 0, minutes: 0, seconds: 0};
    }
    const days = Math.floor(msLeft / DAY);
    msLeft %= DAY;
    const hours = Math.floor(msLeft / HOUR);
    msLeft %= HOUR;
    const minutes = Math.floor(msLeft / MINUTE);
    msLeft %= MINUTE;
    const seconds = Math.floor(msLeft / SECOND);

    return {days, hours, minutes, seconds};
}

//from tsparticles presets on github
async function showConfetti() {
    await loadConfettiExplosionsPreset(engine);
    await tsParticles.load({
        id: "tsparticles",
        options: {
            particles: {
                color: {
                    value: ["#0000ff", "#00ff00"],
                },
            },
            preset: "confettiExplosions", // or "confetti-explosions"
        },
    });
}

async function init() {
    changeBackground(DELITA);
}

//when page loads
document.addEventListener("DOMContentLoaded", init);

let birthdayTriggered = false;

//local pad helper bc im encountering errors with packages atm - TEMPORARY FIX
function pad2(value: number): string {
    return value < 10 ? `0${value}` : String(value);
}

function updateCountdown() {
    const { days, hours, minutes, seconds } = calculate();

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
