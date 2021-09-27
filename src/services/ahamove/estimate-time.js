function timeUntilOrderTime(){
  let today = new Date().getTime();
  let est = estimateTime();
  return Math.floor((est.orderTime.timeStamp - today)/1000)
}
  
function estimateTime(){
  let timeInWork = checkTimeInWorks();
  let todayOrderTime = new Date();

  todayOrderTime.setDate(todayOrderTime.getDate()+timeInWork.date);
  todayOrderTime.setHours(timeInWork.orderTime);

  let formatTodayOrderTime = dateFormat(todayOrderTime);

  let todayDeliveryToTime = new Date();
  todayDeliveryToTime.setDate(todayOrderTime.getDate());
  todayDeliveryToTime.setHours(todayOrderTime.getHours()+2);

  let formatTodatDeliveryToTime = dateFormat(todayDeliveryToTime);

  return {
    orderTime: formatTodayOrderTime,
    deliveryTo: formatTodatDeliveryToTime
  }
}
  
function checkTimeInWorks(){
  let today = new Date();

  let currentHr = today.getHours();
  if( currentHr >= 0 && currentHr < 8 ){
    return {
      timeInWork: false,
      date: 0,
      orderTime: 9
    };
  }else if(currentHr >= 8 && currentHr < 17){
    return {
      timeInWork: true,
      date: 0,
      orderTime: currentHr+1
    };
  }else if(currentHr >= 17 && currentHr < 24){
    return {
      timeInWork: false,
      date: 1,
      orderTime: 9,
    }
  }
}

function dateFormat(inputDate){
  let date = new Date(inputDate);
  let dd = String(date.getDate()).padStart(2, '0');
  let MM = String(date.getMonth()+1).padStart(2, '0');
  let yyyy = date.getFullYear();

  let ss = String(date.getSeconds()).padStart(2, '0');
  let mm = String(date.getMinutes()).padStart(2, '0');
  let hh = String(date.getHours()).padStart(2, '0');

  return {
    standard: dd+'/'+MM+'/'+yyyy+' '+hh+':'+mm+':'+ss,
    timeStamp: date.getTime(),
    original: yyyy+'-'+MM+'-'+dd+' '+hh+':'+mm+':'+ss
  }
}

module.exports = {
    timeUntilOrderTime,
    orderTime: estimateTime().orderTime,
    deliveryTo: estimateTime().deliveryTo,
}