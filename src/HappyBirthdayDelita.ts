import { start as showConfetti } from "./particles";

const BIRTHDAY_MONTH = 4; //NOTE: remember to use index of month
const BIRTHDAY_DAY = 15;
const DELITA = "/Delita.jpg"
const BIRTHDAY_DELITA = "/BirthdayDelita.jpg"

const DAY = 1000 * 60 * 60 * 24;
const HOUR = DAY / 24;
const MINUTE = HOUR / 60;
const SECOND = 1000;

//I keep this inline as its a small project
export interface Countdown{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

function setBackground(path: string){
    const element = document.getElementById("element");
    if(!element){
        return;
    }
    element.style.backgroundImage = `url('${path}')`;
    element.style.backgroundSize = "fill";
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

    await showConfetti();
}

function calculateCountdown(birthdayTime: number, now: number): Countdown{
    const msLeft = Math.max(0, birthdayTime - now);

    return {
        days: Math.floor(msLeft / DAY),
        hours: Math.floor((msLeft % DAY) / HOUR),
        minutes: Math.floor((msLeft % HOUR) / MINUTE),
        seconds: Math.floor((msLeft % MINUTE) / SECOND)
    };
}

//local pad helper bc im encountering errors with packages atm - TEMPORARY FIX
function pad2(value: number): string {
    return value < 10 ? `0${value}` : String(value);
}

let birthdayYear: number | null = null;

function updateCountdown() {
    const now = new Date();
    const year = now.getFullYear();
    const birthdayTime = new Date(year, BIRTHDAY_MONTH, BIRTHDAY_DAY).getTime();
    const birthdayEnd = new Date(year, BIRTHDAY_MONTH, BIRTHDAY_DAY + 2).getTime();
    const isBirthday = now.getTime() >= birthdayTime && now.getTime() < birthdayEnd;
    const nextBirthdayTime = now.getTime() >= birthdayEnd
        ? new Date(year + 1, BIRTHDAY_MONTH, BIRTHDAY_DAY).getTime()
        : birthdayTime;
    const { days, hours, minutes, seconds } = calculateCountdown(nextBirthdayTime, now.getTime());

    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    // Update display
    if (daysEl) daysEl.textContent = pad2(days);
    if (hoursEl) hoursEl.textContent = pad2(hours);
    if (minutesEl) minutesEl.textContent = pad2(minutes);
    if (secondsEl) secondsEl.textContent = pad2(seconds);

    // Check if birthday arrived (only trigger once per year)
    if (isBirthday && birthdayYear !== year) {
        birthdayYear = year;
        void birthday();
    } else if (!isBirthday && birthdayYear !== null) {
        birthdayYear = null;
        setBackground(DELITA);
        const message = document.getElementById("birthday-message");
        if (message) message.style.display = "none";
    }
}

// Initialize when page loads
document.addEventListener("DOMContentLoaded", () => {
    setBackground(DELITA);
    updateCountdown();
    setInterval(updateCountdown, 1000);
});