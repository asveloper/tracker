export default DateFromTimestamp = function(d){
  let date = new Date(d);
  let day = date.getDate(); //Date of the month: 2 in our example
  let month = date.getMonth() + 1; //Month of the Year: 0-based index, so 1 in our example
  let year = date.getFullYear(); //Year: 2013

  return day+"-"+month+"-"+year;
}

