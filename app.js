const ffmetadata = require("ffmetadata");
const path = require('path'), fs=require('fs');
const chalk = require('chalk');

ffmetadata.setFfmpegPath('ffmpeg.exe');



const updateMetadata = async function(filename, artist, title){
  var data = {
    artist,
    title
  };
  await ffmetadata.write(filename, data, function(err) {
    if (err) console.error("Error writing metadata", err);
    else console.log(chalk.green(filename + " Meta written"));
  });
}

const readFile = async function(filename){
  const re = /(.*\\)(.*) - (.*)\.mp3$/i;
  ffmetadata.read(filename, function(err, data) {
    if (err) console.error("Error reading metadata", err);
    else {
      if(!data.artist){
        const found = filename.match(re);
        if(!!found){
          const artist = found[2];
          const title = found[3];
          updateMetadata(filename, artist, title);
        }else{
          console.log(chalk.red(filename+' cant resolve artist and title'));
        }
      }
    }
  });
}




  const startPath = 'music';
  if (!fs.existsSync(startPath)){
    console.log("no dir ",startPath);
    return;
  }
  const files=fs.readdirSync(startPath);

  for(var i=0;i<files.length;i++){
    var filename=path.join(startPath,files[i]);
    var stat = fs.lstatSync(filename);
    if (stat.isDirectory()){
        fromDir(filename,'.mp3'); //recurse
    }
    else if (filename.indexOf('.mp3')>=0) {
      readFile(filename);
    };
  };

