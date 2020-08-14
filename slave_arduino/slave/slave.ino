#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <SocketIoClient.h>
#include <string.h>
#include <ArduinoJson.h>
#include "fauxmoESP.h"

const char *ssid = "Pegoretti";
const char *password = "dda12345";

const char *socketServer = "carlospeg.kinghost.net";
const int socketPort = 21533;

SocketIoClient socket;
fauxmoESP fauxmo;

void togglePin(const char *payload, size_t length){
  DynamicJsonDocument doc(128);
  deserializeJson(doc, payload);
  digitalWrite(doc["pin"], doc["state"] ? HIGH : LOW);
  //delay(500);
}

void setup(){
  Serial.begin(115200);
  pinMode(4, OUTPUT);
    pinMode(5, OUTPUT);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(100);
    Serial.print(".");
  }

  Serial.print("Flash ID: ");
  Serial.println(ESP.getFlashChipId());

  fauxmo.addDevice("Aerador 1");
  fauxmo.addDevice("Aerador 2");
  
  fauxmo.setPort(80); // required for gen3 devices
  fauxmo.enable(true);
  
  fauxmo.onSetState([](unsigned char device_id, const char * device_name, bool state, unsigned char value) {
      digitalWrite(device_id == 1 ? 4 : 5, state ? HIGH : LOW);
      socket.emit("toggle", jsonJoin.c_str());
    });  

  socket.begin(socketServer, socketPort);     
  socket.on("pin", togglePin);
  DynamicJsonDocument doc(128);
  String jsonJoin = "\"{'board': { 'id': " + String(ESP.getFlashChipId()) + ", 'name': 'Placa 01'}, 'motors': [{'name': 'Aerador 01', 'pin': 4}, {'name': 'Aerador 02', 'pin': 5}]}\"";
  socket.emit("boardJoin", jsonJoin.c_str());
}

void loop(){
  socket.loop();
  fauxmo.handle();
}
