#include <Wire.h>
#include <ESP8266WiFi.h>
#include <WiFiUdp.h>
#include "SR04.h" 
#include "bujin.h"
#include <ArduinoJson.h> //使用JSON-v5版的库
/*****************AP设置项 *****************/
const char *STAssid = "webcontrol" ; //`AP名字
const char *STApassword = "12345678"; //AP密码
/****************UDP设置项 *****************/
unsigned int localUdp = 4321;      //监听端口
unsigned int remoteUdp = 1234;      //发送端口
char comPacket[512];                  //数据缓存

WiFiUDP Udp;                         //定义udp
IPAddress ap_ip(192, 168, 1, 110); //AP的ip地址
/****************io设置项 *****************/
int state_led = 2;                   //IO2（D4），板载led，作为判断WiFi连接状态，连上为亮


int E=12;                          //IO4(D2),Echo  获取返回的超声波时间差
int T=14;                          //IO5(D1),Trig  给超声波模块发送指令
SR04 sr04 = SR04(E,T);            //配置超声波的IO
int ofdoor = 0;

//定义
//---------------------------------------------------------------------
int port = 0;
String ins = "";
String num = "";
//---------------------------------------------------------------------
void setup()
{

  pinMode(state_led, OUTPUT);
  digitalWrite(state_led, 1);
  motoInit(5,4,0,2);
  
  Serial.begin(115200);
  Serial.println(comPacket);
  Serial.println("");
  init_STA();

  if (Udp.begin(localUdp)) { //启动Udp监听服务
    Serial.println("监听成功");
    //打印本地的ip地址，在UDP工具中会使用到
    //WiFi.localIP().toString().c_str()用于将获取的本地IP地址转化为字符串
    Serial.printf("现在收听IP：%s, UDP端口：%d\n", WiFi.localIP().toString().c_str(), localUdp);
    digitalWrite(state_led, 0);
  } else {
    Serial.println("监听失败");
    digitalWrite(state_led, 1);
  }
}
void loop()
{
  delay(500);
  //oledShow();
  int a=sr04.Distance();          //获取当前距离
  if(a < 4 && ofdoor == 1){
    motoRun(2,2,1);
    ofdoor = 0;
  }
  udpDo();
  if (Udp.begin(localUdp)) {
    digitalWrite(state_led, 0);
  } else {
    digitalWrite(state_led, 1);
  }

}
void sendBack(const char *buffer) {
  Udp.beginPacket(Udp.remoteIP(), remoteUdp);//配置远端ip地址和端口
  Udp.write(buffer); //把数据写入发送缓冲区
  Udp.endPacket(); //发送数据
}
//JSON数据解析
void jsonDataFormat(String str) {
  // 重点2：解析的JSON数据大小
  DynamicJsonDocument doc(str.length() * 2); //解析的JSON数据大小


  // 重点3：反序列化数据
  deserializeJson(doc, str);

  // 重点4：获取解析后的数据信息
  port = doc["hardwarePort"].as<int>();
  ins = doc["instruction"].as<String>();
  num = doc["num"].as<String>();

  // 通过串口监视器输出解析后的数据信息
  Serial.print("port = "); Serial.println(port);
  Serial.print("ins = "); Serial.println(ins);
  Serial.print("num = "); Serial.println(num);
}
void udpDo() {
  //解析Udp数据包
  int packetSize = Udp.parsePacket();//获得解析包
  if (packetSize)//解析包不为空
  {
    //收到Udp数据包
    //Udp.remoteIP().toString().c_str()用于将获取的远端IP地址转化为字符串
    Serial.printf("收到来自远程IP：%s（远程端口：%d）的数据包字节数：%d\n", Udp.remoteIP().toString().c_str(), Udp.remotePort(), packetSize);

    // 读取Udp数据包并存放在comPacket
    int len = Udp.read(comPacket, 512);//返回数据包字节数
    if (len > 0)
    {
      comPacket[len] = 0;//清空缓存
      Serial.printf("UDP数据包内容为: %s\n", comPacket);//向串口打印信息

      jsonDataFormat(comPacket);
      //      Serial.println(port);
      Serial.println(num);
      if (num == "relay") {
        pinMode(port, OUTPUT);
        Serial.println("继电器工作");
        if (ins == "open") {
          digitalWrite(port, 1);
        } else if (ins == "close") {
          digitalWrite(port, 0);
        }
      } else if (num == "motor") {
        if (ins == "open") {
          motoRun(1, 2, 1);
          ofdoor = 1;
        } else if (ins == "close") {
          motoRun(2, 2, 1);
          ofdoor = 0;
        }
      }
    }
  }
}

//初始化连接AP
void init_STA()
{
  IPAddress local_ip(192, 168, 3, 223);
  IPAddress arg1(192, 168, 3, 2);
  IPAddress arg2(255, 255, 255, 0);
  IPAddress arg3(192, 168, 3, 2);
  IPAddress dns2(192, 168, 3, 2);
  WiFi.disconnect();
  WiFi.config(local_ip, arg1, arg2, arg3, dns2);
  WiFi.mode(WIFI_STA);
  WiFi.begin(STAssid, STApassword);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    digitalWrite(state_led, !digitalRead(state_led)); //翻转WiFi连接状态指示灯
    Serial.print(".");
  }
  digitalWrite(state_led, 0);
}
