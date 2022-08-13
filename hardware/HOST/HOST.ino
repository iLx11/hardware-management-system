#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266WebServer.h>
#include <DNSServer.h>
#include <PubSubClient.h>
#include <U8g2lib.h>
#include <WiFiUdp.h>
#include <Wire.h>
#include <FS.h>
#include <Servo.h>                  //加载舵机库     
#include <ArduinoJson.h>//使用JSON-v5版的库
#include "DHT.h"        //加载温湿度库
//---------------------------------------------------------------------
//定义对象
const char *ssid = "webcontrol";             //AP的SSID（WiFi名字）
const char *password = "12345678";            //AP的密码
const char* mqtt_server = "bemfa.com";          //MQTT服务器IP
const int mqttPort = 9501;                            //MQTT服务器端口
const char *remoteIp1 = "192.168.3.123";
const char *remoteIp2 = "192.168.3.223";
Servo myservo;                      //定义一个舵机对象
Servo myservo2;
//温湿度定义
#define DHTPIN 0     // what digital pin we're connected to
#define DHTTYPE DHT11   // DHT 11
DHT dht(DHTPIN, DHTTYPE);

ESP8266WiFiMulti wifiMulti;     // 建立ESP8266WiFiMulti对象,对象名称是 'wifiMulti'
ESP8266WebServer esp8266_server(80);    // 建立网络服务器对象，该对象用于响应HTTP请求。监听端口（80）
const byte DNS_PORT = 53; //DNS服务端口号，一般为53
DNSServer dnsServer;

const char* ESP8266_ID = "75ee4e39450943889749e9924e3a982c";                 //自定义ID
const char* ESP8266_user = "75ee4e39450943889";                   //用户名
const char* ESP8266_password = "wulianwang";              //密码
const char* ESP8266_pub = "banzi002";                 //发送主题（对方的订阅主题）
const char* ESP8266_sub = "banzi002";                 //订阅主题（对方的发送主题）
WiFiClient espClient;
PubSubClient client(espClient);                      //定义客户端对象


#define SCL 5
#define SDA 4
U8G2_SSD1306_128X64_NONAME_F_SW_I2C u8g2(U8G2_R0, /*clock=*/SCL, /*data=*/SDA, /*reset=*/U8X8_PIN_NONE);



//UDP定义
IPAddress sta_client;                        //保存sta设备的ip地址
unsigned int localUdp = 1234;     //监听端口
unsigned int remoteUdp = 4321;     //发送端口
unsigned int remoteUdp1 = 4322;     //发送端口
char comPacket[255];                 //数据缓存
WiFiUDP Udp;                        //定义udp
//定义引脚
//---------------------------------------------------------------------

int _servo = 14;                    //IO14（D5）
int _servo2 = 13;

int LED = D4;
int ji = D0;                //继电器
int hongDT = 12;            //红外人体检测
float h;
float t;
long s;
String comdata = " ";//串口接收数组
bool oState = false;//状态标志位
//继电器置0为关
//人体检测pinMode(__,INPUT);
void hardwareInit() {
  myservo.attach(_servo);           //设置指定io为舵机
  myservo2.attach(_servo2);

  myservo.write(90);
  myservo2.write(90);

  pinMode(LED, OUTPUT);   // 初始化NodeMCU控制板载LED引脚为OUTPUT
  digitalWrite(LED, LOW);// 初始化LED引脚状态
  pinMode(ji, OUTPUT);
  digitalWrite(ji, 0);
  pinMode(hongDT, INPUT);

}

//---------------------------------------------------------------------
void setup() {
  u8g2.begin();
  u8g2.enableUTF8Print(); // enable UTF8 support for the Arduino print() function

  u8g2.setFont(u8g2_font_unifont_t_symbols);
  u8g2.firstPage();
  u8g2.enableUTF8Print();//enable UTF8
u8g2.setFont(u8g2_font_wqy12_t_gb2312b);//设置中文字符集
  do
  {
    u8g2.setCursor(0, 15); //指定显示位置
    u8g2.print("WELCOME"); //使用print来显示字符串
    u8g2.setCursor(0, 30); //指定显示位置
    u8g2.print("MASTER"); //使用print来显示字符串
  } while (u8g2.nextPage());

  hardwareInit();

  udpBegin();

  dht.begin();

  Serial.begin(9600);          // 启动串口通讯
  Serial.println("");


  wifiInit();
  AP_init();

  // 启动闪存文件系统
  if (SPIFFS.begin()) {
    Serial.println("SPIFFS Started.");
  } else {
    Serial.println("SPIFFS Failed to Start.");
  }
  handleGet();

  // 启动网站服务
  esp8266_server.begin();
  Serial.println("HTTP server started");

  initMQTT();                         //初始化MQTT客户端
  gotoMQTT();                         //连接到指定MQTT服务器，并订阅指定主题
}
//---------------------------------------------------------------------
void loop(void) {

  client.loop();//持续运行MQTT运行函数，完成接收数据和定时发送心跳包
  esp8266_server.handleClient();
  dnsServer.processNextRequest();//处理DNS请求服务
  //  oledShow();
  //  huTemp();
  //    readHT();
  //  hong();

  usartEvent();//串口中断
  if (oState == false && digitalRead(LED_BUILTIN) == LOW) //灯灭
  {
    digitalWrite(LED_BUILTIN, HIGH); //灯灭
    Serial.printf("{\"status\":false}");
  }
  else if (oState == true && digitalRead(LED_BUILTIN) == HIGH) //灯亮
  {
    digitalWrite(LED_BUILTIN, LOW); //灯亮
    Serial.printf("{\"status\":true}");
  }

}
//---------------------------------------------------------------------
//所有初始化函数
//======================================================================================
void udpBegin() {
  if (Udp.begin(localUdp)) { //启动Udp监听服务
    Serial.println("监听成功");
    //打印本地的ip地址，在UDP工具中会使用到
    //WiFi.localIP().toString().c_str()用于将获取的本地IP地址转化为字符串
    Serial.printf("现在收听IP：%s, UDP端口：%d\n", WiFi.localIP().toString().c_str(), localUdp);
  } else {
    Serial.println("监听失败");
  }
}
//wifi定义
//---------------------------------------------------------------------
void wifiInit() {
  //  wifiMulti.addAP("lnettwo", "lhl15352319937"); // 将需要连接的一系列WiFi ID和密码输入这里
  wifiMulti.addAP("ChinaNet-LLL", "shvemHKU");
  wifiMulti.addAP("lnet", "qiaokl123");
  wifiMulti.addAP("305-2.4G", "shiyanshi305");
  wifiMulti.addAP("打咕噜adc", "yamadei962464");
  Serial.println("Connecting ...");

  int i = 0;
  while (wifiMulti.run() != WL_CONNECTED) { // 尝试进行wifi连接。
    delay(1000);
    Serial.print("WiFi连接中");
    Serial.print(i++); Serial.print(' ');
  }
  //  LED_BUILTIN
  digitalWrite(LED, HIGH);
  // WiFi连接成功后将通过串口监视器输出连接成功信息
  Serial.println('\n');
  Serial.print("Connected to ");
  Serial.println(WiFi.SSID());              // 通过串口监视器输出连接的WiFi名称
  Serial.print("IP address:\t");
  Serial.println(WiFi.localIP());           // 通过串口监视器输出ESP8266-NodeMCU的IP
}
void AP_init() {
  IPAddress softLocal(192, 168, 3, 6);        //IP地址，用以设置IP第4字段
  IPAddress softGateway(192, 168, 3, 6);      //IP网关，用以设置IP第3字段
  IPAddress softSubnet(255, 255, 255, 0);

  WiFi.mode(WIFI_AP_STA);                 //设置为AP模式(热点)
  WiFi.softAPConfig(softLocal, softGateway, softSubnet);
  WiFi.softAP(ssid, password);
  //    IPAddress myIP = WiFi.soft APIP();
  IPAddress myIP = WiFi.softAPIP();           //用变量myIP接收AP当前的IP地址
  Serial.println(myIP);                       //打印输出myIP的IP地址

  //DNS服务器解析地址
  //  dnsServer.setErrorReplyCode(DNSReplyCode::ServerFailure);
  dnsServer.start(DNS_PORT, "www.me.com", softLocal);

}
//---------------------------------------------------------------------

//以下为各函数定义
//========================================================================================================================
void hong() {
  if (digitalRead(hongDT) == 0) {
    Serial.println("好像没人了");
    delay(1000);
  } else {
    Serial.println("有人靠近，");
    delay(1000);
  }

}
///*串口数据接收*/
void usartEvent() {
  comdata = "";
  while (Serial.available())//时刻读取硬件串口数据
  {
    comdata = Serial.readStringUntil('\n');//从串口缓存区读取字符到一个字符串型变量，直至读完或遇到某终止字符。
    UserData(comdata);//进行JOSN数据解析
  }
  while (Serial.read() >= 0) {} //清除串口缓存
}

///*数据解析*/
void UserData(String content) {
  StaticJsonDocument<200> doc;
  DeserializationError error = deserializeJson(doc, content);
  if (error) {
    Serial.print(F("deserializeJson() failed: "));
    return;
  }
  oState =  doc["status"];
  Serial.printf("the status is %d", oState);
}


//UDP发送函数
void sendBack(const char *buffer, int xx) {
  if (xx == 1) {
    Udp.beginPacket(remoteIp1, remoteUdp);//配置远端ip地址和端口
  } else if (xx == 2) {
    Udp.beginPacket(remoteIp2, remoteUdp);
  }
  //  Udp.write(buffer); //把数据写入发送缓冲区
  Udp.print(buffer);
  Udp.endPacket(); //发送数据
}
void udpDo() {
  //解析Udp数据包
  int packetSize = Udp.parsePacket();//获得解析包
  if (packetSize)//解析包不为空
  {
    //收到Udp数据包
    //Udp.remoteIP().toString().c_str()用于将获取的远端IP地址转化为字符串
    Serial.printf("收到来自远程IP：%s（远程端口：%d）的数据包字节数：%d\n", Udp.remoteIP().toString().c_str(), Udp.remotePort(), packetSize);

    // 读取Udp数据包并存放在incomingPacket
    int len = Udp.read(comPacket, 255);//返回数据包字节数
    if (len > 0)
    {
      comPacket[len] = 0;//清空缓存
      Serial.printf("UDP数据包内容为: %s\n", comPacket);//向串口打印信息

      //strcmp函数是string compare(字符串比较)的缩写，用于比较两个字符串并根据比较结果返回整数。
      //基本形式为strcmp(str1,str2)，若str1=str2，则返回零；若str1<str2，则返回负数；若str1>str2，则返回正数。
      if (strcmp(comPacket, "LED_OFF") == 0) // 命令LED_OFF
      {
        //        digitalWrite(LED_BUILTIN, HIGH); // 熄灭LED
        //        sendBack("LED has been turn off\n");
      }
      else if (strcmp(comPacket, "LED_ON") == 0) //如果收到LED_ON
      {
        //        digitalWrite(LED_BUILTIN, LOW); // 点亮LED
        //        sendBack("LED has been turn on\n");
      }\
      else // 如果指令错误，调用sendCallBack
      {
        //        sendBack("Command Error!");
      }
    }
  }
}
void ledShow(String content) {
  do
  {
    u8g2.clearBuffer();
    u8g2.setCursor(0, 30); //指定显示位置
    u8g2.print(content); //使用print来显示字符串
  } while (u8g2.nextPage());
}
//MQTT部分开始
//==================================================================================================
void initMQTT()//初始化MQTT设置
{
  //指定客户端要连接的MQTT服务器IP和端口
  client.setServer(mqtt_server, mqttPort);
  //绑定数据回调函数
  client.setCallback(callback);
}

void gotoMQTT()//连接MQTT服务器
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
  client.subscribe(ESP8266_sub, 1);//添加订阅
}

void callback(char* topic, byte* payload, unsigned int length)//数据回调函数，监听数据接收
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
  MQTT_Handler(data);//把接收的数据，传入处理函数执行分析处理
}
void MQTT_Handler(String data)//数据处理函数，执行对接收数据的分析处理
{
  if (data == "")
  {
    return;
  }
  if (data == "on")
  {
    digitalWrite(LED, 0);
  }
  else if (data == "off")
  {
    digitalWrite(LED, 1);
  }
}
//MQTT部分结束
//==================================================================================================
//处理用户get请求
//---------------------------------------------------------------------
void handleGet() {
  esp8266_server.on("/spswControl", spswControl);
  esp8266_server.onNotFound(handleUserRequest); // 处理其它网络资源请求
}
//处理用户列表函数
//---------------------------------------------------------------------
void spswControl() {
  String name = esp8266_server.arg("name");
  String hardwareID = esp8266_server.arg("hardwareID");
  String hardwarePort = esp8266_server.arg("hardwarePort");
  String instruction = esp8266_server.arg("instruction");
  ledShow(hardwarePort);
  Serial.println(hardwarePort);
  int port = hardwarePort.toInt();
  pinMode(port, OUTPUT);
  if (instruction == "open") {
    digitalWrite(port, 1);
    if(digitalRead(port)) {
       ledShow("打开");
    Serial.println("打开");
    }
   
  } else {
    digitalWrite(port, 0);
    if(!digitalRead(port)) {
       ledShow("关闭");
    Serial.println("关闭");   
    }
     
  }
}
void userver() {
  String xx = "";
  String user_json = esp8266_server.arg("json");
  if (user_json == "1") {
    File dataFile = SPIFFS.open("/user.json", "r");

    //读取文件内容并且通过串口监视器输出文件信息
    for (int i = 0; i < dataFile.size(); i++) {
      xx += (char)dataFile.read();
    }
    esp8266_server.send(200, "text/plain", xx); //发送网页
    Serial.println(xx);
  } else {
    File dataFile = SPIFFS.open("/user.json", "w");
    dataFile.println(user_json);       // 向dataFile写入字符串信息
    dataFile.close();                           // 完成文件写入后关闭文件
    Serial.println("Finished Writing data to SPIFFS");
    esp8266_server.send(200, "text/plain", "success"); //发送网页
  }
}
//处理灯函数
//---------------------------------------------------------------------
void ledHandle() {
  String LED_State = esp8266_server.arg("handle"); //参考xhttp.open("GET", "setLED?LEDstate="+led, true);
  //  Serial.println(LED_State);

  if (LED_State == "on") {
    digitalWrite(LED, 0);

    ledShow("LED_ON");

    esp8266_server.send(200, "text/plain", "ON"); //发送网页
  } else if (LED_State == "off") {
    digitalWrite(LED, 1); //LED 熄灭

    ledShow("LED_OFF");

    esp8266_server.send(200, "text/plain", "OFF"); //发送网页
  } else {

    int pwmVal = LED_State.toInt();              // 将用户请求中的PWM数值转换为整数
    pwmVal = 1023 - map(pwmVal, 0, 100, 0, 1023); // 用户请求数值为0-100，转为0-1023
    analogWrite(LED, pwmVal);         // 实现PWM引脚设置
  }
  esp8266_server.send(200, "text/plain"); //发送网页
}
//处理窗户函数
//---------------------------------------------------------------------
void winHandle() {
  String win_state = esp8266_server.arg("handle");


  if (win_state == "on") {
    myservo.write(180);
    delay(100);
    myservo2.write(0);
    ledShow("WIN_ON");
    esp8266_server.send(200, "text/plain", "ON");
  } else if (win_state == "off") {
    myservo.write(60);
    delay(100);
    myservo2.write(120);
    ledShow("WIN_OFF");
    esp8266_server.send(200, "text/plain");
  } else {
    int pwm = win_state.toInt();              // 将用户请求中的PWM数值转换为整数
    int pwm2 = win_state.toInt();

    pwm = map(pwm, 0, 100, 60, 180); // 用户请求数值为0-100，转为0-1023
    pwm2 = map(pwm2, 0, 100, 120, 0);
    myservo.write(pwm);        // 实现PWM引脚设置
    myservo2.write(pwm2);
  }
  esp8266_server.send(200, "text/plain", "OFF"); //发送网页
}
//处理风扇函数
//---------------------------------------------------------------------
void fanHandle() {
  String fan_state = esp8266_server.arg("handle");
  if (fan_state == "on") {
    sendBack("FAN_ON", 1);
    ledShow("FAN_ON");
    esp8266_server.send(200, "text/plain");
  } else if (fan_state == "off") {
    sendBack("FAN_OFF", 1);
    ledShow("FAN_OFF");
    esp8266_server.send(200, "text/plain");
  }
}
//处理加湿器函数
//---------------------------------------------------------------------
void wetHandle() {
  String fan_state = esp8266_server.arg("handle");
  if (fan_state == "on") {
    sendBack("WET_ON", 1);
    ledShow("WET_ON");
    esp8266_server.send(200, "text/plain");
  } else if (fan_state == "off") {
    sendBack("WET_OFF", 1);
    ledShow("WET_OFF");
    esp8266_server.send(200, "text/plain");
  }
}
//处理加湿器函数
//---------------------------------------------------------------------
void curtainHandle() {
  String cur_state = esp8266_server.arg("handle");
  if (cur_state == "on") {
    sendBack("CUR_ON", 1);
    ledShow("CUR_ON");
    esp8266_server.send(200, "text/plain");
  } else if (cur_state == "off") {
    sendBack("CUR_OFF", 1);
    ledShow("CUR_OFF");
    esp8266_server.send(200, "text/plain");
  }
}
//处理门函数
//---------------------------------------------------------------------
void doorHandle() {
  String door_state = esp8266_server.arg("handle");
  if (door_state == "on") {
    sendBack("DOOR_ON", 2);
    ledShow("DOOR_ON");
    esp8266_server.send(200, "text/plain");
    Serial.println("IdSuc");
  } else if (door_state == "off") {
    sendBack("DOOR_OFF", 2);
    ledShow("DOOR_OFF");
    esp8266_server.send(200, "text/plain");
  }
}
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
  float read_h = dht.readHumidity();//湿度
  float read_t = dht.readTemperature();//温度
  // 检查是否有任何读取失败并提前退出（重试）。
  if (isnan(read_h) || isnan(read_t) ) {
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
  String data_state = esp8266_server.arg("data_trs");
  if (data_state == "1") {
    readHT();
    String data = String(h) + "|" + String(t);
    Serial.println(data);
    esp8266_server.send(200, "text/plain", data);
  }

}

//处理用户浏览器的HTTP资源请求
//---------------------------------------------------------------------
void handleUserRequest() {

  // 获取用户请求资源(Request Resource）
  String reqResource = esp8266_server.uri();
  Serial.print("reqResource: ");
  Serial.println(reqResource);

  // 判断是否获取
  bool fileReadOK = handleFileRead(reqResource);

  // 如果在SPIFFS无法找到用户访问的资源，则回复404 (Not Found)
  if (!fileReadOK) {
    esp8266_server.send(404, "text/plain", "404 Not Found");
  }
}
//处理浏览器HTTP访问
//---------------------------------------------------------------------
bool handleFileRead(String resource) {

  if (resource.endsWith("/")) {                   // 如果访问地址以"/"为结尾
    resource = "/index.html";                     // 则将访问地址修改为/index.html便于SPIFFS访问
  }
  if (resource == "/user.json") {
    esp8266_server.send(403, "text/html", "<h1>No Access</h1>");
  }

  String contentType = getContentType(resource);  // 获取文件类型

  if (SPIFFS.exists(resource)) {                     // 如果访问的文件可以在SPIFFS中找到
    File file = SPIFFS.open(resource, "r");          // 则尝试打开该文件
    esp8266_server.streamFile(file, contentType);// 并且将该文件返回给浏览器
    file.close();                                // 并且关闭文件
    return true;                                 // 返回true
  }
  return false;                                  // 如果文件未找到，则返回false
}
//获取文件类型
//---------------------------------------------------------------------
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
