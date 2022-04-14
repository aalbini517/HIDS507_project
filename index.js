<script>
  $(document).ready( function() {
	const username = "esacuser";
  const password = "foresaconly";
  
	$.ajax({
      	type: 'GET',
        async: false,
        dataType: 'JSON',
      	beforeSend: function(xhr) { 
        	xhr.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + password)); },
      	url: 'https://hypatia.esacinc.com/fhir/fhir/Patient/',
      	success: function(response){
        	var total = response.total;
          document.getElementById("total").value = total;
        	return total;
      	},
        error: function() {
        	alert('no total found');
        }
    	});

  console.log(document.getElementById("total").value);
  
	$("#enterName").click(function() {
  	let nameInt = $("#nameInput").val();
    let names = nameInt.split(" ", 2);
    console.log(document.getElementById("patient_id").innerHTML);
    if (names.length !== 2) {
    	alert('Please enter your first and last name seperated by one space.');
      return;
    }
    
    let firstName = names[0].charAt(0).toUpperCase() + names[0].slice(1).toLowerCase();
    let lastName = names[1].charAt(0).toUpperCase() + names[1].slice(1).toLowerCase();
    

    get_patient_id().then((patients) => {
    	//console.log(patients);
      for (i=0;i<patients.entry.length;i++) {
      let foundNames = patients.entry[i].resource.name;
      //console.log(foundNames);
      for (j=0;j<patients.entry[i].resource.name.length;j++) {
       if (firstName === patients.entry[i].resource.name[j].given[0].replace(/[0-9]/g, '') && (lastName === patients.entry[i].resource.name[j].family.replace(/[0-9]/g, ''))) {
          document.getElementById("patient_id").innerHTML = patients.entry[i].resource.id;
          return;
        }
      }
    }
    alert('patient does not exist');
    });            
    
  });
  
  async function get_patient_id() {
  	return new Promise((resolve, reject) => {
    	$.ajax({
      	type: 'GET',
      	beforeSend: function(xhr) { 
        	xhr.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + password)); },
      	url: 'https://hypatia.esacinc.com/fhir/fhir/Patient/?_count=' + document.getElementById("total").value,
      	success: function(data, textStatus, request){
        	//console.log(data);
        	resolve(data);
      	},
      	error: function(data, textStatus, request) {
        	alert("No patient id data found");
          reject(data);
        	}
    	});
     });
  }
});
</script>
