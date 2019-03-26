var numEyeColour = document.getElementById("num-eye-colour");
var topTenSurnames = document.getElementById("top-ten-surnames");
var closestEiffelTower = document.getElementById("closest-eiffel-tower");
var closestEiffelDetails = document.getElementById("closest-details");
var avgAgeBlueEyes = document.getElementById("avg-age-blue-eyes");
var registeredBefore = document.getElementById("registered-before-date");

function init() {

 retrieveData(function(response) {
  // Parse JSON string into object
    var jsonArray = JSON.parse(response);
    numPeopleEyeColour(jsonArray, "green");
    tenMostCommonSurnames(jsonArray);
    avgAgeBlueEyedPeople(jsonArray);
    closestToEiffelTower(jsonArray);
    registeredBeforeDate(jsonArray, "2014-01-04T01:24:56 -01:00");
 });
}

//obtains JSON data from file through use of an XMLHttpRequest, and a callback function
function retrieveData(callback){
  var peopleJson = new XMLHttpRequest();
  peopleJson.overrideMimeType("application/json");
  peopleJson.open('GET', '../TravelTekTest/JSON/fakepeople.json', true);
  peopleJson.onreadystatechange = function(){
    if (peopleJson.readyState == 4 && peopleJson.status == "200"){
      callback(peopleJson.responseText);
    }
  };
  peopleJson.send();
}

/*loops through each element of the array of json objects and increments the num
value for every custmer whos records indicate that they have green eyes*/
function numPeopleEyeColour(jsonArray, colour){
  var num = 0;
  for(var i = 0; i<jsonArray.length; i++){
    if(jsonArray[i].eyeColor ==="green"){
      num++;
    }
  }
  numEyeColour.innerHTML= "The number of people with green eyes is - " + num;
}

/*Returns the top ten most common surnames by first obtaining all surnames, and then sorting them alphabetically
The number of Occurrences are then calculated through using the getOccurrences function which returns a
tuple array including each surname, and the number of Occurrences. This array is then sorted in order of highest
to lowest, ensuring the most commonly occurring surnames are at the start of the list. This list is spliced at
position 10 to return the top 10 occurring surnames*/
function tenMostCommonSurnames(jsonArray){
  var surnames = organise(jsonArray);

  //sets variable equal to tuple array of [(surname, occurrences),(surname, occurrences)]
  var mostCommon = getOccurrences(surnames);
  //sorts the tuple array by value, in reverse order (highest to lowest)
  mostCommon = mostCommon.sort(function(a,b){
    return b[1]-a[1];
  });
  //Splices tuple array to only include the top ten msot common surnames and their occurrences
  mostCommon = mostCommon.splice(0,10);

  //formats html for output to user
  var x="<ol>";
  for(var i = 0; i < mostCommon.length; i++){
    var list = mostCommon[i];
      x += "<li>"+list+"</li>";
  }
  x += "</ol>";
  topTenSurnames.innerHTML = "The top ten most common surnames are shown below in the format 'Surname, Number of Occurrences':\n " + x;
}

//this function simply organises the json data into an array of every last name
function organise(json){
  var surnames = [];
  for (var i = 0; i<json.length; i++){
    var x = json[i].name.last;
    surnames.push(x);
  }
  surnames = surnames.sort();
  return surnames;
}

//This function returns a tuple array in the format [(surname, occurrences), (surname, occurrences)]
function getOccurrences(surnames){
  var count = 0;
  var tupleArr =[];
  for (var i = 0; i < surnames.length; i++){
    if(surnames[i] === surnames[i+1]){
      count++;
    }else{
      count++;
      tupleArr.push([surnames[i],count]);
      count = 0;
    }
  }
  return tupleArr;
}



/*The latitude and longitude for the eiffel tower can remain constant, and the
lat and long values of each person will be retrieved from the json array. The
shortest distance variable will be used as a comparator for each individual in
the json array. The distance function will calculate and return the distance between
two lat and lon points in miles. If the distance between the current lat and long
values in the json array is shorter than the value stored in shortestDistance, it
will overwrite this value, and set the closestDetails array equal to a tuple of
first name, surname, age and address, ready for the next iteration.  */
function closestToEiffelTower(jsonArray){
  const eiffelLat = 48.8584;
  const eiffelLong = 2.2945;
  var personLat;
  var personLong;
  var shortestDistance;
  var closestDetails;
  for (var i = 0; i<jsonArray.length; i++){
    personLat = jsonArray[i].latitude;
    personLong = jsonArray[i].longitude;
    if (i===0){
      shortestDistance = distance(eiffelLat, eiffelLong, personLat, personLong, 'M');
    }else{
      if ((distance(eiffelLat, eiffelLong, personLat, personLong,'M')<shortestDistance)){
        shortestDistance = distance(eiffelLat, eiffelLong, personLat, personLong, 'M')
        closestDetails = [jsonArray[i].name.first, jsonArray[i].name.last, jsonArray[i].age, jsonArray[i].address];
      }
    }
  }
  //the code below formats the html output
    var x="";

    for(var i = 0; i < 4; i++){
      var list = closestDetails[i];
      switch(i){
        case 0:
          x += "<li> First Name - "+list+"</li>";
          break;
        case 1:
          x += "<li> Surname - "+list+"</li>";
          break;
        case 2:
          x += "<li> Age - "+list+"</li>";
          break;
        case 3:
          x += "<li> Address - "+list+"</li>";
          break;
        }
      }
  closestEiffelTower.innerHTML = "The closest distance to the Eiffel Tower is - " + shortestDistance + " Miles";
  closestEiffelDetails.innerHTML="This customers details are shown below: " + x;
}

/*This function takes in 2 points consisting of latitude and longitude and the unit
you wish to use (miles, KM, Nautical miles) and returns the distance between the
2 points in the provided unit */
function distance(lat1, lon1, lat2, lon2, unit) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
		if (unit=="N") { dist = dist * 0.8684 }
		return Math.round(dist);
	}
}

/* Each person in the jsonarray is checked for the eye colour property to
determine if they have blue eyes. If they do, their age will be added to the
sum variable, which will consist of a sum of each blue eyed individuals age.
The num variable is also incremented, so as to keep track of the number of
blue eyed individuals. The average will then be calculated by dividing the
sum of all blue eyed individuals ages, by the total number of people with blue
eyes i.e. sum/num. This value is then rounded to the nearest whole number for
convenience */
function avgAgeBlueEyedPeople(jsonArray){
  var num = 0;
  var sum = 0;
  var age = []
  for(var i = 0; i<jsonArray.length; i++){
    if(jsonArray[i].eyeColor ==="blue"){
      age[i] = jsonArray[i].age;
      sum += age[i];
      num++;
    }
  }
  var avgAge = Math.round((sum/num))
  avgAgeBlueEyes.innerHTML = "The average age of people with blue eyes is - " + avgAge;
}

/*This function will compare the registration dates of each customer in the json
array and will output a list of every person who registered before 4th January 2014.
Information displayed will include the first name, surname and the date they
registered on */
function registeredBeforeDate(jsonArray, cutoffDate){
  var validUser = []
  for (var i = 0; i<jsonArray.length; i++){
    if (jsonArray[i].registered < cutoffDate){

      validUser.push([jsonArray[i].name.first,jsonArray[i].name.last,jsonArray[i].registered]);
    }
  }
  console.log(validUser);
  x = "";
  for(var i = 0; i < validUser.length; i++){
      var list = validUser[i];
      x += "<li>"+list+"</li>";
  }

  registeredBefore.innerHTML="The names of people registered before 4th January 2014 are shown below: \n" + x;

}
