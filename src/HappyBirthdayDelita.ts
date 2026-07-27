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
        element.style.backgroundImage = DELITA;
    }

}
export interface Countdown{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

function countdown(){
    const today = new Date();
    const timeLeft = birthday.getTime() - today.getTime();
    console.log(timeLeft);
}

function calculate(): Countdown{
    const currTime = new Date();
    let secondsLeft = Math.floor(BIRTHDAY_DATE.getTime() - currTime.getTime() /1000);

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
    changeBackground(DELITA);
    //TODO: show confetti,
    const message = document.getElementById("birthday-message");
    if(message){
        message.textContent = "HAPPY BIRTHDAY DELOITTE!!!"
    }
}