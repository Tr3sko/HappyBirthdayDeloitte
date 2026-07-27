import { tsParticles } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

const BIRTHDAY_DATE = new Date("2026-05-05");
const DELITA = "public/Delita.jpg"
const BRITHDAY_DELITA = "public/BirthdayDelita.jpg"

const DAY = 1000 * 60 * 60 * 24;
const HOUR = DAY / 24;
const MINUTE = HOUR / 60;
//const SECOND = 1000; //FIXME may not be needed

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
    changeBackground("BIRTHDAY_IMAGE"); //fixme: once picture is found
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
    const currTime = new Date();
    let secondsLeft = Math.floor((BIRTHDAY_DATE.getTime() - currTime.getTime()) /1000);

    if(secondsLeft <= 0){
        birthday(); // should change the visuals
        return {days: 0, hours: 0, minutes: 0, seconds: 0};
    }

    const days = Math.floor(secondsLeft / DAY);
    secondsLeft %= DAY;
    const hours = Math.floor(secondsLeft / HOUR);
    secondsLeft %= HOUR;
    const minutes = Math.floor(secondsLeft / MINUTE);
    secondsLeft %= MINUTE;
    const seconds = secondsLeft;

    return {days, hours, minutes, seconds};
}

async function showConfetti() {
    await loadSlim(tsParticles);
    await tsParticles.load({
        id: "tsparticles",
        options: {
            background: {
                color: "transparent"
            },
            particles: {
                color: {
                    value: ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"]
                },
                move: {
                    enable: true,
                    speed: 10,
                    direction: "bottom",
                    gravity: {
                        enable: true,
                        acceleration: 10
                    }
                },
                number: {
                    value: 300
                },
                size: {
                    value: { min: 5, max: 20 }
                },
                shape: {
                    type: ["circle", "square", "triangle"]
                }
            }
        }
    });
}
async function initParticles() {
    await loadSlim(tsParticles);
    await tsParticles.load({
        id: "tsparticles",
        options: {
            background: {
                color: "transparent"
            },
            particles: {
                color: {
                    value: ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#ffeaa7"]
                },
                move: {
                    enable: true,
                    speed: 1.5,
                    direction: "top"
                },
                number: {
                    value: 80
                },
                size: {
                    value: { min: 3, max: 8 }
                },
                shape: {
                    type: ["circle", "square", "triangle"]
                }
            }
        }
    });
}

async function init() {
    await initParticles();
    changeBackground(DELITA);
}

//when page loads
document.addEventListener("DOMContentLoaded", init);

let birthdayTriggered = false;

//local pad helper bc im encountering errors with packages atm - TEMPORARY FIX
function pad2(value: number): string {
    return value < 10 ? `0${value}` : String(value);
}

setInterval(() => {
    const { days, hours, minutes, seconds } = calculate();

    // Update display
    document.getElementById("days")!.textContent = pad2(days);
    document.getElementById("hours")!.textContent = pad2(hours);
    document.getElementById("minutes")!.textContent = pad2(minutes);
    document.getElementById("seconds")!.textContent = pad2(seconds);

    // Check if birthday arrived (only trigger once)
    if (days === 0 && hours === 0 && minutes === 0 && seconds === 0 && !birthdayTriggered) {
        birthdayTriggered = true;
        birthday();
    }
}, 1000);
