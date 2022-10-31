int  cyctime = 2048;

int aa;
int bb;
int cc;
int dd;
void motoInit(int a, int b, int c, int d) {
  aa = a;
  bb = b;
  cc = c;
  dd = d;

  pinMode(a, OUTPUT);
  pinMode(b, OUTPUT);
  pinMode(c, OUTPUT);
  pinMode(d, OUTPUT);
}

void re_t() {
  digitalWrite(aa, LOW);
  digitalWrite(bb, LOW);
  digitalWrite(cc, LOW);
  digitalWrite(dd, LOW);
}
void zhuanZ(unsigned int cyctime) {
  re_t();
  digitalWrite(aa, HIGH);
  digitalWrite(bb, HIGH);
  delayMicroseconds(cyctime);

  re_t();
  digitalWrite(bb, HIGH);
  digitalWrite(cc, HIGH);
  delayMicroseconds(cyctime);

  re_t();
  digitalWrite(cc, HIGH);
  digitalWrite(dd, HIGH);
  delayMicroseconds(cyctime);

  re_t();
  digitalWrite(dd, HIGH);
  digitalWrite(aa, HIGH);
  delayMicroseconds(cyctime);
}
void zhuanF(unsigned int cyctime) {
  re_t();
  digitalWrite(dd, HIGH);
  digitalWrite(cc, HIGH);
  delayMicroseconds(cyctime);

  re_t();
  digitalWrite(cc, HIGH);
  digitalWrite(bb, HIGH);
  delayMicroseconds(cyctime);

  re_t();
  digitalWrite(bb, HIGH);
  digitalWrite(aa, HIGH);
  delayMicroseconds(cyctime);

  re_t();
  digitalWrite(aa, HIGH);
  digitalWrite(dd, HIGH);
  delayMicroseconds(cyctime);
}
//(正反转——1为正转，2为反转,  圈数,  速度，越大越慢)
void motoRun(unsigned int x, unsigned int l, unsigned int xx) {
  if (x == 1) {
      for(int i=0; i< 512*l; i++){
        zhuanZ(2048*xx);
        ESP.wdtFeed();
      }
  }else if(x == 2) {
    for(int i=0; i< 512*l; i++){
        zhuanF(2048*xx);
        ESP.wdtFeed();
      }
  }
}
