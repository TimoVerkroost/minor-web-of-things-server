#include <OpenWiFi.h>

#include <ESP8266HTTPClient.h>
#include <Servo.h>
#include <ESP8266WiFi.h>
#include <WiFiManager.h>
#include "DHT.h"
#include <Adafruit_NeoPixel.h>

#include "config.h"

DHT dht(DHTPIN, DHTTYPE);
Adafruit_NeoPixel strip = Adafruit_NeoPixel(LED_COUNT, LED_PIN, NEO_GRB + NEO_KHZ400);
int oldTime = 0;
int oscillationTime = 500;
String chipID;
String serverURL = SERVER_URL;
int fakeTemp = 20;
OpenWiFi hotspot;

void printDebugMessage(String message) {
#ifdef DEBUG_MODE
  Serial.println(String(PROJECT_SHORT_NAME) + ": " + message);
#endif
}

void setup()
{

  Serial.begin(115200); Serial.println("");


  WiFiManager wifiManager;
  int counter = 0;

  hotspot.begin(BACKUP_SSID, BACKUP_PASSWORD);

  chipID = generateChipID();
  printDebugMessage(String("Last 2 bytes of chip ID: ") + chipID);
  String configSSID = String(CONFIG_SSID) + "_" + chipID;

  wifiManager.autoConnect(configSSID.c_str());

  strip.begin();
  strip.show(); // Initialize all pixels to 'off'
}

void loop()
{
//  When the current milliseconds of the nodeMCU running is higher then the [oldTime] +
// The delay in milliseconds for checking the coffee, the script will check
// the current coffee temperture. If the temperture is higher or equal to 55 it will send a mesage.
  if (millis() > oldTime + REQUEST_DELAY_COFFEE)
  {
    float coffeeTemperture = getCoffeeTemperture();
    fakeTemp++;    
    if (fakeTemp >= 55) {
      coffeeIsReady();
    }
    oldTime = millis();
  }
}
// Call Express API To show that the coffee is ready on the website.
void sendToCoffeeReadyToExpress() {
  HTTPClient http;    
  http.begin("http://wot-drinks.herokuapp.com/temp/");
  uint16_t httpCode = http.GET();  
  http.end();  
}

// 5 minutes after the Coffee is above 55 degrees celcius the LED strip will
// show the color HotPink. There will be a 10 minutes delay and then the led 
// will show the current color again of the coffee temperture. 
void coffeeIsReady() {
  delay(10000); //change to 300000
  colorWipe(strip.Color(255, 10, 180), 50);
  sendToCoffeeReadyToExpress();
  delay(20000); //change to 600000
  fakeTemp = 20; // Reset fake temperture
}

float getCoffeeTemperture()
// Get current temperture and humidity from DHT module. Display the current
// temperture with leds on the led strip.
{
//  float t = dht.readTemperature();
  float t = fakeTemp;
  float h = dht.readHumidity();
  if (isnan(t)) {
    Serial.println("Failed to read from DHT sensor!");
    return 0;
  }
  Serial.println(String(millis())+","+String(t)+","+String(h));
  if (t >= 50.00){
    colorWipe(strip.Color(255, 0, 0), 50);
  } else if (t >= 40.00){
    colorWipe(strip.Color(255, 100, 0), 50);
  } else if (t >= 30.00) {
    colorWipe(strip.Color(255, 255, 0), 50);
  } else if (t >= 25.00) {
    colorWipe(strip.Color(100, 255, 0), 50);
  } else {
    colorWipe(strip.Color(255, 255, 255), 50);
  }
  return t;
}

void colorWipe(uint32_t c, uint8_t wait) {
  for(uint16_t i=0; i<strip.numPixels(); i++) {
    strip.setPixelColor(i, c);
    strip.show();
    delay(wait);
  }
}
void requestMessage()
{
  HTTPClient http;
  String requestString = serverURL + "/api.php?t=gqi&d=" + chipID + "&v=2"; // look up api index, action is 
  http.begin(requestString);
  int httpCode = http.GET();
  
  if (httpCode == 200)
  {
    String response;
    response = http.getString();
  }
  else
  {
    ESP.reset();
  }

  http.end();
}

String generateChipID()
{
  String chipIDString = String(ESP.getChipId() & 0xffff, HEX);
  chipIDString.toUpperCase();
  while (chipIDString.length() < 4)
    chipIDString = String("0") + chipIDString;
  return chipIDString;
}


