const sharp = require('sharp');

// original image
let originalImage = '/home/oldcolor/Desktop/Untitled-1.jpg';

// file name for cropped image
let outputImage = '/home/oldcolor/Desktop/croppedImage.webp';

let fileName = originalImage.substring(originalImage.lastIndexOf('/')+1);
let split = originalImage.substring(0, originalImage.lastIndexOf('.')+1)+'wedb';
console.log(split);

// async function aaaFunction(){
//     return await sharp(originalImage)
//     .resize({
//         width: 1280,
//         height: 720
//     })
//     .webp()
//     .toFile(outputImage)
// }
// async function runLog(){
//     let a = await aaaFunction();
//     console.log(a);
// }

// runLog();