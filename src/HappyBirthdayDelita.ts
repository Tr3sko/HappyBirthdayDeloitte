import { tsParticles } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

const BIRTHDAY_DATE = new Date("05.05.2017");
const DELITA = "Delita.jpg"
const BRITHDAY_DELITA = "SET PHOTO" //FIXME

const day = 1000 * 60 * 60 * 24;
const hour = day / 24;
const minute = hour / 60;
const second = 1000;

function changeBackground(path: string){
    const element = document.getElementById("element");
    element.style.backgroundImage = DELITA;

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
    const diff = BIRTHDAY_DATE.getTime() - currTime.getTime();

    if(diff <= 0){
        birthday(); // should change the visuals
        return {days: 0, hours: 0, minutes: 0, seconds: 0};
    }
    //else here
    //TODO: calculate time for each hour, min ETC
    const days = Math.floor(diff / day);
    const hours = Math.floor((diff % day) / hour);
    const minutes = Math.floor((diff % hour) / minute);
    const seconds = Math.floor((diff % minute) / second);
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