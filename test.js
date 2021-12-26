function randomChars(length){
    // var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomChars = 'ABC';
    var result = '';
    for ( var i = 0; i < length; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}

async function generateCode(){
    
    let randomChar;

    while(randomChar != 'C'){
        randomChar = randomChars(1);
    }
}

generateCode();