#include <WiFi.h>
#include <WiFiMulti.h>
// 文件系统
#include "FS.h"
#include "SPIFFS.h"
#include <U8g2lib.h>
#include <WiFiClient.h>
#include <WebServer.h>
#include <ESP32Servo.h>
#include <DHT.h>  //加载温湿度库
#include <DNSServer.h>
#include <PubSubClient.h>
// #include "AsyncUDP.h"

#include <WiFiUdp.h>

/*
    端口初始化
    -------------------------------------------------
*/
// u8g2 OLED库定义
#define SCL 22
#define SDA 21
#define FORMAT_SPIFFS_IF_FAILED true
int _servo = 19;
int _servo1 = 18;
/*
    对象创建
    -------------------------------------------------
*/
//AP模式定义
const char* ssid = "webcontrol";    //AP的SSID（WiFi名字）
const char* password = "12345678";  //AP的密码
//UDP定义远端IP
const char* remoteIp1 = "192.168.3.123";
const char* remoteIp2 = "192.168.3.223";
WiFiMulti wifiMulti;
// u8
U8G2_SSD1306_128X64_NONAME_F_SW_I2C u8g2(U8G2_R0, /*clock=*/SCL, /*data=*/SDA, /*reset=*/U8X8_PIN_NONE);
// web服务器
WebServer server(80);
// 舵机
Servo myservo;
Servo myservo1;
//温湿度定义
#define DHTPIN 0       // what digital pin we're connected to
#define DHTTYPE DHT11  // DHT 11
DHT dht(DHTPIN, DHTTYPE);
//DNS对象定义
const byte DNS_PORT = 53;  //DNS服务端口号，一般为53
DNSServer dnsServer;
//MQTT定义
const char* mqtt_server = "bemfa.com";                        //MQTT服务器IP
const int mqttPort = 9501;                                    //MQTT服务器端口
const char* ESP8266_ID = "75ee4e39450943889749e9924e3a982c";  //自定义ID
const char* ESP8266_user = "75ee4e39450943889";               //用户名
const char* ESP8266_password = "wulianwang";                  //密码
const char* ESP8266_pub = "banzi002";                         //发送主题（对方的订阅主题）
const char* ESP8266_sub = "banzi002";                         //订阅主题（对方的发送主题）
WiFiClient espClient;
PubSubClient client(espClient);  //定义客户端对象
//UDP定义
unsigned int localUdp = 1234;    //监听端口
unsigned int remoteUdp = 4321;   //发送端口
unsigned int remoteUdp1 = 4322;  //发送端口
char comPacket[255];
WiFiUDP Udp;
// AsyncUDP udp;
/*
    变量定义
    -------------------------------------------------
*/
// 板子灯
int ledB = 2;
// 红外人体检测
int hongDT = 12;
// 温湿度
float h;
float t;
long s;
// 串口接收数组
String comdata = " ";
// 状态标志位
bool oState = false;

void setup() {
  Serial.begin(115200);
  delay(10);
  //硬件初始化
  hardwareInit();
  //温湿度初始化
  // dht.begin();
  // WIFI 初始化
  wifiInitList();
  //UDP初始化
  // udpInit();
  if(Udp.begin(localUdp))
  Serial.println("udp begin!");
  // AP 初始化
   AP_init();
  // 文件系统初始化
  // fsInit();
  // oled 初始化
  oledInit();
  // 请求服务器
  serverRequest();
  //初始化MQTT客户端
  initMQTT();
  //连接到指定MQTT服务器，并订阅指定主题
  gotoMQTT();
}

void loop() {
  client.loop();//持续运行MQTT运行函数，完成接收数据和定时发送心跳包
  if (wifiMulti.run() != WL_CONNECTED) {
    Serial.println("WiFi not connected!");
    delay(1000);
  }
  server.handleClient();
  delay(2);  //allow the cpu to switch to other tasks
}

// 硬件初始化
void hardwareInit() {
  myservo.attach(_servo);
  myservo1.attach(_servo1);
  //人体检测pinMode(__,INPUT);
  pinMode(hongDT, INPUT);
  // 板灯
  pinMode(ledB, OUTPUT);
  digitalWrite(ledB, 1);
}


// wifi 初始化函数
void wifiInitList() {
  //  wifiMulti.addAP("lnet", "qiaokl123");
  wifiMulti.addAP("Tengda2.4G", "qwert123.");
  wifiMulti.addAP("打咕噜adc", "yamadei962464");
  wifiMulti.addAP("ChinaNet-LLL", "shvemHKU");
  // 等待以及判断 wifi 是否已经连接成功
  Serial.println("Connecting Wifi...");
  while (wifiMulti.run() != WL_CONNECTED) {
    delay(300);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.print("Connected to ");
  // 连接的WiFi名称
  Serial.println(WiFi.SSID());
  Serial.println("IP address: ");
  // 连接的WiFi ip 地址
  Serial.println(WiFi.localIP());
  // ip 地址转字符串
  String aa = WiFi.localIP().toString().c_str();
}

//AP 模式初始化
 void AP_init() {
   IPAddress softLocal(192, 168, 3, 6);    //IP地址，用以设置IP第4字段
   IPAddress softGateway(192, 168, 3, 6);  //IP网关，用以设置IP第3字段
   IPAddress softSubnet(255, 255, 255, 0);

   WiFi.mode(WIFI_AP_STA);  //设置为AP模式(热点)
   WiFi.softAPConfig(softLocal, softGateway, softSubnet);
   WiFi.softAP(ssid, password);
   //    IPAddress myIP = WiFi.soft APIP();
   IPAddress myIP = WiFi.softAPIP();  //用变量myIP接收AP当前的IP地址
   Serial.println(myIP);              //打印输出myIP的IP地址
   //DNS服务器解析地址
   //  dnsServer.setErrorReplyCode(DNSReplyCode::ServerFailure);
   // dnsServer.start(DNS_PORT, "www.me.com", softLocal);
}

// UDP 初始化函数
void udpInit() {
  // if(udp.connect(IPAddress(192, 168, 3, 6), localUdp)) {
  //   Serial.println("udp success");
  //   udp.broadcastTo("Anyone here?", 4321);
  // }else {
  //   Serial.println("udp failed");
  // }
}

//UDP发送函数
void sendBack(const char* buffer, int xx) {
  if (xx == 1) {
    Udp.beginPacket(remoteIp1, remoteUdp);  //配置远端ip地址和端口
  } else if (xx == 2) {
    Udp.beginPacket(remoteIp2, remoteUdp);
  }
  //  Udp.write(buffer); //把数据写入发送缓冲区
  Udp.print(buffer);
  Udp.endPacket();  //发送数据
}

// spiffs 文件系统连接
void fsInit() {
  if (!SPIFFS.begin(FORMAT_SPIFFS_IF_FAILED)) {
    Serial.println("SPIFFS Mount Failed.");
    return;
  }
  Serial.println("SPIFFS Started.");
}
// oled 屏初始化
void oledInit() {
  u8g2.begin();
  u8g2.setFont(u8g2_font_unifont_t_symbols);
  u8g2.firstPage();
  u8g2.enableUTF8Print();                   //enable UTF8
  u8g2.setFont(u8g2_font_wqy12_t_gb2312b);  //设置中文字符集
  do {
    u8g2.setCursor(0, 15);  //指定显示位置
    u8g2.print("WELCOME");  //使用print来显示字符串
    u8g2.setCursor(0, 30);  //指定显示位置
    u8g2.print("MASTER");   //使用print来显示字符串
  } while (u8g2.nextPage());
}

// oled 屏幕显示
void oledShow(String content) {
  do {
    u8g2.clearBuffer();
    u8g2.setCursor(0, 40);  //指定显示位置
    u8g2.print(content);    //使用print来显示字符串
  } while (u8g2.nextPage());
}

// server 初始化处理请求
void serverRequest() {
  server.begin();
  // 继电器
  server.on("/spswcontrol02", SPSWControl02);
  // 继电器
  server.on("/spswcontrol03", SPSWControl03);
  // 步进电机
  server.on("/spswcontrol12", SPSWControl12);
  // 步进电机
  server.on("/spswcontrol13", SPSWControl13);
  //--------模拟
  // 灯光
  server.on("/agswcontrol01", AGSWControl01);
  // 舵机云台
  server.on("/agswcontrol11", AGSWControl11);
  server.onNotFound(handleUserRequest);
}
//处理简单控制
//---------------------------------------------------------------------
//host
void SPSWControl01() {
  String name = server.arg("name");
  String hardwareId = server.arg("hardwareId");
  String hardwarePort = server.arg("hardwarePort");
  String instruction = server.arg("instruction");
  String mes = server.arg("message");
  Serial.println(mes);
  // url.urlcode = mes;
  // url.urldecode();

  // oledShow(url.strcode);
  //  配置端口
  int port = hardwarePort.toInt();
  pinMode(port, OUTPUT);

  if (instruction == "open") {
    digitalWrite(port, 1);
    if (digitalRead(port)) {
      oledShow("打开");
    }
  } else {
    digitalWrite(port, 0);
    if (!digitalRead(port)) {
      oledShow("关闭");
    }
  }
}
//slave1 继电器
void SPSWControl02() {
  String jsonStr = server.arg("jsonData");
  const char* aa = jsonStr.c_str();
  sendBack(aa, 1);
}
//slave1 步进电机
void SPSWControl12() {
  String jsonStr = server.arg("jsonData");
  const char* bb = jsonStr.c_str();
  sendBack(bb, 1);
}
//slave2 继电器
void SPSWControl03() {
  String jsonStr = server.arg("jsonData");
  Serial.println("SPSWControl03");
  const char* aa = jsonStr.c_str();
  sendBack(aa, 2);
}
//slave2 步进电机
void SPSWControl13() {
  String jsonStr = server.arg("jsonData");
  const char* aa = jsonStr.c_str();
  sendBack(aa, 2);
}
//处理模拟控制
//---------------------------------------------------------------------
//灯光控制
void AGSWControl01() {
  //  String name = server.arg("name");
  //  String hardwareId = server.arg("hardwareId");
  String hardwarePort = server.arg("hardwarePort");
  String instruction = server.arg("instruction");
  String mes = server.arg("message");
  //  配置端口
  int port = hardwarePort.toInt();
  Serial.print("port:");
  Serial.println(port);
  Serial.print("ins:");
  Serial.println(instruction);
  //灯光
  pinMode(port, OUTPUT);
  if (instruction == "pwm") {
    String pwm = server.arg("pwm");
    int pwmVal = pwm.toInt();                      // 将用户请求中的PWM数值转换为整数
    Serial.print("pwmVal : ");
    Serial.println(pwmVal);
    // pwmVal = map(pwmVal, 0, 100, 0, 1023);  // 用户请求数值为0-100，转为0-1023
    // Serial.print("pwmVal---map : ");
    // Serial.println(pwmVal);
    analogWrite(port, pwmVal);  // 实现PWM引脚设置
  } else if (instruction == "open") {
    analogWrite(port, 100);
    oledShow(mes + "灯已打开");
  } else if (instruction == "close") {
    analogWrite(port, 0);
    oledShow(mes + "灯已关闭");
  }
  server.send(200, "text/plain", "success");  //发送网页
}

// 舵机云台控制
void AGSWControl11() {
  String hardwarePort = server.arg("hardwarePort");
  String instruction = server.arg("instruction");
  String mes = server.arg("message");
  //  配置端口
  int port = hardwarePort.toInt();
  // myservo.attach(port);
  // myservo.write(pwmVal);
  if (instruction == "pwm") {
    String pwm = server.arg("pwm");
    int pwmVal = abs(pwm.toInt());
    pwmVal = map(pwmVal, 0, 100, 0, 180);
    if(port == 19) {
      myservo.write(pwmVal);
    }else {
      myservo1.write(pwmVal);
    }
    // myservo1.write(180 - y);
    oledShow(mes + "模拟控制舵机");
  } else if (instruction == "open") {
    if(port == 19) {
      myservo.write(90);
    }else {
      myservo1.write(90);
    }
    oledShow(mes + "舵机正常");
  } else if (instruction == "close") {
    if(port == 19) {
      myservo.write(180);
    }else {
      myservo1.write(180);
    }
    oledShow(mes + "舵机正常");
  }
  server.send(200, "text/plain", "success");  //发送网页
}
//MQTT部分开始
//-------------------------------------------------------------------------
void initMQTT()  //初始化MQTT设置
{
  //指定客户端要连接的MQTT服务器IP和端口
  client.setServer(mqtt_server, mqttPort);
  //绑定数据回调函数
  client.setCallback(callback);
}
void gotoMQTT()  //连接MQTT服务器
{
  //用while循环执行到连接MQTT成功
  while (!client.connected()) {
    Serial.println("连接MQTT服务器中");
    //连接MQTT服务器，提交ID，用户名，密码
    bool is = client.connect(ESP8266_ID, ESP8266_user, ESP8266_password);
    if (is) {
      Serial.println("连接MQTT服务器成功");
    } else {
      Serial.print("失败原因 ");
      Serial.print(client.state());
      delay(2000);
    }
  }
  client.subscribe(ESP8266_sub, 1);  //添加订阅
}
void callback(char* topic, byte* payload, unsigned int length)  //数据回调函数，监听数据接收
{
  Serial.print("消息来自订阅主题: ");
  Serial.println(topic);
  Serial.print("消息:");
  String data = "";
  for (int i = 0; i < length; i++) {
    data += (char)payload[i];
  }
  Serial.println(data);
  Serial.println();
  MQTT_Handler(data);  //把接收的数据，传入处理函数执行分析处理
}
void MQTT_Handler(String data)  //数据处理函数，执行对接收数据的分析处理
{
  if (data == "") {
    return;
  }
  if (data == "on") {
    digitalWrite(2, 1);
  } else if (data == "off") {
    digitalWrite(2, 0);
  }
}
//MQTT部分结束
//--------------------------------------------------------------------------

//温湿度模块
//---------------------------------------------------------------------
void huTemp() {
  s = millis();
  delay(500);
  readHT();
  Serial.println(millis() - s);
}
//读取温湿度数据
//---------------------------------------------------------------------
void readHT() {
  float read_h = dht.readHumidity();     //湿度
  float read_t = dht.readTemperature();  //温度
  // 检查是否有任何读取失败并提前退出（重试）。
  if (isnan(read_h) || isnan(read_t)) {
    Serial.println("数据有错误，这次不更新!");
    return;
  }
  h = read_h;
  t = read_t;
  Serial.print("湿度：");
  Serial.print(h);
  Serial.println("%");
  Serial.print("温度：");
  Serial.println(t);
  Serial.println("_____________________________________________");
  delay(800);
}
//传送温湿度数据
//---------------------------------------------------------------------
void transData() {
  String data_state = server.arg("data_trs");
  if (data_state == "1") {
    readHT();
    String data = String(h) + "|" + String(t);
    Serial.println(data);
    server.send(200, "text/plain", data);
  }
}

//处理用户浏览器的HTTP资源请求
//---------------------------------------------------------------------
void handleUserRequest() {
  // 获取用户请求资源(Request Resource）
  String reqResource = server.uri();
  Serial.print("reqResource: ");
  Serial.println(reqResource);
  // 判断是否获取
  bool fileReadOK = handleFileRead(reqResource);
  // 如果在SPIFFS无法找到用户访问的资源，则回复404 (Not Found)
  if (!fileReadOK) {
    server.send(404, "text/plain", "404 Not Found");
  }
}

//处理浏览器HTTP访问
//---------------------------------------------------------------------
bool handleFileRead(String resource) {
  if (resource.endsWith("/")) {  // 如果访问地址以"/"为结尾
    resource = "/index.html";    // 则将访问地址修改为/index.html便于SPIFFS访问
  }
  if (resource == "/user.json") {
    server.send(403, "text/html", "<h1>No Access</h1>");
  }
  String contentType = getContentType(resource);  // 获取文件类型
  if (SPIFFS.exists(resource)) {                  // 如果访问的文件可以在SPIFFS中找到
    File file = SPIFFS.open(resource, "r");       // 则尝试打开该文件
    server.streamFile(file, contentType);         // 并且将该文件返回给浏览器
    file.close();                                 // 并且关闭文件
    return true;                                  // 返回true
  }
  return false;  // 如果文件未找到，则返回false
}

// 获取文件类型
// ---------------------------------------------------------------------
String getContentType(String filename) {
  if (filename.endsWith(".htm")) return "text/html";
  else if (filename.endsWith(".html")) return "text/html";
  else if (filename.endsWith(".css")) return "text/css";
  else if (filename.endsWith(".js")) return "application/javascript";
  else if (filename.endsWith(".png")) return "image/png";
  else if (filename.endsWith(".gif")) return "image/gif";
  else if (filename.endsWith(".jpg")) return "image/jpeg";
  else if (filename.endsWith(".ico")) return "image/x-icon";
  else if (filename.endsWith(".xml")) return "text/xml";
  else if (filename.endsWith(".pdf")) return "application/x-pdf";
  else if (filename.endsWith(".zip")) return "application/x-zip";
  else if (filename.endsWith(".gz")) return "application/x-gzip";
  return "text/plain";
}