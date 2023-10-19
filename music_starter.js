let firstRun = true;

const drumCat = {Head:undefined,Body:undefined,y:0, x:0}; // javascript Object.
const hairyCat = {y:0, x:0}; // javascript Object.
const vocalCat = {y:0, x:0}; // javascript Object.
const pianoCat = {Piano:undefined,Arm:undefined,Tail:undefined, Cat:undefined, y:0, x:0};

// going to hijack the spectrum. Muhaahaahaa...
let fft = new p5.FFT();
const N = 12;          // 1/N octave bands. One Octave is a doubling in frequency.
const fCtr0 = 15.625; // Hz
let octavebands = fft.getOctaveBands(N, fCtr0);
const spectrumLines = []; 



// vocal, drum, bass, and other are volumes ranging from 0 to 100
function draw_one_frame(words, vocal, drum, bass, other, counter) {

  const stageFloorY = Math.floor(height * 2/3);
  background(71, 12, 247);
  textFont('Helvetica'); // please use CSS safe fonts
  rectMode(CENTER)
  textSize(24);

  drumCat.x = Math.floor(width*1/5);
  vocalCat.x = Math.floor(width*2/5);
  hairyCat.x = Math.floor(width*3/5);
  pianoCat.x = Math.floor(width*4/5);

  if(counter == 0)
  {
    drumCat.y = 0;
    hairyCat.y = 0;
    vocalCat.y = 0;
    pianoCat.y  = 0;
  }

  if(firstRun)
  {
    drumCat.Head = loadImage("assets/drumcat_head.png");
    drumCat.Body = loadImage("assets/drumcat_body.png");

    // piano cat
    pianoCat.Cat = loadImage("assets/piano cat.png");
    pianoCat.Arm = loadImage("assets/piano arm.png");
    pianoCat.Tail = loadImage("assets/piano tail.png");
  

    //singing cat
    pianoCat.Piano = loadImage("assets/piano.png");

    firstRun = false;
  }


   //***********************************************************/
   // draw the 'stage'
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

  plotStage();
  
 // for (let s = spectrumLines.length-1 ; s >= 0 ; --s)
 // for (let s = 0; s < spectrumLines.length ; ++s)
  {  
  {  
  //  plotSpectrumRowOriginal(s);
   
  }

   //***********************************************************/
   // draw the hairy cat - currently using the spectrum
   //************************************************************/

   hairyCat.y = stageFloorY;

   if (hairyCat.y < stageFloorY && drumCat.y >= stageFloorY)
   {
    hairyCat.y++;
   }

   fill(42, 191, 245);
   stroke(42, 191, 245);


   //draw initial body, use a load of ellipses

   ellipse(hairyCat.x-25,hairyCat.y-10,20,160);//ear
   ellipse(hairyCat.x+25,hairyCat.y-10,20,160);

   ellipse(hairyCat.x-35,hairyCat.y+10,25,130);
   ellipse(hairyCat.x+35,hairyCat.y+10,25,130);
   rect(hairyCat.x, hairyCat.y+35, 110, 80, 25);

   let spectrum = fft.analyze();
  
   
    for (let i = 0; i< spectrum.length; i++){
      let angle = map(i,0,spectrum.length,0,360); // hair angle
      let volume = spectrum[i];
      let radius = map(volume,0,256,20,40); // hair length
      
       
      let x = radius * Math.cos(angle*2);
      let y = radius * Math.sin(angle*2);

      let x0 = 10 * Math.cos(angle);
      let y0 = 10 * Math.sin(angle)*2;

      line(hairyCat.x+x0,hairyCat.y+y0,hairyCat.x + x*2.5,hairyCat.y + y*4);
  }
  stroke(0);
  fill(255);

  //draw eyes0
  ellipse(hairyCat.x-10,hairyCat.y-50,15,20);
  ellipse(hairyCat.x+10,hairyCat.y-50,15,20);
  fill(42, 191, 245);
  
  
  //mouth
  arc(hairyCat.x,hairyCat.y-35,30,20,0,180);



  //****************************************************/
  //Draw the drum cat
  //****************************************************/

 // drumCat.y = stageFloorY;
  // Drop the cat after voclaCat has landed
  if( (counter > 0 && vocalCat.y >= stageFloorY) )
  { 
    if (drumCat.y < stageFloorY)
    {
      drumCat.y++;
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
  // Draw Vocal Cat
  //********************************************************/
    
  fill(42, 191, 245);
  

  let vocalHeight = Math.pow(map(vocal,0, 100, 0, Math.sqrt(50)),2);

  // Drop the cat when the music starts
  if(counter > 0)
  { 
    if (vocalCat.y < stageFloorY)
    {
      vocalCat.y++;
    }

    ellipse(vocalCat.x, vocalCat.y, 100 );

  // draw vocal cat mouth 
  fill(0);
  rect(vocalCat.x,vocalCat.y+15,20,vocalHeight);

    // display "words"
    fill(255,255,0);
    textAlign(CENTER);
    textSize(vocal);
    text(words, vocalCat.x, vocalCat.y);

  }    
  
 


  /****************************************************/
  /* TODO bass-cat    = guitarCat                     */
  /****************************************************/


  
  /****************************************************/
  /* TODO   other-cat  = piano cat                    */
  /****************************************************/
  pianoCat.y = stageFloorY;

  let footTap = map(other, 50,100 , -20 , 20,true);
  image(pianoCat.Piano, pianoCat.x-230, pianoCat.y+50 - 0.1*other,400,150); 
  //image(pianoCat.Arm,pianoCat.x-335, pianoCat.y-210+ footTap,300,300);
  image(pianoCat.Cat,pianoCat.x-180, pianoCat.y-120+ footTap,250,200);
  image(pianoCat.Tail,pianoCat.x-450, pianoCat.y-350+ footTap,900,700+other*2);
}




function plotStage()
{
    for(let n = 0;n < 128;++n)
    {
      let margin = (1*n);
      let h = height-(2*n);
      stroke(128);
      strokeWeight(2);
      line(margin,h,width-margin,h);
  }
}

  

  function plotSpectrumRow(n)
  {
    
    const spectrum = spectrumLines[n];
    //console.debug(spectrum);
    const margin = (1*n);
    const h = height-(2*n);
    let energy = fft.getEnergy('bass','treble');
    stroke(0);
    strokeWeight(2);
    line(margin,h,width-margin,h);
    strokeWeight(1);
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
}