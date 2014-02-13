/**
 * Automation controller
 */
(function(){
	HA.AutomationController = {
		init: function() {
			// Get home status 
			this.homeStatus = HA.ServerManager.getStatus();
			// Create the event handlers methods by default
			this.handlers = {
				lightHandler: function(e) {
					e.preventDefault();
					if ($(e.currentTarget).is(":checked")) {
						// activate light
						this.actions.switchLight("ON");
					} else {
						// deactivate the light
						this.actions.switchLight("OFF");
					}				
				},
				temperatureHandler: function(e) {
					e.preventDefault();
					var value = $(e.currentTarget).val();
					this.actions.setTemperature(parseFloat(value));
					$('#temperatureValue').text($(e.currentTarget).val());
				},
				curtainsHandler: function(e) {
					e.preventDefault();
					if ($(e.currentTarget).is(":checked")) {
						this.actions.toggleCurtains("OPEN");
					} else {
						this.actions.toggleCurtains("CLOSED");					
					}
				}
			};
			// Automation actions by default
			var self = this;
			this.actions = {
				// Modify the light status
				switchLight: function(lightStatus) {
					var opacity;
					if (lightStatus === "ON") {
						opacity = 0;
					} else {
						// check the current status of the curtains
						if (self.homeStatus.curtains === "OPEN") {
							opacity = 0.3;
						} else {
							opacity = 0.7;
						}	
					}
					// Animate the light 
					$('#lightContainer').animate({opacity: opacity}, 200);
					// Update the status
					self.homeStatus.light = lightStatus;
					HA.ServerManager.saveStatus(self.homeStatus);
				},
				// Modify the curtains status
				toggleCurtains: function(curtainsStatus) {
					if (curtainsStatus === "OPEN") {
						// Open curtains
						$('.curtain').animate({width: "30px"}, 200);
						$('#curtainsSeparator').animate({width: "460px"}, 200);
						// More or less light depending on the light status
						if (self.homeStatus.light === "OFF") {
							$('#lightContainer').animate({opacity: 0.3}, 200);
						}
					} else {
						// Close curtains
						$('.curtain').animate({width: "260px"}, 200);
						$('#curtainsSeparator').animate({width: "0"}, 200);
						// More or less light depending on the light status
						if (self.homeStatus.light === "OFF") {
							$('#lightContainer').animate({opacity: 0.7}, 200);
						}
					}
					self.homeStatus.curtains = curtainsStatus;
					HA.ServerManager.saveStatus(self.homeStatus);
				},
				// Modify the temperature status
				setTemperature: function(value) {
					if (value <= 20) {
						// cold
						$('#temperatureContainer').attr('class', 'temperature-container cold');
					} else if (value <= 23) {
						// warm
						$('#temperatureContainer').attr('class', 'temperature-container warm');
					} else if (value <= 26) {
						// hot
						$('#temperatureContainer').attr('class', 'temperature-container hot');
					} else {
						// very hot
						$('#temperatureContainer').attr('class', 'temperature-container very-hot');
					}
					self.homeStatus.temperature = value;
					HA.ServerManager.saveStatus(self.homeStatus);
				}
			}
		},
		// Add new item to the home automation
		addAutomationItem: function(inputId, handlerId, fn) {
			this.handlers[handlerId] = fn;
			var self = this;
			// Add the event handler when the DOM is ready
			$(document).ready(function() { $('#'+inputId).on('change', self.handlers[handlerId].bind(self)); });
		}
		
	};
	
	// Call to initialize the controller
	HA.AutomationController.init();
	// Bind jQuery event handlers only when the DOM is ready
	$(document).ready(function() {	
		// Attach event handlers
		$('#lightSwitch').on('change', HA.AutomationController.handlers.lightHandler.bind(HA.AutomationController));
		$('#temperatureRange').on('change', HA.AutomationController.handlers.temperatureHandler.bind(HA.AutomationController));
		$('#curtainsSwitch').on('change', HA.AutomationController.handlers.curtainsHandler.bind(HA.AutomationController));
	});
})();

/**************** How to extend the functionality ****************************
 * 1.- Add the input to the controls footer in index.html.Feel inspired by the 
 *     ones already added (See "YOUR CONTROL HERE" in the index.html file).
 * 2.- Add you graphical visualization wherever you want in index.html.
 *     (See "YOUR VISUALIZATION HERE" in index.html).
 * 3.- Add a call to the method HA.AutomationController.addAutomationItem with 
 *     the required parameters. Check the following example.
 * Feel free to add you own CSS in home-automation.css.
 * 
 * EXAMPLE OF USE
    var fn = function(e) { 
	    e.preventDefault();
		var value = parseFloat($(e.currentTarget).val());
		if (value <= 20) {
			// cold
			$('#temperatureContainer').attr('class', 'temperature-container cold');
		} else if (value <= 23) {
			// warm
			$('#temperatureContainer').attr('class', 'temperature-container warm');
		} else if (value <= 26) {
			// hot
			$('#temperatureContainer').attr('class', 'temperature-container hot');
		} else {
			// very hot
			$('#temperatureContainer').attr('class', 'temperature-container very-hot');
		}
		// Define the element to add in homeStatus, e.g. temperature for this example
		HA.AutomationController.homeStatus.temperature = value;
		HA.ServerManager.saveStatus(HA.AutomationController.homeStatus);
	};
	HA.AutomationController.addAutomationItem('temperatureRange', 'temperatureHandler', fn);
	
************************************************************************************/
