#include "DHT.h"
#include "config.h"
#include <ESP8266HTTPClient.h>

DHT dht(DHTPIN, DHTTYPE);

int oldTime = 0;

int statePin = LOW;
int THRESHOLD = 100;
byte val = 0;


void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200); Serial.println("");

}

void loop() {
  // put your main code here, to run repeatedly:
  if (millis() > oldTime + REQUEST_DELAY_COFFEE)
  {
//    boolean filledCoffeePot = checkCoffeeLevel();
    float coffeeTemperture = checkCoffeeTemperture();
    Serial.println("http://wot-drinks.herokuapp.com/drinks/" + String(coffeeTemperture));
    HTTPClient http;
    http.begin("http://wot-drinks.herokuapp.com/drinks/" + String(coffeeTemperture));
    http.GET();
    http.end();
    oldTime = millis();
  }  
}

float checkCoffeeTemperture()
{
  float t = dht.readTemperature();
  if (isnan(t)) {
    Serial.println("Failed to read from DHT sensor!");
    return 0;
  }
  return t;
}

//boolean checkCoffeeLevel()
//{
//  val = analogRead(PIEZOPIN);
//  Serial.println(val);
//
//  if (val >= THRESHOLD) {
//    statePin = !statePin;
//
//    return true;
//  }
//  return false;
//}

