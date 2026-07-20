import { tsParticles } from "@tsparticles/engine";

const birthday = new Date("05.05.2017");

function changeBackground(path: string){
    const element = document.getElementById("element");
    element.style.backgroundImage = `url('${Delita.jpg}')`;

}
export interface Countdown{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

class Timer {
    constructor(countdown : Countdown){
        let intervalId = setInterval(() => {
            this.counter = this.counter - 1;
            console.log(this.counter)
            if(this.counter === 0){
                //TODO: fix confetti and birthday cake
                clearInterval(intervalId);
                //TODO: changeBackground(path TIL Andre bilde);
            }
        })
    }
}