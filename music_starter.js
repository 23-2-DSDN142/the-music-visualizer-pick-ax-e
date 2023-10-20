let firstRun = true;

const drumCat = {Head:undefined,Body:undefined,y:0, x:0,FinalX:0}; // javascript Object.
const hairyCat = {Body:undefined, y:0, x:0}; // javascript Object.
const pianoCat = {Piano:undefined, Arm:undefined,Tail:undefined, Cat:undefined, y:0, x:0};
const singingCat = {Body:undefined, y:0, x:0};
const guitarCat = {Body:undefined, PawBottem:undefined, PawTop:undefined, Guitar:undefined, Face:undefined, Arm:undefined,y:0, x:0};


// going to hijack the spectrum. Muhaahaahaa...
const fft = new p5.FFT();
const N = 12;          // 1/N octave bands. One Octave is a doubling in frequency.
const fCtr0 = 15.625; // Hz
const octavebands = fft.getOctaveBands(N, fCtr0);
const spectrumLines = []; 
let backgroundColor = [0, 0, 128];  


// vocal, drum, bass, and other are volumes ranging from 0 to 100
function draw_one_frame(words, vocal, drum, bass, other, counter) 
{

  const stageFloorY = Math.floor(height * 2/3);
  background(backgroundColor);
  textFont('Helvetica'); // please use CSS safe fonts
  rectMode(CENTER)
  textSize(24);

  drumCat.FinalX = Math.floor(width*1/6); // drumCat comes in from the left side
  guitarCat.x = Math.floor(width*2/6);
  hairyCat.x = Math.floor(width*3/6);
  pianoCat.x = Math.floor(width*4/6);
  singingCat.x = Math.floor(width*5/6);

  if(counter == 0)
  {
    drumCat.y = stageFloorY -30; // drumCat comes in from the left side
    drumCat.x = 0;
    hairyCat.y = 150;
    guitarCat.y = 400;
    pianoCat.y = 0;
    singingCat.y = 0;
  }

  if(firstRun)
  {
    // drum cat
    drumCat.Head = loadImage("assets/drumcat_head.png");
    drumCat.Body = loadImage("assets/drumcat_body.png~");

    // piano cat
    pianoCat.Cat = loadImage("assets/piano cat.png");
    pianoCat.Arm = loadImage("assets/piano arm.png");
    pianoCat.Tail = loadImage("assets/piano tail.png");
    pianoCat.Piano = loadImage("assets/piano.png");
  
    //singing cat
    singingCat.Body = loadImage("assets/singing cat_white.png");

    //Guitar cat
    
    guitarCat.Body =  loadImage("assets/guitar cat body.png");
    guitarCat.Guitar =  loadImage("assets/guitar.png");
    guitarCat.PawBottem =  loadImage("assets/guitar cat bottom paw.png");
    guitarCat.Arm =  loadImage("assets/guitar cat arm.png");
    guitarCat.PawTop =  loadImage("assets/guitar cat top paw.png");
  


    //hairyCat
    hairyCat.Body = loadImage("assets/singing cat.png");
    
    

    firstRun = false;
  }


  drawBackWall(counter);


  // this is a non linear mapping. still goes from 0 to 255 but uses a squared scale
  plotStage(
    [ 
      Math.floor(Math.pow(map(drum,0, 100,1,Math.sqrt(255)),2)),
      Math.floor(Math.pow(map(drum,0, 100,1,Math.sqrt(255)),2)),
      Math.floor(Math.pow(map(drum,0, 100,1,Math.sqrt(255)),2)),
    ]
    );



   //***********************************************************/
   // draw the hairy cat - currently using the spectrum
   //************************************************************/

   if (hairyCat.y < stageFloorY && drumCat.x == drumCat.FinalX)
   {
    hairyCat.y++;
   }

   fill(255);
   stroke(255);

   let spectrum = fft.analyze();
  
   
    for (let i = 0; i< spectrum.length; i++)
    {
      let angle = map(i,0,spectrum.length,0,360); // hair angle
      let volume = spectrum[i];
      let radius = map(volume,0,256,20,40); // hair length
      
       
      let x = radius * Math.cos(angle*2)*3;
      let y = radius * Math.sin(angle*2) + 100;

      let x0 = 5 * Math.cos(angle);
      let y0 = 5 * Math.sin(angle) + 100;

      line(hairyCat.x+x0,hairyCat.y+y0,hairyCat.x + x,hairyCat.y + y);
  }
 
  image(hairyCat.Body, hairyCat.x-140, hairyCat.y-120,300,300);

  //halo
  stroke(255);strokeWeight(3);noFill();
  ellipse(hairyCat.x-4, hairyCat.y-60,70,15);

  // mouth
  let treblePower = fft.getEnergy('treble');
  let vh = Math.pow(map(treblePower,0, 255, 0, Math.sqrt(100)),2);
  fill(0);
  rect(hairyCat.x-2,hairyCat.y+30,30,vh,10,10,10,10);

  fill(255); stroke(255);




  //****************************************************/
  //Draw the drum cat
  //****************************************************/

 // drumCat.y = stageFloorY;
  // Drop the cat after voclaCat has landed
  if( (counter > 0 && singingCat.y >= stageFloorY) )
  { 
    if (drumCat.x < drumCat.FinalX)
    {
      drumCat.x++;
    }
  
// this is a non linear mapping. still goes from 0 to 100 but is scaled in log2
  let drumCatLogScale = Math.pow(map(drum,0, 100,1,Math.sqrt(100)),2);   



 //body and Head
  let squish = drumCatLogScale/2;
  image(drumCat.Head, drumCat.x-50-drumCatLogScale/2 , drumCat.y-90+squish/2,100+drumCatLogScale,190-squish); 
  image(drumCat.Body, drumCat.x-100, drumCat.y-20,200,200);

  // tail for loud bits  
      stroke(0);
      strokeWeight(20);
      line(drumCat.x-60,drumCat.y+110, drumCat.x-80 - squish,drumCat.y+squish+60);

  strokeWeight(1);

  fill(255);
  //eyes
  ellipse(drumCat.x+20+drumCatLogScale/10,drumCat.y,drumCatLogScale/2 + 20,15+drumCatLogScale/10);
  ellipse(drumCat.x-20-drumCatLogScale/10,drumCat.y,drumCatLogScale/2 + 20,15+drumCatLogScale/10);
  //eyes middle
  fill(0);
  ellipse(drumCat.x+20,drumCat.y,drumCatLogScale/4,12);
  ellipse(drumCat.x-20,drumCat.y,drumCatLogScale/4,12);
  //Whiskers
  stroke(255);
  for(let i = 0;i < 3;++i)
  {
    line(drumCat.x+drumCatLogScale/2+20,drumCat.y+20+(2*i),drumCat.x+drumCatLogScale+40 -(4*i),drumCat.y + (5*i)+20 );
    line(drumCat.x-drumCatLogScale/2-20,drumCat.y+20+(2*i),drumCat.x-drumCatLogScale-40 +(4*i),drumCat.y + (5*i)+20 );
  }

  //mouth
  arc(drumCat.x,drumCat.y+30,30 + drumCatLogScale/3 ,drumCatLogScale/2 ,0,180); 

  // stick somethig that looks sort of like drums in front of the cat
  // bassdrum
  stroke('red'); fill('red');
  ellipse(drumCat.x+65, drumCat.y+140,90);
  stroke('black'); fill('white');
  ellipse(drumCat.x+75, drumCat.y+144,90);
  // Cymbal
  stroke('black'); fill('yellow');
  ellipse(drumCat.x+10, drumCat.y+100,100,10);
  stroke('white');strokeWeight(3);
  line(drumCat.x+10,drumCat.y+100, drumCat.x+20,drumCat.y+200);
  line(drumCat.x+10,drumCat.y+100, drumCat.x+0,drumCat.y+200);
  }

  //********************************************************/
  // Draw Singing Cat
  //********************************************************/
    
  fill(42, 191, 245);
  

  let vocalHeight = Math.pow(map(vocal,30, 100, 0, Math.sqrt(50)),2);

  // Drop the cat when the music starts
  if(counter > 0)
  { 
    if (singingCat.y < stageFloorY)
    {
      singingCat.y++;
    }
    image(singingCat.Body,singingCat.x-137,singingCat.y-100,300,300);
 
    // draw singing cat mouth 
    fill(0);
    rect(singingCat.x,singingCat.y+46,30,vocalHeight,10,10,10,10);

    // display "words"
    fill(255,255,0);
    textAlign(CENTER);
    textSize(vocal);
    text(words, singingCat.x, singingCat.y);

  }    
  

  /****************************************************/
  /* bass-cat    = guitarCat                     */
  /****************************************************/

  image(guitarCat.Body,guitarCat.x-200,guitarCat.y,400,400);

  push();
    
  translate(guitarCat.x+10, guitarCat.y+215)

  rotate( map(bass,0,100,-30,30));
  image(guitarCat.Guitar,-150,-200,300,300);
  image(guitarCat.PawTop,-205,-260,400,400);
 //image(guitarCat.Guitar,guitarCat.x-150,guitarCat.y+50,300,300);
  rect(0,0,10,20);
  pop();

  image(guitarCat.PawBottem,guitarCat.x-200,guitarCat.y,400,400);
  
  image(guitarCat.Arm,guitarCat.x-200,guitarCat.y,400,400);


    




  
  /****************************************************/
  /* other-cat  = piano cat                    */
  /****************************************************/
  pianoCat.y = stageFloorY;

  let footTap = map(other, 50,100 , -20 , 20,true);
  image(pianoCat.Piano, pianoCat.x-170, pianoCat.y - 0.1*other,330,150); 
  //image(pianoCat.Arm,pianoCat.x-335, pianoCat.y-210+ footTap,300,300);
  image(pianoCat.Cat,pianoCat.x-150, pianoCat.y-170+ footTap,250,200);
  image(pianoCat.Tail,pianoCat.x-430, pianoCat.y-400+ footTap,900,700+other*2);


  let prog = getDuration();
  stroke(255);fill(255);strokeWeight(1);
  textSize(10);
  text("Progress: " + Math.floor(prog.current) + " / " + Math.floor(prog.duration), width-100, 20 );

}


/************************************************************
 *  Helper functions
 ************************************************************/

function getDuration()
{

  if(song)
  {
    return {  
            relativepos:song.currentTime()/song.duration(), 
            current:song.currentTime(),
            duration:song.duration()
            };
  }
  else{
    return { 
            relativepos:0, 
            current:0, 
            duration:0
           }; 
  }
}



//edgecolorarray = [R,G,B]
function plotStage(edgecolorarray)
{
  
  const y = Math.floor(height * 4/5);

  stroke(255);fill(0);strokeWeight(0);
  ellipse(width/2,y+50,width,200);
  rect(width/2,y+25,width,50);
  fill(128);strokeWeight(5);
  if(edgecolorarray) {stroke(edgecolorarray)};  // colourise the stroke if a color array was supplied. 
  ellipse(width/2,y,width,200);
  strokeWeight(1);

}

  




  function plotSpectrumRow(n)
  {
     
    const spectrum = spectrumLines[n];
    const margin = (0);
    const h = height-(2*n)-150; //height-(2*n)-150;
    let energy = fft.getEnergy('bass','treble');
    
    // draw a thick  line the same color as the background
    stroke(backgroundColor);
    strokeWeight(2);
    line(margin,h,width-margin,h);
    
    strokeWeight(1);
    if(energy > 0){
      stroke(energy,255-energy,255-energy);


    noFill();
    //let lastpoint = {x:margin,y:h};
    beginShape();
   // vertex(0,h) ;
    vertex(margin,h) ;
    for (let i = 0; i < spectrum.length-8; i++)  
    {
       // let r = map(spectrum[i],0,255,0,255);
        let x = map(i, 0, spectrum.length-8, margin, width-margin);
        let y = map(spectrum[i], 0, 255, h, h-64);

        vertex(x,y) ;

       //stroke(r,255-r,0);
       //line(lastpoint.x,lastpoint.y,x,y) ;
       //lastpoint = {x,y};
    }
    vertex(width-margin,h) 
   // vertex(width,h) ;

    endShape();
    }
    else
      {
        // do nuthin.
      }
    
  }



  function drawBackWall(counter)
  {
    //***********************************************************/
    // draw the 'spectrum stage'
    //************************************************************/

    if(counter > 0) // counter is 0 when in editor mode
    {
      let x = fft.analyze(); // x = the raw values. I dont actually use it. As you have to call Analyse anyway I left it here for debug.
      let spectrum2 = fft.logAverages(octavebands);
      spectrumLines.push(spectrum2);
      
      if(spectrumLines.length > 128)
      {
        spectrumLines.shift();
      }

    }
    else
    {
      // build a flat stage.
      spectrumLines.length = 128;
      spectrumLines.fill(0); 
    }

    
    
    for (let s = spectrumLines.length-1 ; s >= 0 ; --s)
    {  
      plotSpectrumRow(s);
    }


  }
