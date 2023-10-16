let firstRun = true;

const drumCat = {Head:undefined,Body:undefined,y:0, x:0}; // javascript Object.
const hairyCat = {y:0, x:0}; // javascript Object.
const vocalCat = {y:0, x:0}; // javascript Object.

// going to hijack the spectrum. Muhaahaahaa...
let fft = new p5.FFT();
const N = 12;          // 1/N octave bands. One Octave is a doubling in frequency.
const fCtr0 = 15.625; // Hz
let octavebands = fft.getOctaveBands(N, fCtr0);
const spectrumLines = []; 



// vocal, drum, bass, and other are volumes ranging from 0 to 100
function draw_one_frame(words, vocal, drum, bass, other, counter) {

  const stageFloorY = Math.floor(height/2);
  background(217, 50, 50);
  textFont('Helvetica'); // please use CSS safe fonts
  rectMode(CENTER)
  textSize(24);

  drumCat.x = Math.floor(width*1/5);
  vocalCat.x = Math.floor(width*2/5);
  hairyCat.x = Math.floor(width*4/5);

  if(counter == 0)
  {
    drumCat.y = 0;
    hairyCat.y = 0;
    vocalCat.y = 0;
  }

  if(firstRun)
  {
    drumCat.Head = loadImage("bulge cat.png");
    drumCat.Body = loadImage("bulge cat body.png");
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
  // plot from the back(oldest) and come foward to the current one so they overwrite.
  for (let s = spectrumLines.length-1 ; s >= 0 ; --s)
  {  
    plotSpectrumRow(s);
  }

   //***********************************************************/
   // draw the hairy cat - currently using the spectrum
   //************************************************************/

   let spectrum = fft.analyze();
   fill(42, 191, 245);
   stroke(42, 191, 245);
   
    for (let i = 0; i< spectrum.length; i++){
      let angle = map(i,0,spectrum.length,0,360); // hair angle
      let volume = spectrum[i];
      let radius = map(volume,0,256,20,50); // hair length
      
       
      let x = radius * Math.cos(angle*2);
      let y = radius * Math.sin(angle*2);

      let x0 = 10 * Math.cos(angle);
      let y0 = 10 * Math.sin(angle)*2;

      line(hairyCat.x+x0,stageFloorY+y0,hairyCat.x+x*2.5,stageFloorY+y*2.5);
  }
  stroke(0);
  fill(255);

  
 // ellipse(catX,catY,100,200);
  ellipse(hairyCat.x-20,stageFloorY-5,30);
  ellipse(hairyCat.x+20,stageFloorY-5,30);
  fill(42, 191, 245);
  
  
  //mouth
  arc(hairyCat.x,stageFloorY+20,60,40,0,180);



  //****************************************************/
  //Draw the drum cat
  //****************************************************/
  const debug = true;
  drumCat.y = 180;

  // Drop the cat after voclaCat has landed
  if( (counter > 0 && vocalCat.y >= stageFloorY) || debug )
  { 
    if (drumCat.y < stageFloorY)
    {
      drumCat.y++;
    }
  
// this is a non linear mapping. still goes from 0 to 100 but is scaled in log2
  let drumCatLogScale = Math.pow(map(drum,0, 100,1,Math.sqrt(100)),2);   

  (drum > 70) ? fill(255,0,0) : fill(42, 191, 245);
 // ellipse(drumCatX,catY, 100,drumCatHeadCrush);

 //body
  let squish = drumCatLogScale/2;
  image(drumCat.Head, drumCat.x-50-drumCatLogScale/2 , drumCat.y-90+squish/2,100+drumCatLogScale,190-squish); 
  image(drumCat.Body, drumCat.x-100, drumCat.y,200,200);

  //extra neck
  //noStroke();
  fill(0);
  //rect(catX/2+90.5,catY+50,48,180)
  fill(255);
  //eyes
  ellipse(drumCat.x+20+drumCatLogScale/10,drumCat.y,drumCatLogScale/2 + 20,15+drumCatLogScale/10);
  ellipse(drumCat.x-20-drumCatLogScale/10,drumCat.y,drumCatLogScale/2 + 20,15+drumCatLogScale/10);
  //eyes middle
  fill(0);
  ellipse(drumCat.x+20,drumCat.y,drumCatLogScale/4,12);
  ellipse(drumCat.x-20,drumCat.y,drumCatLogScale/4,12);
  
  stroke(255);
  //mouth
  arc(drumCat.x,drumCat.y+30,30 + drumCatLogScale/3 ,drumCatLogScale/2 ,0,180); 

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
  /* TODO bass-cat                                    */
  /****************************************************/


  
  /****************************************************/
  /* TODO   other-cat                                 */
  /****************************************************/


}

  /************************************************/
  /*  plots a row of spectrum lines
  /*  shrinks the width, and increses the height
  /*  proportional to n 
  /************************************************/
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