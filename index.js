if(new URL(window.location.href).searchParams.get('lang')){
	lessonsDataSet();
}
else{
  langsListSet();
}
var langsList=[];
var lessonsList=[];
var wordsList=[[],[],[]];
var limit=[];
var toSolve=[[],[],[]];
var noSeen=[[],[],[]];
var remain=0;
var cor=0;
var inc=0;

function langsListSet(){
  fetch('https://sheets.googleapis.com/v4/spreadsheets/14kwQv_6Krk9wAlf1-d6exL7X-9nRsRZqppNCTuCw_rM/values/langs!A:D?key=AIzaSyATLeHQh6kM0LWRJjLg8CmzoSdnntFrmFk')
  .then(response=>response.json())
  .then(data=>{
    langsList=data.values;
    const langsListBox = document.getElementById('langs_list');
    let i='';
    langsList.forEach(row => {
      i+=`<div class="shadow-boxing" data-lang="${row[0]}">
        <sup>${row[0]}</sup><h2 style="display:inline-block;">${row[1]}</h2>
        <p>${row[2]}</p>
      </div>`;
    });
    langsListBox.innerHTML=i;
    document.querySelectorAll('.shadow-boxing').forEach(element=>{
      element.addEventListener('click',function(){
        const lang=this.getAttribute('data-lang');
        langsListBox.innerHTML='';
        history.pushState(null,'',`?lang=${lang}`);
        lessonsDataSet();
      });
    });
  });
}
function lessonsDataSet(){
  fetch('https://sheets.googleapis.com/v4/spreadsheets/14kwQv_6Krk9wAlf1-d6exL7X-9nRsRZqppNCTuCw_rM/values/langs!A:D?key=AIzaSyATLeHQh6kM0LWRJjLg8CmzoSdnntFrmFk')
  .then(response=>response.json())
  .then(data1=>{
    let lang=data1.values[data1.values.findIndex(row=>row[0]===new URL(window.location.href).searchParams.get('lang'))][3];
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${lang}/values/lessons!A:F?key=AIzaSyATLeHQh6kM0LWRJjLg8CmzoSdnntFrmFk`)
    .then(response=>response.json())
    .then(data2=>{
      lessonsList=data2.values;
      lessonsListSet();
    });
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${lang}/values/words!A:B?key=AIzaSyATLeHQh6kM0LWRJjLg8CmzoSdnntFrmFk`)
    .then(response=>response.json())
    .then(data3=>{
      wordsList[0]=data3.values;
    });
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${lang}/values/words!C:E?key=AIzaSyATLeHQh6kM0LWRJjLg8CmzoSdnntFrmFk`)
    .then(response=>response.json())
    .then(data4=>{
      wordsList[1]=data4.values;
    });
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${lang}/values/words!F:G?key=AIzaSyATLeHQh6kM0LWRJjLg8CmzoSdnntFrmFk`)
    .then(response=>response.json())
    .then(data5=>{
      wordsList[2]=data5.values;
    });
  });
}
function lessonsListSet(){
  var lessonsListBox=document.getElementById('lessons_list');
  lessonsList.forEach(row=>{
    lessonsListBox.innerHTML+=`<div class="shadow-boxing" data-lesson=${row[0]}>
      <h2 style="display:inline-block;">${row[0]}</h2>
    </div>`;
  });
  document.querySelectorAll('.shadow-boxing').forEach(element=>{
    element.addEventListener('click',function(){
      const lesson=lessonsList[lessonsList.findIndex(row=>row[0]===this.getAttribute('data-lesson'))];
      lessonsListBox.innerHTML='';
      //history.pushState(null,'',`?lang=${lang}`);
      lessonStart(lesson);
    });
  });
}

function lessonStart(lesson){
	var passage=document.getElementById('passage');
  var toMemo=[];
  var num=1;
  remain=Number(lesson[4]);
  cor=0;
  inc=0;
  while(num<=3){
  if(lesson[num]!=='0'){
    var i=Number(lesson[num].split('-')[0])-1;
    if(lesson[num].split('-')[1]){
      var j=Number(lesson[num].split('-')[1])-1;
    }
    else{
      var j=i;
    }
    limit.push(j);
    while(i<=j){
      toSolve[num-1].push(wordsList[num-1][i]);
      if(num===1){
        toMemo.push(wordsList[num-1][i]);
      }
      i++;
    }
  }
  else{
    limit.push(0);
  }
  num++;
  }
  noSeen=JSON.parse(JSON.stringify(toSolve));
  console.log(`toMemo : ${toMemo}`);
  if(lesson[5]){
		passage.innerHTML=`<div style="width:300px;margin:0 auto;color:#282828;">${lesson[5]}<div id="ok" style="margin-top:25px;text-align:center;"><i class="fi fi-br-arrow-right"></i></div></div>`;
		document.querySelector('#ok').addEventListener('click',function(){
			passage.innerHTML='';	
      memo(toMemo);
		});
  }
  else{
    memo(toMemo);
  }
}
function memo(toMemo){
  if(toMemo.length===0){
    solve();
  }
  else{
    passage.innerHTML=`<div style="margin:0 auto;color:#282828;"><div class="shadow-boxing" style="text-align:center;"><h2 style="text-align:center;margin-top:40px;">${toMemo[0][0]}</h2><br>${toMemo[0][1]}</div><div id="next" style="margin-top:25px;text-align:center;"><i class="fi fi-br-angle-right"></i></div></div>`;
    document.querySelector('#next').addEventListener('click',function(){
      document.getElementById('passage').innerHTML='';
      memo(toMemo.slice(1));
    });
  }
}
function solve(){
  if(remain===0){
    document.getElementById('passage').innerHTML=`<div class="shadow-boxing"><p style="text-align:center;margin-top:60px;">총 <b>${cor+inc}</b>개의 문제 중 <b>${cor}</b>개를 맞추셨습니다!</p></div><div id="next" style="margin-top:25px;text-align:center;"><i class="fi fi-br-arrow-right"></i></div>`;
    document.getElementById('input').textContent='';
    document.querySelector('#next').addEventListener('click',nextClick);
    function nextClick(){
      document.querySelector('#next').removeEventListener('click',nextClick);
      document.getElementById('passage').textContent='';
      lessonsListSet();
    }
  }
  else{
    var type=Math.floor(Math.random()*3);
    if(limit[type]===0){
      type=(type+1)%3;
    }
    if(limit[type]===0){
      type=(type+1)%3;
    }
    var i=toSolve[type][Math.floor(Math.random()*toSolve[type].length)];
    if(noSeen[type].length>0){
      i=noSeen[type][Math.floor(Math.random()*noSeen[type].length)];
      noSeen[type]=[...noSeen[type].slice(0,noSeen[type].indexOf(i)),...noSeen[type].slice(noSeen[type].indexOf(i)+1)];
    }
    var j='';
    var n=0;
    var rev=Math.floor(Math.random()*2);
    //문제 유형
    switch(Math.floor(Math.random()*2)){
      case 0 : write(i[rev],i[1-rev]); break;
      case 1:
        if(toSolve[type].length>=4){
          var opt=[];
          n=0;
          while(n<3){
            var ran=Math.floor(Math.random()*(limit[type]+1));
            while(opt.includes(wordsList[type][ran][1-rev])||wordsList[type][ran][1-rev]===i[1-rev]){
              ran=Math.floor(Math.random()*(limit[type]+1));
            }
            opt.push(wordsList[type][ran][1-rev]);
            n++;
          }
          choose(i[rev],opt,i[1-rev]);
        }
        else{
          write(i[rev],i[1-rev]);
        }
        break;
    }
    remain--;
  }
}
function write(pas,ans){
  document.getElementById('passage').innerHTML=`<div class="passage-boxing" style="text-align:center;"><h2 style="display:inline-block;margin-top:25px;color:#282828;">${pas}</h2></div>`;
  document.getElementById('input').innerHTML=`<div id="ans" class="option-boxing" style="padding-top:5px;"><input id="text" type="text"></div><div id="check" style="margin-top:25px;text-align:center;"><i class="fi fi-br-check"></i></div>`;
  document.querySelector('#check').addEventListener('click',checkClick);
  function checkClick(){
    //정답
    if(document.getElementById('text').value.replace(/[\.,\?\!\s]/g, '').toLowerCase()===ans.replace(/[\.,\?\!\s]/g, '').toLowerCase()){
      cor++;
      document.getElementById('ans').className='correct-boxing';
    }
    //오답
    else{
      inc++;
      document.getElementById('ans').className='incorrect-boxing';
    }
    this.innerHTML=`<p style="text-align:center;">${ans}</p><div id="next" style="margin-top:25px;text-align:center;"><i class="fi fi-br-arrow-right"></i></div>`;
    document.querySelector('#check').removeEventListener('click',checkClick);
    document.querySelector('#next').addEventListener('click',nextClick);
  }
  function nextClick(){
    document.querySelector('#next').removeEventListener('click',nextClick);
    document.getElementById('ans').className='option-boxing';
    solve();
  }
}
function choose(pas,opt,ans){
  var ran=Math.floor(Math.random()*4);
  opt=[...opt.slice(0,ran),ans,...opt.slice(ran)];
  document.getElementById('passage').innerHTML=`<div class="passage-boxing" style="text-align:center;"><h2 style="display:inline-block;margin-top:25px;color:#282828;">${pas}</h2></div>`;
  document.getElementById('input').innerHTML='';
  while(opt.length>0){
    document.getElementById('input').innerHTML+=`<div id="${opt[0]}" class="option-boxing" style="padding-left:20px;">${opt[0]}</div>`;
    opt=opt.slice(1);
  }
  document.querySelectorAll('.option-boxing').forEach(element=>{
    element.addEventListener('click',function(){
      //정답
      if(this.textContent===ans){
        cor++;
      }
      //오답
      else{
        inc++;
        this.className='incorrect-boxing';
      }
      document.getElementById(ans).className='correct-boxing';
      document.getElementById('input').innerHTML+=`<div id="next" style="margin-top:25px;text-align:center;"><i class="fi fi-br-arrow-right"></i></div>`;
      document.querySelector('#next').addEventListener('click',nextClick);
      element.removeEventListener('click',arguments.callee);
    });
  });
  function nextClick(){
    document.querySelector('#next').removeEventListener('click',nextClick);
    solve();
  }
}