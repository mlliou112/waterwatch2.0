#include <CurieBLE.h>

/*
   This sketch example partially implements the standard Bluetooth Low-Energy Battery service.
   For more information: https://developer.bluetooth.org/gatt/services/Pages/ServicesHome.aspx
*/

/*  */
BLEPeripheral blePeripheral;                // BLE Peripheral Device (the board you're programming)
BLEService environmentService("181A");    // Enviro Service

//Enviro Charactersitics
BLECharacteristic windSpeed("2A73",  // standard 16-bit characteristic UUID
    BLERead | BLENotify, 2);     // remote clients will be able to
    // get notifications if this characteristic changes
    // actually sound
BLECharacteristic temperature("2A6E", BLERead | BLENotify, 2); // temp
BLECharacteristic elevation("2A6C", BLERead | BLENotify, 2); // actually light

int oldWindSpeed = 0;   // last blood pressure reading from analog input
int oldTemperature = 0;
int oldElevation = 0;
long previousMillis = 0;    // last time the blood pressure was checked, in ms

void setup() {
  Serial.begin(9600);       // initialize serial communication
  pinMode(13, OUTPUT);      // initialize the LED on pin 13 to indicate when a central is connected

  /* Set a local name for the BLE device
     This name will appear in advertising packets
     and can be used by remote devices to identify this BLE device
     The name can be changed but maybe be truncated based on space left in advertisement packet */
  blePeripheral.setLocalName("EnvironmentSensor");
  Serial.println(environmentService.uuid());
  blePeripheral.setAdvertisedServiceUuid(environmentService.uuid());  // add the service UUID
  blePeripheral.addAttribute(environmentService);   // Add the service
  blePeripheral.addAttribute(windSpeed); // add the characteristic
  blePeripheral.addAttribute(temperature); // add the characteristic
  blePeripheral.addAttribute(elevation); // add the characteristic
  
  
  const unsigned char charArray[2] = { 0, (unsigned char)0 };
  windSpeed.setValue(charArray, 2);   // initial value for this characteristic
  temperature.setValue(charArray, 2);   // initial value for this characteristic
  elevation.setValue(charArray, 2);   // initial value for this characteristic

  /* Now activate the BLE device.  It will start continuously transmitting BLE
     advertising packets and will be visible to remote BLE central devices
     until it receives a new connection */
  blePeripheral.begin();
  Serial.println("Bluetooth device active, waiting for connections...");
}

void loop() {
  // listen for BLE peripherals to connect:
  BLECentral central = blePeripheral.central();

  // if a central is connected to peripheral:
  if (central) {
    Serial.print("Connected to central: ");
    // print the central's MAC address:
    Serial.println(central.address());
    // turn on the LED to indicate the connection:
    digitalWrite(13, HIGH);

    // check the blood pressure mesurement every 200ms
    // as long as the central is still connected:
    while (central.connected()) {
      long currentMillis = millis();
      // if 2000ms have passed, check the sensors:
      if (currentMillis - previousMillis >= 2000) {
        previousMillis = currentMillis;
        updateWindSpeed();
        updateTemperature();
        updateElevation();
      }
    }
    // when the central disconnects, turn off the LED:
    digitalWrite(13, LOW);
    Serial.print("Disconnected from central: ");
    Serial.println(central.address());
  }
}
void updateTemperature() {
  int t = analogRead(A1);
  delay(5); // Online reported issues with reading multiple analog readings. This might calibrate.
  t = analogRead(A1);
  int temp = map(t, 0, 1023, 0, 100);

  if (temp != oldTemperature) {
    Serial.print("Current temperature is: ");
    Serial.println(temp);
    const unsigned char tempCharArray[2] = {0, (unsigned char) temp };
    temperature.setValue(tempCharArray, 2);
    oldTemperature = temp;
    }
  }

void updateElevation() {
  int e = analogRead(A2);
  delay(5);
  e = analogRead(A2);
  int elev = map(e, 0, 1023, 0, 100);
  if (elev != oldElevation) {
    Serial.print("Current elevation is: ");
    Serial.println(elev);
    const unsigned char elevCharArray[2] = {0, (unsigned char) elev };
    elevation.setValue(elevCharArray, 2);
    oldElevation = elev;
    }
  
  
  }
void updateWindSpeed() {

  int ws = analogRead(A0);
  delay(5);
  ws = analogRead(A0);
  int wind = map(ws, 0, 1023, 0, 100);


  if (wind != oldWindSpeed) {      
    Serial.print("Current wind speed: ");
    Serial.println(wind);
    const unsigned char windCharArray[2] = { 0, (unsigned char) wind };
    // Update the blood pressure measurement characteristic
    windSpeed.setValue(windCharArray, 2);
    // Save the measurement for next comparison  
    oldWindSpeed = wind;           
  }
}
