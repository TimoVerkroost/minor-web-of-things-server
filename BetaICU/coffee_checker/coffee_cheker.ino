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
  checkCoffeeTemperture();
}

void loop()
{
  if (millis() > oldTime + REQUEST_DELAY_COFFEE)
  {
    float coffeeTemperture = checkCoffeeTemperture();
    if (coffeeTemperture > 35) {
      sendToCoffeeReadyToExpress();
    }
    oldTime = millis();
  }
}

void sendToCoffeeReadyToExpress() {
  Serial.println("asdasd");
  HTTPClient http;
  http.begin("http://wot-drinks.herokuapp.com/temp/");
  http.GET();
  http.end();
}

float checkCoffeeTemperture()
{
  float t = dht.readTemperature();
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


