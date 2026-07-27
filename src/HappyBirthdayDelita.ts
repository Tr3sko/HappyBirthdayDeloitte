import { tsParticles } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

const BIRTHDAY_DATE = new Date("05.05.2017");
const DELITA = "Delita.jpg"
const BRITHDAY_DELITA = "SET PHOTO" //FIXME

const DAY = 1000 * 60 * 60 * 24;
const HOUR = DAY / 24;
const MINUTE = HOUR / 60;
//const SECOND = 1000; //FIXME may not be needed

function changeBackground(path: string){
    const element = document.getElementById("element");
    if(element){
        element.style.backgroundImage = DELITA; //TODO: change path
        element.style.backgroundSize = "cover";
        element.style.backgroundPosition = "center";
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

//once the birthday has arrived, cosmetic effects will be initialized
function birthday(){
    changeBackground("BIRTHDAY PHOTO"); //fixme: once picture is found
    //TODO: show confetti,
    showConfetti();
    const message = document.getElementById("birthday-message");
    if(message){
        message.textContent = "HAPPY BIRTHDAY DELOITTE!!!"
        message.style.display = "block"; //temporary display for testing - TODO: change this later
    }
}
//from tsParticles repo on github
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
//before birthday
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

setInterval(() => {
    const { days, hours, minutes, seconds } = getCountdown();

    // Simple update - assumes you have elements with these IDs
    document.getElementById("days")!.textContent = String(days).padStart(2, '0');
    document.getElementById("hours")!.textContent = String(hours).padStart(2, '0');
    document.getElementById("minutes")!.textContent = String(minutes).padStart(2, '0');
    document.getElementById("seconds")!.textContent = String(seconds).padStart(2, '0');

    // Check if birthday arrived
    if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
        // Trigger birthday effects
        document.getElementById("birthday-message")!.style.display = "block";
        // Change background, show confetti, etc.
    }
}, 1000);