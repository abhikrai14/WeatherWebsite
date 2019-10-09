
var $ = function (id) 
{ 
    return document.getElementById(id); 
};

function btn_click()
{
    if (window.XMLHttpRequest) 
    {
        xhttp = new XMLHttpRequest();
    } 
    else
    {
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
       
    xhttp.onreadystatechange = function() 
    {
        if (this.readyState == 4 && this.status == 200) 
        {
		    //call function on successful connection
            get_weather(this);
        }
        };
    
    var e = $("city-dropdown");
	//get selected option's value and text 
    var id = e.options[e.selectedIndex].value;
    var text = e.options[e.selectedIndex].text;
    
	//send AJAX request to openweathermap along with city ID 
    var url = "https://api.openweathermap.org/data/2.5/forecast?id="+id+
	"&mode=xml&&units=metric&cnt=12&appid=50350850ca68fe83d96c30ab18c6fb66"; 
    xhttp.open("GET", url, true);
    xhttp.send();
}



//month


var month_name = function(dt)
{
    mlist = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
    return mlist[dt.getMonth()];
};


function get_weather(xmlhttp)
{
    var content = ""
    var firstcont = ""; 
 
	//creating content
    content = "<ul class='carousel-indicators mb-0 pb-0'>";
    content += "<li id='l1' data-target='#demo' data-slide-to='0' class='active' ></li>";
    content += "<li id='l2'data-target='#demo' data-slide-to='1' </li>"
    content += "<li id='l3' data-target='#demo' data-slide-to='2' </li>";
    content += "<li id='l4' data-target='#demo' data-slide-to='3'> </li></ul>";
    content += " <div class='carousel-inner no-padding my-5'>";
    
    //getting xml response
    var xml = xmlhttp.responseXML;
    console.log(xml);
    
	//extracting data from XML
    var city = xml.getElementsByTagName("name")[0].firstChild.nodeValue;
    var country = xml.getElementsByTagName("country")[0].firstChild.nodeValue;
    var location = xml.getElementsByTagName("location")[1];
    var lat = location.getAttribute('latitude');
    var long = location.getAttribute('longitude');
    var times = xml.getElementsByTagName('time');
    
	//array to store all weather data
    var time_array = [];
    var temp_array = []; var humi_array = []; var pres_array = []; var wind_array = []; var prcp_array = []; var climate_array = [];
    
	//for loop to traverse through all tags as 'time' 
    for (i = 0; i < times.length; i++) 
    {      
        if(i==0)
        {
		  //initialize carousel 
            content += "<div class='carousel-item active'><div class='row'>";        
        }
        else if(i==3 || i==6 || i==9 ) 
        {
		    //new carousel for each group of 3 weather cards
            content += "<div class='carousel-item'><div class='row'>";       
        }
        
        /*Getting data from xml*/
		var from = times[i].getAttribute('from');
        var to = times[i].getAttribute('to');
        var ufrom = from.split("T");
        var uto = to.split("T");
        var date_1 = ufrom[0].split("-");
        var time_1 = ufrom[1].split(":");
        var time_2 = uto[1].split(":");
        time_array.push(time_1[0] + ":00");
        var symbol =  xml.getElementsByTagName("symbol")[i];
        var weather_id = symbol.getAttribute('number');
        var weather_name = symbol.getAttribute('name');
        var weather_image = "http://openweathermap.org/img/w/" + symbol.getAttribute('var') + ".png";
        var prec =  xml.getElementsByTagName("precipitation")[i];
        var precvalue = prec.getAttribute('value');
        var prectype = prec.getAttribute('type');
        var wind =  xml.getElementsByTagName("windSpeed")[i];
        var windspeed = wind.getAttribute('mps');
        var press =  xml.getElementsByTagName("pressure")[i];
        var pressure = press.getAttribute('value');
        var humid =  xml.getElementsByTagName("humidity")[i];
        var humidity = humid.getAttribute('value');
        var cl =  xml.getElementsByTagName("clouds")[i];
        var cloud = cl.getAttribute('value');
        var temp =  xml.getElementsByTagName("temperature")[i];
        var mintemp = temp.getAttribute('min');
        var maxtemp = temp.getAttribute('max');
        var curtemp = temp.getAttribute('value');
        
        //Insert climate's attributes to array  
        temp_array.push(curtemp);
        wind_array.push(windspeed);
        pres_array.push(pressure);
        humi_array.push(humidity);
        prcp_array.push(precvalue);
        climate_array.push(weather_name);
        
        //DOM Manipulation
        content += "<div class='col-md-6 col-lg-4'>";
        
        var weather_card = "";
        //create weather card based on weather condition codes
		
		//If condition code suggests thunderstorm
        if(weather_id.startsWith("2"))
        {
            weather_card += "<div class='weather-card thunder'>"; 
			weather_card += "<div class='icon thunder'>";
			weather_card +=  "<div class='cloud'></div>";
			weather_card +=  "<div class='lightning'>";
			weather_card +=  "<div class='bolt'></div>";
			weather_card +=  "<div class='bolt'></div></div>";
        }
		
		//If condition code suggests drizzle or light rain
        else if(weather_id.startsWith("3") || weather_id == 500)
        { 
            weather_card +=  "<div class='weather-card sun-shower'>"; 
			weather_card += "<div class='icon sun-shower'>";
			weather_card += "<div class='cloud'></div>";
			weather_card += "<div class='sun'>";
			weather_card += "<div class='ray'></div></div>";
			weather_card += "<div class='rain'></div>";  
        }
        
       //If condition code suggests heavy rain
        else if(weather_id > 500 && weather_id.startsWith("5"))
        {
			weather_card += "<div class='weather-card rainy'>"; 
			weather_card += "<div class='icon rainy'>";
			weather_card += "<div class='cloud'></div>";
			weather_card += "<div class='rain'></div>";
        }
        
		//If condition code suggests clouds
        else if( weather_id.startsWith("8"))
        {
			weather_card += "<div class='weather-card cloudy'>"; 
			weather_card += "<div class='icon cloudy'>";
			weather_card += "<div class='cloud'></div>"; 
        }
        
        //If condition code suggests snow
        else if(weather_id.startsWith("6"))
        {
			weather_card +=  "<div class='weather-card snowy'>";
			weather_card += "<div class='icon snowy'>";
			weather_card += "<div class='cloud'></div>";
			weather_card += "<div class='snow'>";
			weather_card += "<div class='flake'></div>";
			weather_card += "<div class='flake'></div></div>";  
        }
        
		//If condition code suggests sunny
        else
        {
            weather_card =  "<div class='weather-card sunny'>";
            weather_card += "<div class='icon sunny'>";
            weather_card += "<div class='sun'>";
            weather_card += "<div class='rays'></div></div>";  
        }
        
		//get month from date
        var month = month_name(new Date(ufrom[0]));  
       
        //now put the weather content in the created weather card
        content += weather_card ;
        content += " <div class='date-bar'> " + date_1[2] +"&nbsp" + month+" </div>";
        content += "<div class='time-bar'>" +time_1[0]+ "&nbsp-&nbsp"+ time_2[0]+"</div>";
        content += "<div class='temp-min'><p>Min : " + mintemp + "ºC<br>Max : " + maxtemp + "ºC</p></div>";
		content += "<div class='other-info'>Wind Speed - " + windspeed + "<br>        Pressure - " + pressure + "<br>  Humidity - " + humidity + "%</div>";
		content += "</div>";
        content += "<h1>"+ curtemp+"º  </h1>";
        content += "<p><b>" + city + "</b>, " + country + "<br>";
        content += " <div class='sky'>" + weather_name +"</div>";
        content += " <div class='wepic'><img src = '" + weather_image + "'</div></div></div></div>";
        
		//Close div for each 3 set in carousel 
        if(i==2 || i==5 || i==8 || i==11 ) 
        {
			content += "</div></div>";            
        }
    }
    
    /*Making Charts*/
    $('charts-div').style.display = "block";
    $('chartsection').innerHTML = "<div id='ftitle'>Statistical Analysis - '" + city +"'</div>";
        
   /*Clear previous graph*/
    $("line-Chart").remove();$("bar-Chart").remove();
    $("line-cont").innerHTML = '<canvas id="line-Chart" class="chcanvas material" ></canvas>';
    $("bar-cont").innerHTML =  '<canvas id="bar-Chart" class="chcanvas2  material" ></canvas>';
    
	/* LINE GRAPH*/     
    var ctx = $('line-Chart').getContext('2d');
	linechart  = new Chart(ctx, 
    {
	   type: 'line',
	   data: 
        {
            labels: time_array,
            datasets:
            [{ 
                data: temp_array,
                label: "Tempearture(°C)",
                borderColor: "red",
                fill: true
            }, 
            { 
                data: wind_array,
                label: "WindSpeed(mps)",
                borderColor: "darkorange",
                fill: false
            }]
	   },
	   options: 
       {
           responsive: false, 
		   maintainAspectRatio: false,
		   title: 
           {
		      display: true,
		      text: 'Analysis for the day'
           }
	   }
	});
   
    /* BAR GRAPH*/   
    var ctx = $('bar-Chart').getContext('2d');
    barchart = new Chart(ctx, 
    {
        type: 'bar',
	
        // The data for our dataset
        data: 
        {
            labels: time_array,
            datasets: 
            [{
                label: "Precipitation",
                backgroundColor: "yellow",
                data: prcp_array,
            }]
        },

        // Configuration options go here
        options: {responsive: false, 
	   maintainAspectRatio: false}
	});
    
   var a = [], b = [], prev;
    //traverse climate_array to get unique climate conditions i.e. a[] and number of occurances of conditions i.e. b[]
	for ( var i = 0; i < climate_array.length; i++ ) 
    {
        climate_array.sort();
        if ( climate_array[i] !== prev ) 
        {
            a.push(climate_array[i]);
            b.push(1);
        } else 
        {
            b[b.length-1]++;
        }
        prev = climate_array[i];
    }
    for(var k=0;k<b.length;k++)
    {
        b[k] = Math.round(((b[k] / 12) * 100) * 100)/100;
    }
    
    /*Filling Contents*/
    content += "</div>";
    content += "<a class='carousel-control-prev' href='#demo' data-slide='prev'>";
    content +="<span class='carousel-control-prev-icon sp'></span></a>";
	content += "<a class='carousel-control-next' href='#demo' data-slide='next'>";
    content +="<span class='carousel-control-next-icon sp'></span></a>";
   
   //finally, giving all the element to div in HTML   
    $('demo').innerHTML = content; 
    
    //active carousel and moving slides
    $('l1').onclick = function()
    {  
         $('l1').classList.add("active");
         $('l2').classList.remove("active");
         $('l3').classList.remove("active");
         $('l4').classList.remove("active");
    };
    
    $('l2').onclick = function()
    {     
         $('l2').classList.add("active");
         $('l1').classList.remove("active");
         $('l3').classList.remove("active");
         $('l4').classList.remove("active");
    };
    
    $('l3').onclick = function()
    {      
         $('l3').classList.add("active");
         $('l2').classList.remove("active");
         $('l1').classList.remove("active");
         $('l4').classList.remove("active");
    };
    
    $('l4').onclick = function()
    {      
         $('l4').classList.add("active");
         $('l2').classList.remove("active");
         $('l3').classList.remove("active");
         $('l1').classList.remove("active");
    };
}

//Searchbox 
window.onload = function () 
{
    /*Chart Variables*/  
    //assign btn_click() function to search button 
    $("btn_search").onclick = btn_click;    
    $("city_name").focus();
    
    //getting the select element with id - 'city-dropdown' and saving it in variable 'dropdown'
    let dropdown = $("city-dropdown");

	//clearing the select & removing all options
    dropdown.length = 0;

	//creating first option as defaultOption element for select
    let defaultOption = document.createElement('option');
    defaultOption.text = 'Select your City';
    defaultOption.value = '3313472';
    
	//adding defaultOption to dropdown or select box
    dropdown.add(defaultOption);
    dropdown.selectedIndex = 0;

	//location of file where all cities are stored
    const url = 'js/city_list.json';
	
	//making AJAX request to this json file 
    const request = new XMLHttpRequest();
    request.open('GET', url, true);

    request.onload = function() 
    {
        if (request.status === 200) 
        {
		  //parsing the JSON data from response 
            const data = JSON.parse(request.responseText);
            let option;
    
		  //populating the selected box with options from the file and creating options of citys
          for (let i = 0; i < data.length; i++) 
            {
                option = document.createElement('option');
			    //assign attributes for option, city name as option & city ID as option value 
                option.text = data[i].name;
                option.value = data[i].id;
			    //adding option to dropdown
                dropdown.add(option);
            }
        }
    }
    request.onerror = function() 
    {
        console.error('An error occurred fetching the JSON from ' + url);
    };
    
	//send AJAX request
    request.send();
};
 
//If we enter something on textbox, change will be reflected on select box  
function searchSel() 
{
    var input=$('city_text').value.toUpperCase();
    var output=$('city-dropdown').options; 
    for(var i=0;i<output.length;i++) 
    {
      //if user entry matches a city in selectbox
      if(output[i].text.toUpperCase().indexOf(input)==0)
      {
        output[i].selected=true;
      }
      //if user entry doesn't match or if user doesnt enter anything then by default select first option i.e Athlone ID
      if($('city_text').value=='')
      {
        output[0].selected=true;
      }
  }
}


