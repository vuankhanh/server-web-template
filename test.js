// const sharp = require('sharp');

// // original image
// let originalImage = '/home/oldcolor/Desktop/1641954107788-ca-lat-IMG20210521114656.webp';

// // file name for cropped image
// let outputImage = '/home/oldcolor/Desktop/croppedImage.webp';

// async function aaaFunction(){
//     return await sharp(originalImage)
//     .resize({
//         width: 1000,
//         height: 1000
//     })
//     .webp()
//     .toFile(outputImage)
// }
// async function runLog(){
//     let a = await aaaFunction();
//     console.log(a);
// }

// runLog();

const fse = require('fs-extra');
const path = require('path');

async function testFunction(){
    let folder = "/home/oldcolor/Desktop/TestFolder/ChildFolderTest-3/www";

    getParentDirectory(folder);
}

testFunction();

function getParentDirectory(urlFile){
    let split = urlFile.split(path.sep);
    split.pop();
    let parent = split.join('/');
    removeEmptyFolder(parent);
}

function removeEmptyFolder(directory){
    try {
        let files = fse.readdirSync(directory);
        console.log(files);
        if(!files.length){
            fse.rmdirSync(directory);
        }
    } catch (error) {
        console.log(error);
        
    }
    
}