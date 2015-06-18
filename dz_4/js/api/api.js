/**
 * Created by kesha-kh on 17.06.15.
 */
/*send request*/
function sendReq(type, url, data, onSuc, onErr) {
  var req = new XMLHttpRequest();
  onSuc = onSuc || function sucDef(e){
      console.log('suc',req);
  };

  onErr = onErr || function errDef(e){
      console.log('err',req);
  };
  req.open(type, url, true);
  if (data !== null) {
    req.setRequestHeader('Content-Type', 'application/json');
  }
  req.send(data);
  req.addEventListener('readystatechange',function rsc(){
    if ((req.readyState === 4) && (req.status === 200)) {
      onSuc(req);
    } else if (req.readyState===4){
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
User.load = function(cb) {
  /*user listloaded*/
  function suc(req){
    var listRaw = JSON.parse(req.response);
    var list = [];
    var i;
    for (i = 0;i < listRaw.length;i++){
      list[i] = new User(listRaw['id'],listRaw['name'],listRaw['role'],listRaw['phone']);
    }
   cb(false,list);
  }
  /*some error*/
  function err(){
    cb(true);
  }

  sendReq('GET',window.crudURL,null,suc,err);
}
/*class student*/
function Student (){

}
