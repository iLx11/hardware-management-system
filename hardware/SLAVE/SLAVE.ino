#include <Wire.h>
#include <ESP8266WiFi.h>
#include <WiFiUdp.h>
#include "bujin.h"
#include <ArduinoJson.h> //使用JSON-v5版的库
/*****************AP设置项 *****************/
const char *STAssid = "webcontrol" ; //AP名字
const char *STApassword = "12345678"; //AP密码
/****************UDP设置项 *****************/
unsigned int localUdp = 4321;      //监听端口
unsigned int remoteUdp = 1234;      //发送端口
char comPacket[512];                  //数据缓存

WiFiUDP Udp;                         //定义udp
IPAddress ap_ip(192, 168, 1, 128); //AP的ip地址
/****************io设置项 *****************/
int state_led = 2;                   //IO2（D4），板载led，作为判断WiFi连接状态，连上为亮

//int relay1 = 15;
//int relay2 = 13;
//int relay3 = 12;
//int relay4 = 14;

int port = 0;
String ins = "";
String num = "";
//定义
//---------------------------------------------------------------------

//---------------------------------------------------------------------
void setup()
{

  pinMode(state_led, OUTPUT);
  digitalWrite(state_led, 1);
  //  pinMode(relay1, OUTPUT);
  //  digitalWrite(relay1, 0);
  //  pinMode(relay2, OUTPUT);
  //  digitalWrite(relay1, 0);
  Serial.begin(115200);
  Serial.println(comPacket);
  Serial.println("");
  init_STA();
  motoInit(5, 4, 0, 2);


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
        } else if (ins == "close") {
          motoRun(2, 2, 1);
        }
      }

      //strcmp函数是string compare(字符串比较)的缩写，用于比较两个字符串并根据比较结果返回整数。
      //基本形式为strcmp(str1,str2)，若str1=str2，则返回零；若str1<str2，则返回负数；若str1>str2，则返回正数。
      //      if (strcmp(comPacket, "FAN_OFF") == 0) // 命令LED_OFF
      //      {
      //        digitalWrite(relay1, 0);
      //        sendBack("LED has been turn off\n");
      //      }
    }
  }
}
//初始化连接AP
void init_STA()
{
  IPAddress local_ip(192, 168, 3, 123);
  IPAddress arg1(192, 168, 3, 1);
  IPAddress arg2(255, 255, 255, 0);
  IPAddress arg3(192, 168, 3, 1);
  IPAddress dns2(192, 168, 3, 1);
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
