var express = require('express');
var app = express();
var bodyParser = require('body-parser');

const request = require('request');
var Cookie = require('request-cookies').Cookie;

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static('public'));
app.get('/index.htm', function (req, res) {
   res.sendFile( __dirname + "/" + "index.htm" );
});


var server = app.listen(process.env.PORT || '3000', function () {
   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)

});

var headers = {
  'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.186 Safari/537.36',
  'referer':'',
  'Cookies':'',
  'origin':'',
  'host':'',
  Cookie:''
}

init();

function get(url,callback) {
  reqt({
    url:url,
    method:'GET',
    headers:headers
  },callback);
}


start();
function start() {

  login('alex_2.6@hotmail.com','SamersameR8',
  function (c) {
    if (c === null)
    {
        console.log('login not success');
        setTimeout(start,5000);
    }

    else {


      dellAllMess();


    }


  });
}

function init() {
  list = [];
  n = 0;
}

function dellAllMess() {
  clear();
  get('https://mbasic.facebook.com/messages/',function (err,resp,body) {
    //console.log(body);
     list = body.match(/<a href="\/messages\/read\/.*?">/gi);

     if (list === null) {
       conosle.log('success '+ n + ' message');
       init();
       conosle.log('done');
       return;
     }

    dellMess()
  });
}

function dellMess() {
  var url = list[0].match(/href="(.*?)"/)[1];
  url = 'https://mbasic.facebook.com'+url;
  list.shift();
  //console.log(url);
  delFromUrl(url);
  //write(body);
}

function delFromUrl(url) {
get(url,function (err,resp,data) {
  var f_url = data.match(/<form method="post" action="(\/messages\/action_redirect\?.*?)"/)[1].replace('&amp;','&');
  f_url = 'https://mbasic.facebook.com/'+f_url;
  var fbd = data.match(/<input type="hidden" name="fb_dtsg" value="(.*?)"/)[1];

  var form = {
    fb_dtsg:fbd,
  'delete':'حذف'
}

  post(f_url,form,function (err,resp,body) {
    if (err) conosle.log(err);
    var url = resp.headers.location;
    get(url,function (err,resp,body) {
      if (err) return console.log(err);
      url = body.match(/<a href="(\/messages\/action\/\?mm_action=delete.+?)"/)[1].replace(/&amp;/g,'&');
      url = 'https://mbasic.facebook.com'+url;

      get(url,function (err,resp,body) {
      //  console.log(resp.headers);
      //  write(body);
      n++;
      console.log('success --> '+n);
      if (list.length > 0) {
        dellAllMess();
      }
      else
      dellMess();

      });
      //write(body);
    });

  });

  //console.log(fbd);
  //write(data);
});
}


function clear() {
  headers.origin = '';
  headers.referer = '';
  headers.host = '';
}

function login(email,pass,callback) {
  post('https://m.facebook.com/login/',{
    email:email,
    pass:pass
  },function (err,resp,body) {
    if (err) return console.log(err);
    var rawcookies = resp.headers['set-cookie'];
    var txt = '';
    var t = false;
  for (var i in rawcookies) {
    var cookie = new Cookie(rawcookies[i]);
    txt += cookie.key+'='+cookie.value+'; ';
    headers.Cookie = txt;
    if (cookie.key == 'xs') t = true;

  }
  callback((t) ? true:null);
  });

}


function post(url,op,callback) {
  reqt({
    url:url,
    method:'POST',
    headers:headers,
    form:op
  },callback);
}

function reqt(ob,callback) {
  ob.headers = headers;
  if (headers.origin == '') headers.origin = ob.url.split(/\b\/\b/)[0];
    if (headers.host == '') headers.host = ob.url.split('://')[1].split('/')[0];
    headers.referer = ob.url;
    request(ob,callback);

}

/*
function write(text) {
  var fs = require('fs');
  fs.writeFile('index.html',text,'UTF-8',function (err) {
    if (err) return console.log(err);
    console.log('done');
  })
}
*/
//get('https://www.whatismybrowser.com/detect/what-is-my-user-agent',function (err,res,body) {
//  console.log(body);
//});
