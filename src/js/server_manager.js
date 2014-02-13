/**
 * It manages the actions for the "fake" communication with the server
 */
(function(){
	HA.ServerManager = {
		getStatus: function() {
			// get it from the server
			return { 
				light: "ON", // ["ON", "OFF"]
				temperature: 22.5, // [FLOAT] [18..30]
				curtains: "CLOSED", // ["OPEN", "CLOSED"]
			};
			// get it from the server
			/*$.ajax({
			  url: "getStatus.json",
			  data: {},
			  success: function(data, textStatus, jqXHR) {
		      	 return data;
			  },
			  error: function (jqXHR, textStatus, errorThrown) {

			  }
			});*/
		},
		saveStatus: function(status) {
			// send the request to save the status
			/*$.ajax({
			  url: "saveStatus",
			  type: "POST",
			  data: status,
			  success: function(data, textStatus, jqXHR) {
				  //data - response from server
			  },
			  error: function (jqXHR, textStatus, errorThrown) {

			  }
			});*/
		}
	};
	
})();