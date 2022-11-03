const canvas = document.getElementById('canvas');
console.log(canvas);
const contexte = canvas.getContext('2d');
const img = new Image();
img.src = 'image/flappy-bird-pipe.png';
const img1 = new Image();
img1.src = 'image/floppy-bird.png';
const bird = new Image();
bird.src = 'image/oiseau.png';

let jouer = false;
const gravity = .5;
const speed = 5.2;
const size = [50, 50];
const jump = -11.5;
const cdixieme = (canvas.width/10);

//les poteaux
const pipeWidth = 78;
const pipeGap = 270;
const pipeLoc = () => (Math.random() * ((canvas.height - (pipeGap + pipeWidth))-
pipeWidth)) + pipeWidth;

let index = 0,
    meilleurScore = 0,
    scoreActuel = 0,
    pipes = [],
    flight,
    flyHeight;

const setup = () => {
    scoreActuel = 0;
    flight = jump;
    flyHeight = (canvas.height /2) - (size[1]/2);

    pipes = Array(3).fill().map((a,i) => [canvas.width + (i * (pipeGap+pipeWidth)),
    pipeLoc()]);
    console.log(pipes);
}

const render = () =>{
    index++;
    // fond en général
    contexte.drawImage(img,0,0,canvas.width,canvas.height,-((index * (speed / 2)) %
    canvas.width) + canvas.width,0,canvas.width,canvas.height);
    contexte.drawImage(img,0,0,canvas.width,canvas.height,-((index * (speed / 2)) %
    canvas.width),0,canvas.width,canvas.height);

    if(jouer){
        contexte.drawImage(bird,0,Math.floor( (index % 9)/3)*size[1],...size,cdixieme,
        flyHeight, ...size );
        flight += gravity;
        flyHeight = Math.min(flyHeight+flight,canvas.height-size[1]);
    }
    else {
        // oiseau
        contexte.drawImage(bird,0,Math.floor( (index % 9)/3)*size[1],...size,( (canvas.width /2 )
        - size[0]/2 ),flyHeight, ...size );
        flyHeight = (canvas.height / 2) - (size[1] / 2);

        contexte.fillText(`Meilleur score : ${meilleurScore}`,55,200);
        contexte.fillText('Cliquez pour jouer',55,350);
        contexte.font = "bold 30px courier";
    }
    //emplacement des poteaux
    if(jouer){
        pipes.map(pipe =>{
            pipe[0] -= speed;
            // le poteauu en haut
            contexte.drawImage(img,100,970-pipe[1],pipeWidth,pipe[1],pipe[0],0,
            pipeWidth,pipe[1]);
            //le poteau en bas
            contexte.drawImage(img,75 + pipeWidth,650,pipeWidth,canvas.height-pipe[1]+
            pipeGap,pipe[0],pipe[1]+pipeGap,pipeWidth,canvas.height-pipe[1]+
            pipeGap);
            
            //les score
            if(pipe[0] <= -pipeWidth){
                scoreActuel++;
                meilleurScore = Math.max(meilleurScore,scoreActuel);

                pipes = [...pipes.slice(1), [pipes[pipes.length-1][0]+pipeGap+
                pipeWidth,pipeLoc()]];
            }
            //la fin
            if([
                pipe[0] <= cdixieme + size[0],
                pipe[0] + pipeWidth >= cdixieme,
                pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + size[1]
            ].every(elem => elem)){
                jouer = false;
                setup();
            }
        })
    }

    document.getElementById('meilleurScore').innerHTML = `Best : ${meilleurScore}`;
    document.getElementById('scoreActuel').innerHTML = `score : ${scoreActuel}`;

    window.requestAnimationFrame(render);
}
setup();
img.onload= render;
document.addEventListener('click',() => jouer = true);
window.onclick = () => flight=jump;