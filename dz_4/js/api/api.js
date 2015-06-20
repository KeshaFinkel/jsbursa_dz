/**
 * Created by kesha-kh on 17.06.15.
 */
/*send request*/
function sendReq(type, url, data, onSuc, onErr) {
  var req = new XMLHttpRequest();
  if(onSuc === undefined ) {
    onSuc = function sucDef(e) {
      console.log('suc', req);
    };
  }
  if(onErr === undefined ) {
    onErr = onErr || function errDef(e) {
      console.log('err', req);
    };
  }
  req.open(type, url, true);
  if (data !== null) {
    req.setRequestHeader('Content-Type', 'application/json');
  }
  req.send(data);
  req.addEventListener('readystatechange',function rsc(){
    if ((req.readyState === 4) && (req.status >= 200) && (req.status < 300)) {
      onSuc(req);
    } else if (req.readyState === 4){
      onErr(req);
    }
  });
}
/*class User*/
function User(id,name,role,phone){
  this.id = id;
  this.name = name;
  this.role = role;
  this.phone = phone;
}
/**/
User.prototype.remove = function removeUser(cb){
  sendReq('DELETE',window.crudURL+'/'+ this.id,null,cb(false),cb(true));
}
/**/
User.load = function(cb) {
  /*user listloaded*/
  function suc(req){
    var listRaw = JSON.parse(req.response);
    var list = [];
    var i;
    for (i = 0;i < listRaw.length;i++){
      switch (listRaw[i].role) {
        case 'Admin':
        list[i] = new Admin(listRaw[i].id, listRaw[i].name, listRaw[i].role, listRaw[i].phone);
          break;
        case 'Student':
          list[i] = new Student(listRaw[i].id, listRaw[i].name, listRaw[i].role, listRaw[i].phone,listRaw[i].strikes);
            break;
        case 'Support':
          list[i] = new Support(listRaw[i].id, listRaw[i].name, listRaw[i].role, listRaw[i].phone,listRaw[i].location);
          break;
      }
    }
   cb(false,list);
  }
  /*some error*/
  function err(){
    cb(true);
  }
  sendReq('GET',window.crudURL,null,suc,err);
}
/**/
User.prototype.save = function(cb) {
  console.log(this);
  if (this.id) {
    sendReq('PUT', window.crudURL + '/' + this.id, JSON.stringify(this), cb(false), cb(true));
  } else {
    //sendReq('POST', window.crudURL, JSON.stringify(this), cb(false), cb(true));
  }
}
/*class student*/
function Student (id,name,role,phone,strikes){
  User.apply(this, arguments);
  this.strikes = strikes;
  this.getStrikesCount = function gsc(){
    return this.strikes
  }
}
Student.prototype = Object.create(User.prototype);
/*class admin*/
function Admin (id,name,role,phone){
  User.apply(this, arguments);
}
Admin.prototype = Object.create(User.prototype);
/*class support*/
function Support (id,name,role,phone,location){
  User.apply(this, arguments);
  this.location = location;
}
Support.prototype = Object.create(User.prototype);