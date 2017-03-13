////////////////////////////////////////////////////
// upload - download the xml and creat a json obj //
////////////////////////////////////////////////////

/*********
*download*
**********/

function xmltojson(){
	//creat a new instance of the script
	var x2js = new X2JS();
	var xml;
	$.ajax({
	   url    : 'xml-rw.php',
	   data   : {read_xml : true},
     type   : 'get',
     async  : false,
	   success: function (data) {
	     xml = data;
	   },
	   error : function(resultat, statut, erreur){
				console.log(erreur);
     }
	});
	// return the entire glyph table
	var o = x2js.xml_str2json(xml);

	return o;
}


/*********
**upload**
**********/

function jsontoxml( o ){

	//creat a new instance of the script
	var x2js = new X2JS();
	var x = x2js.json2xml_str(o);

	//add the xml info that are dump on the downloading
	x = '<?xml version="1.0" encoding="UTF-8"?>' + x;
	$.post( "xml-rw.php", { write_xml : x });
	console.log("font uploaded");
}



////////////////////////////////////////////////////
//  creat a clean - readable obj for the datavis  //
////////////////////////////////////////////////////

function table( o ){
	//console.log(o);
	var ar = new Array();

	o.ttFont.glyf.TTGlyph.forEach(function(d,i){
		
		var l_id = i;
		var name = d._name;
		//loop'in'loop'in'loop gotta fetch them all
		if(d.contour != undefined){
			if ($.isArray(d.contour)){
				d.contour.forEach(function(d,i){
					//console.log(d);
					var c_id = i;
					d.pt.forEach(function(d,i){
						// creat the object on each loop
						//otherwise it will erase itself
						var j    = new Object();
						j.letter    = name;
						j.parentId  = l_id;
						j.contourId = c_id;
						j.pointId   = i;
						j.x         = d._x; 
						j.y         = d._y; 
						j.on        = d._on;
						ar.push(j);	
					});
				});
			}else{
				d.contour.pt.forEach(function(d,i){
					/**above**/
					var j    = new Object();
					j.letter    = name;
					j.parentId  = l_id;
					j.contourId = false;
					j.pointId   = i;
					j.x         = d._x;
					j.y         = d._y;
					j.on        = d._on;
					ar.push(j);	
				});
			}
					
		}
		
	});
	//return the array of object
	return ar;
}



////////////////////////////////////////////////////
//  other                                         //
////////////////////////////////////////////////////


// function to select the letters to display 
// false to display everything 
function filter( string , array ){
	var ar = new Array();

	if( string != false){
		var l = string.split("");

		array.forEach(function(d){
			if(l.indexOf(d.letter) != -1){  
			   ar.push(d);
			}
		});

	}else{
		ar = array;
	}

	return ar;
}

