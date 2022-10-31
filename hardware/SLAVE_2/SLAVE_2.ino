#include <Wire.h>
#include <ESP8266WiFi.h>
#include <WiFiUdp.h>
#include "SR04.h" 
#include "bujin.h"
/*****************AP设置项 *****************/
const char *STAssid = "webcontrol" ; //AP名字
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

      //strcmp函数是string compare(字符串比较)的缩写，用于比较两个字符串并根据比较结果返回整数。
      //基本形式为strcmp(str1,str2)，若str1=str2，则返回零；若str1<str2，则返回负数；若str1>str2，则返回正数。

      if (strcmp(comPacket, "DOOR_ON") == 0) // 命令LED_OFF
      {
        motoRun(1,2,1);
        ofdoor = 1;
      } else if (strcmp(comPacket, "DOOR_OFF") == 0) //如果收到LED_ON
      {
        motoRun(2,2,1);
        ofdoor = 0;
      }
      else // 如果指令错误，调用sendCallBack
      {
        sendBack("Command Error!");
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
