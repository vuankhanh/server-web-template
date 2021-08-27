function discount(totalValue){
    try {
        if(
            isNaN(Math.sign(totalValue)) ||
            Math.sign(totalValue)<0
        ){
            return null;
        }else{
            if(totalValue >= 1000000){
                return Math.floor(totalValue-totalValue*10/100);
            }else{
                return totalValue;
            }
        }
    } catch (error) {
        return null;
    }
}

function shippingFee(totalValue, distance, shippingPartnerFee){
    try {
        if(
            isNaN(Math.sign(totalValue)) ||
            isNaN(Math.sign(distance)) ||
            isNaN(Math.sign(shippingPartnerFee)) ||
            Math.sign(totalValue)<0 ||
            Math.sign(distance)<0 ||
            Math.sign(shippingPartnerFee)<0
        ){
            return null;
        }else{
            if(distance <= 3){
                return 0;
            }else if(distance > 3 && distance <= 10){
                if(totalValue < 300000){
                    return shippingPartnerFee;
                }else if(totalValue >= 300000 && totalValue < 500000){
                    if(shippingPartnerFee < 30000){
                        return shippingPartnerFee;
                    }else{
                        return 30000;
                    }
                }else{
                    return 0;
                }
            }else if(distance > 10 && distance <= 20){
                if(totalValue < 500000){
                    return shippingPartnerFee;
                }else if(totalValue >= 500000 && totalValue < 1000000){
                    return Math.floor(shippingPartnerFee/2);
                }else{
                    return 0;
                }
            }else{
                return shippingPartnerFee;
            }
        }
    } catch (error) {
        return null;
    }
    
}

module.exports = {
    shippingFee,
    discount
}