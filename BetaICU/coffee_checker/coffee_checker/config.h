#ifndef _CONFIG_H
#define _CONFIG_H

#define DEBUG_MODE
#define LED_COUNT    8
#define LED_PIN     D2

#define FADEIN_DELAY 5
#define FADEOUT_DELAY 8

#define PROJECT_SHORT_NAME "ICU"
#define REQUEST_DELAY 2000

// Coffee Checker delay
#define REQUEST_DELAY_COFFEE 5000 //Change to 15000 (15seconds)

// Temperture module and slot
#define DHTPIN D3
#define DHTTYPE DHT11

//NEEDS TO BE CHANGED TO CURRENT SERVER!!!!
#define LOCAL_SERVER_URL "http://6096eb0f.ngrok.io"
#define SERVER_URL "http://oege.ie.hva.nl/~palr001/icu"
#define CONFIG_SSID "icu"

#define BACKUP_SSID "BackupSSIDName"
#define BACKUP_PASSWORD "BackupPassword"

#endif

