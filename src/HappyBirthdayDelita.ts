import { tsParticles } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

const BIRTHDAY_DATE = new Date("05.05.2017");
const DELITA = "Delita.jpg"

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
        return {days: 0, hours: 0, minutes: 0, seconds: 0};
    }
    //else here
    //TODO: calculate time for each hour, min ETC
    return {days, hours, minutes, seconds};
}