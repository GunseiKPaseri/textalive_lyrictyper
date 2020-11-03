import { IWord, Player } from "textalive-app-api";
import { PlayController } from "./PlayController";
import { ParameterController } from "./ParameterController";
import { Random } from "./Random";

let beat,char, word,beattoggle=1;
let isLFed=false;
let player;
let playController, parameterController;
let playerdata;
let backgrouhndObject = [];

/** 改行記号 {"crlf" | "cr" | "lf"} */
let NewLineMark ="crlf" ;

  // https://codepen.io/arcatdmz/pen/abNXJgG
/**
 * 新しい文字を出力
 * @param current 
 */
function newChar(current) {
  // 品詞 (part-of-speech)
  // https://developer.textalive.jp/packages/textalive-app-api/interfaces/iword.html#pos
  putchar(current.text);
  // フレーズの最後の文字か否か
  if (current.parent.parent.lastChar === current) {
    putchar("↵");
  }
}

/**
 * 文字出力を初期化
 * @param x {Boolean} trueのときは楽曲情報を書き出さない
 */
function resetChars( x:Boolean= false) {
  char = null;
  word = null;
  isLFed=false;
  PUTCHAR_QUEUE=[];
  PUTCHARBACK_QUEUE=[];
  backgrouhndObject=[];
  document.getElementById("text").innerHTML="";
  document.getElementById("back").innerHTML="";
  if(!x){
    if(playerdata){
      putchar("♫"+playerdata.song.name+"↵");
      putchar("Artist: "+playerdata.song.artist.name+"↵");
    }
    if(player.data.lyricsBody && player.data.lyricsBody.artist )
      putchar("Lyrics: "+ player.data.lyricsBody.artist.name+"↵");
  }
}
/**
 * 再生・停止ボタン周辺 
 * */
playController = new PlayController();

playController.init({
    onPlayClick:() =>{
      if(player){
        if(player.isPlaying){
          // Pause
          player.requestPause();
          return false;
        }else{
          // Play
          player.requestPlay();
          return true;
        }
      }
    },
    onPauseClick:()=>{
      if(player){
        player.requestStop();
        resetChars(true);
        return false;
      }
    },
    onPlayStart:()=>{
      resetChars();
    },
    onPlayResume:()=>{
      document.getElementById("back").classList.remove("freeze");
    },
    onPlayStop:()=>{
      document.getElementById("back").classList.add("freeze");
    }
  });
/**
 * オプション
 */
parameterController = new ParameterController([

{
  title: "フォント",
  name: "fontFamily",
  className:"Select",
  params:[
    ["sansserif","sans-serif(ゴシック)"],
    ["serif","serif(明朝)"],
    ["cursive","cursive(手書き)"],
    ["fantasy","fantasy(装飾)"],
    ["monospace","monospace(等角)"]
  ],
  initialValue: "sansserif",
  onChange: (value)=>{
    document.body.classList.remove("sansserif");
    document.body.classList.remove("serif");
    document.body.classList.remove("cursive");
    document.body.classList.remove("fantasy");
    document.body.classList.remove("monospace");
    document.body.classList.add(value);
  }
},
{
  title: "背景色",
  name: "backGroundColor",
  className: "Color",
  initialValue: {r:255,g:255,b:255},
  onChange: (value)=>{
    let colorCode=("000000"+Math.floor(value).toString(16)).slice(-6);
    document.body.style.backgroundColor="#"+ colorCode;
  }
},
{
  title: "サビでの色",
  name: "chorusColor",
  className: "Color",
  initialValue: {r:255,g:0,b:0},
  onChange: (value)=>{
    Array.from(backgrouhndObject, (y)=>{
      if(y.type=="char"){
        y.element.style.color = getBackColor(y.segnum,y.seed);
      }else{
        y.element.style.backgroundColor = getBackColor(y.segnum,y.seed);
      }
    });
  }
},
{
  title: "背景文字大",
  name: "backFontSize",
  className:"Slider",
  params:[1,30],
  initialValue: 14,
  onChange: (value)=>{
    document.getElementById("back").style.fontSize=`${value}em`;
  }
},
{
  title: "背景の傾き",
  name: "backSlope",
  className:"Slider",
  params:[-90,90],
  initialValue: 20,
  onChange: (value)=>{
    document.getElementById("back").style.transform=`rotate(${value}deg)`;
  }
},
{
  title: "Console表示",
  name: "shownConsole",
  className: "Check",
  initialValue: true,
  onChange: (value)=>{
    if(value){
      //show
      document.getElementById("console").classList.remove("hidden");
    }else{
      //hide
      document.getElementById("console").classList.add("hidden");
    }
  }
},
{
  title: "カーソル形状",
  name: "CursorType",
  className:"Select",
  params:[
    ["underbar","下線(_)"],
    ["box","四角(■)"],
    ["vbar","縦棒(|)"]
  ],
  initialValue: "underbar",
  onChange: (value)=>{
    document.getElementById("cursor").classList.remove("box");
    document.getElementById("cursor").classList.remove("vbar");
    switch(value){
      case "box":
        document.getElementById("cursor").classList.add("box");
        break;
      case "vbar":
        document.getElementById("cursor").classList.add("vbar");
        break;
    }
  }
},
{
  title: "改行記号",
  name: "NewLineMark",
  className:"Select",
  params:[
    ["crlf","CRLF(↵)"],
    ["cr","CR(←))"],
    ["lf","LF(↓)"]
  ],
  initialValue: "crlf",
  onChange: (value)=>{
    NewLineMark = value;
    Array.from(document.querySelectorAll("#console .newlinemark"),(y)=>{
      y.classList.remove("lf");
      y.classList.remove("cr");
      if(value!=="crlf")y.classList.add(value);
    });
  }
},
{
  title: "Console文字大",
  name: "FontSize",
  className:"Slider",
  params:[1,50],
  initialValue: 17,
  onChange: (value)=>{
    document.getElementById("console").style.fontSize=`${value/10}em`;
  }
},
{
  title: "Console文字色",
  name: "TextColor",
  className: "Color",
  initialValue: {r:0,g:0,b:0},
  onChange: (value)=>{
    let colorCode=("000000"+Math.floor(value).toString(16)).slice(-6);
    document.getElementById("console").style.color="#"+ colorCode;
    document.getElementById("cursor").style.backgroundColor="#"+ colorCode;
  }
},
{
  title: "乱数Seed",
  name: "Seed",
  className:"Slider",
  params:[0,1000],
  initialValue: 0,
  onChange: (value)=>{}
}

]);

/** セグメント情報を保持 */
let segments;

window.addEventListener('DOMContentLoaded',(event)=>{
  // TextAlive Player を作る
  player = new Player({
    app: {
      appAuthor: "GunseiKPaseri",
      appName: "LyricTyper",
      parameters: parameterController.getPlayerParams()
    } ,
    valenceArousalEnabled: true,
    vocalAmplitudeEnabled: true,
    mediaElement: document.querySelector("#media")
  });
  // https://developer.textalive.jp/events/magicalmirai2020/
  player.addListener({
    onAppReady: (app) => {
      if(!app.songUrl){
        // グリーンライツ・セレナーデ / Omoi feat. 初音ミク
        // - 初音ミク「マジカルミライ 2018」テーマソング
        // - 楽曲: http://www.youtube.com/watch?v=XSLhsjepelI
        // - 歌詞: https://piapro.jp/t/61Y2
        /*player.createFromSongUrl("http://www.youtube.com/watch?v=XSLhsjepelI", {
          video: {
            // 音楽地図訂正履歴: https://songle.jp/songs/1249410/history
            beatId: 3818919,
            chordId: 1207328,
            repetitiveSegmentId: 1942131,
            // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/www.youtube.com%2Fwatch%3Fv%3DXSLhsjepelI
            lyricId: 50145,
            lyricDiffId: 3168
          }
        });*/
        // ブレス・ユア・ブレス / 和田たけあき feat. 初音ミク
        // - 初音ミク「マジカルミライ 2019」テーマソング
        // - 楽曲: http://www.youtube.com/watch?v=a-Nf3QUFkOU
        // - 歌詞: https://piapro.jp/t/Ytwu
        /*player.createFromSongUrl("http://www.youtube.com/watch?v=a-Nf3QUFkOU", {
          video: {
            // 音楽地図訂正履歴: https://songle.jp/songs/1688650/history
            beatId: 3818481,
            chordId: 1546157,
            repetitiveSegmentId: 1942135,
            // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/www.youtube.com%2Fwatch%3Fv=a-Nf3QUFkOU
            lyricId: 50146,
            lyricDiffId: 3143
          }
        });*/
        
        // 愛されなくても君がいる / ピノキオピー feat. 初音ミク
        // - 初音ミク「マジカルミライ 2020」テーマソング
        // - 楽曲: http://www.youtube.com/watch?v=ygY2qObZv24
        // - 歌詞: https://piapro.jp/t/PLR7
        player.createFromSongUrl("http://www.youtube.com/watch?v=ygY2qObZv24", {
          video: {
            // 音楽地図訂正履歴: https://songle.jp/songs/1977449/history
            beatId: 3818852,
            chordId: 1955797,
            repetitiveSegmentId: 1942043,
            // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/www.youtube.com%2Fwatch%3Fv=ygY2qObZv24
            lyricId: 50150,
            lyricDiffId: 3158
          }
        });
      }
      if (app.managed) {
        // 再生コントロールを非表示
        document.querySelector("#playcontroller").classList.add("hidden");
        document.querySelector("#overlay").classList.add("hidden");
        // dat.GUI 非表示
        document.querySelector(".dg.ac").style.display="none";
      }
    },
    // 動画オブジェクトの準備が整ったとき（楽曲に関する情報を読み込み終わったとき）に呼ばれる
    onVideoReady: (v) => {
      // 楽曲情報を表示
      char =null;
      word =null;
      playerdata=player.data;
      document.title = playerdata.song.artist.name;
      segments = player.data.songMap.segments;
    },
    // 再生押下可能タイミングに呼ばれる
    onTimerReady: () =>{
      document.querySelector("#overlay").classList.add("playable");
    },
    // 楽曲の再生時
    onPlay() {
      playController.toPlay();
    },
    /* 楽曲の再生が止まったら呼ばれる */
    onPause() {
      playController.toPause();
    },
    /* ホスト側からパラメータを操作したら呼ばれる */
    onAppParameterUpdate: (name, value) => parameterController.onParamChange(name, value),
    // 再生位置の情報が更新されたら呼ばれる 
    onTimeUpdate:(position)=> {
      const nowbeat = player.findBeat(position);
      // beatに合わせてカーソルを点滅
      if(beat !== nowbeat){
        if(beat){
          beattoggle=1-beattoggle;
          document.getElementById("cursor").style.opacity=""+beattoggle;
        }
        beat = nowbeat;
        // 2拍先を見据えて棒を作る
        const segnum = getSegNumber(position+nowbeat.duration*2);

        //beat.endTimeとseedパラメータに依存する
        Random.seed = Math.floor(nowbeat.endTime) + parameterController.get("Seed");

        // beatに合わせて背景に棒が流れる。
        // サビなら気持ち2倍
        for(let x=0;x< (segnum[0]===0 ? 6 : 2);x++){
          const newb= document.createElement("div");
          const w=Random.rand(1,100);
          const h=w*Random.random()/4;
          const bt=Random.rand(-25,125);
          // 大きいほどゆっくりと進む
          const dr=Math.max(5,w*h/100) * (segnum[0]===0 ? 0.4 : 1); // サビなら気持ち加速
          newb.style.width=`${w}vw`;
          newb.style.height=`${h}vw`;
          newb.style.bottom=`${bt}vh`;
          newb.style.animation=`back_moving ${dr}s linear 0s 1 forwards`;
          const seed = Random.seed;
          newb.style.backgroundColor = getBackColor(segnum, seed);
          document.getElementById("back").appendChild(newb);
          backgrouhndObject.push({type: "box",segnum: segnum,element: newb,seed: seed});
        }

      }
      // 歌詞情報がなければこれで処理を終わる
      if (!player.video.firstChar) {
        return;
      }
      // 巻き戻っていたら歌詞表示をリセットする
      if (char && char.startTime > position + 1000) {
        resetChars();
      }
      
      // 3000ms先に発声される言葉を取得
      let currentWord = word || player.video.firstWord;
      const word0 = word || player.video.firstWord;
      let putwords="";
      while ( currentWord && currentWord.startTime < position + 3000 ) {
        if(word !== currentWord){
          //(P:助詞, M: 助動詞, S : 記号)を連結
          putwords+=currentWord.text;
          console.log(currentWord.text ,currentWord);
          while(currentWord.next && currentWord.parent.lastWord !== currentWord
                && !isPreWord(currentWord.next) && !isEndWord(currentWord) && 
                  ( isPreWord(currentWord) || currentWord.pos=="S" || currentWord.next.pos == "P" ||
                    currentWord.next.pos === "M" ||  currentWord.next.pos == "S" || isSubWord(currentWord.next) || isEndWord(currentWord.next))){
            console.log(currentWord.text,currentWord.next, isPreWord(currentWord.next), !isEndWord(currentWord), isEndWord(currentWord), isSubWord(currentWord.next),isEndWord(currentWord.next));
            putwords+=currentWord.next.text;
            currentWord=currentWord.next;
            

          }
          word = currentWord;
        }
        currentWord = currentWord.next;
      }
      /* 終盤がサビにかぶっているならサビ判定を優先する */
      const wordstime = (getSegNumber(word.endTime)[0] === 0  ? word.endTime :  (word.endTime - word0.startTime)/2 + word0.startTime);
      /* "」「"が記号として1単語になってしまう…… */
      if(putwords!==""){
        
        console.log(putwords);
        
        if(putwords.indexOf("」「")){
          const ls = putwords.replace(/」「/g,"」↵「").split("↵");
          for(let i=0,t=0;i<ls.length;t+=ls[i].length,i++)
            setTimeout(()=>{putCharBack(ls[i], getSegNumber( wordstime+100*t ), wordstime+100*t, nowbeat.duration)}, 100*t);
        }else{
          putCharBack(putwords, getSegNumber( wordstime  ), wordstime, nowbeat.duration);
        }
      }

      // 25ms先に発声される文字を取得
      let current = char || player.video.firstChar;
      while (current && current.startTime < position + 25) {
        // 新しい文字が発声されようとしている
        if (char !== current) {
          isLFed=false;//次の文字が遠いときの改行をできるようにする
          newChar(current);
          char = current;
        }
        current = current.next;
      }
      //次の文字が遠い(beat*12)
      if(!isLFed&& current &&  position + beat.duration*12 < current.startTime) {
        putchar("↵");
        isLFed=true;
      }
    }
  });

});



/**
 * 文字出力queue
 */
let PUTCHAR_QUEUE=[];
/**
 * 文字列をまとめて出力QUEUEに追加
 * @param c 文字列
 */
function putchar(c){
  for(let i=0;i<c.length;i++){
    addchar(c[i]);
  }
}
/**
 * 文字をQUEUEに追加
 * @param c 文字
 */
function addchar(c){
  if(c=='↵'){
    PUTCHAR_QUEUE.push("<span class='newlinemark"+(NewLineMark!=="crlf"? " "+NewLineMark : "")+"' style='opacity:0.5'></span><br>");
  }else{
    PUTCHAR_QUEUE.push("<span>"+c+"</span>");
  }
}

/**
 * 背景用文字出力queue
 */
let PUTCHARBACK_QUEUE=[];

/**
 * 文字列をまとめて出力QUEUEに追加(背景用)
 * @param c 文字列
 * @param segment セグメント値（色が変わる）
 */
function putCharBack(c, segment,startTime, beatduaration){
  PUTCHARBACK_QUEUE.push([c, segment, Math.floor(startTime), beatduaration]);
}

/**
 * 現在時刻のセグメント段番号(仮称)を出力
 * @param time 時刻
 */

function getSegNumber(time){
  let ans=[];
  for(let i=0; i<segments.length; i++){
    Array.from(segments[i].segments, (z)=>{
      if(z.contains(time)) ans.push(i);
    });
  }
  return ans;
}

//* アニメーションを使う
let animationTriger3 = 0;
let animationFunc = ()=>{
  
  if(player?.isPlaying && PUTCHARBACK_QUEUE.length!=0){


    const [char, segnum, startTime, duration] = PUTCHARBACK_QUEUE[0];
    // 開始位置とシード値依存の乱数生成
    Random.seed = startTime + parameterController.get("Seed");
    const nchar= document.createElement("div");
    nchar.classList.add("char");
    if(segnum[0]===0) nchar.classList.add("chorus");
    nchar.innerText=char;
    nchar.style.width = `${char.length*2}em`
    const dr = Random.rand(11,13) * (segnum[0]===0 ? 0.7 : 1); // サビなら気持ち加速
    const bt=Random.rand(0,90);
    const seed = Random.seed;
    nchar.style.color = getBackColor(segnum,seed);
    nchar.style.animation=`back_moving ${dr}s linear 0s 1 forwards` + (segnum[0]===0 ? "" : `, back_rotate ${duration*2}ms linear 0s infinite alternate`);
    nchar.style.bottom=`${bt}vh`;
    backgrouhndObject.push({type: "char",segnum: segnum,element: nchar,seed: seed});

    document.getElementById("back").appendChild(nchar);
    PUTCHARBACK_QUEUE.shift();

  }


  if(!animationTriger3){
    //3fpsごとにタイピング
    if(player?.isPlaying &&PUTCHAR_QUEUE.length!=0){
      document.querySelector("#text").insertAdjacentHTML("beforeend",PUTCHAR_QUEUE[0]);
      PUTCHAR_QUEUE.shift();
    }
  }
  animationTriger3=(animationTriger3+1)%3;
  requestAnimationFrame(animationFunc);
};

animationFunc();
 
/**
 * カーソル位置を基準に回転
 */
window.addEventListener("mousemove", event => {
  let x = (event.clientX - window.innerWidth/2)/window.innerWidth,y= (event.clientY - window.innerHeight/2)/window.innerHeight;
  /* 法線ベクトル(0,0,1)と(x,y,1) */
  document.getElementById("console").style.transform=`rotateX(${-y/8}turn) rotateY(${x/8}turn) `;
});
/**
 * RGB値からHSL値を取得
 * @param rgb 
 */
function rgb2hsl(rgb){
  const [r,g,b] = [(rgb&0xff0000)>>16, (rgb&0x00ff00)>>8, rgb&0x0000ff];
  const mx = Math.max(r,g,b), mn =Math.min(r,g,b) ;
  let hsl={h:0, s:0,l:(mx+mn)/2};
  if(mx!==mn){
    if(mx == r) hsl.h = 60*(g-b)/(mx-mn);
    if(mx == g) hsl.h = 60*(b-r)/(mx-mn) + 120;
    if(mx == b) hsl.h = 60*(r-g)/(mx-mn) + 240;
    if(hsl.l <=127) hsl.s = (mx-mn)/(mx+mn);
    else            hsl.s = (mx-mn)/(510-mx-mn);
  }
  if(hsl.h<0) hsl.h+=360;
  hsl.h = Math.round(hsl.h);
  hsl.s = Math.round(hsl.s*100);
  hsl.l = Math.round(hsl.l/255*100);
  return hsl;
}

    // 繰り返し区間のパターンで色相を選ぶ。サビ(=0)ならちょうど赤。もともとサビのあった場所の色相が欠けるのはあまり目立たないので……
function getBackColor(segnum, seed:number){
  const hsl = rgb2hsl(parameterController.get("chorusColor"));
  hsl.h += ((isNaN(segnum[0]) ? segments.length/2 : segnum[0] )*2 + Random.random(seed)-0.5) / segments.length/2 *360;
  hsl.h %=360;
  return `hsl(${hsl.h},${hsl.s}%,${hsl.l}%)`;
}


/**
 * 文節のいい感じの接続とかMeCabの判定の訂正とかは
 * 人力で頑張るしかなさそうですね……
 * 
 */



const prewords={
  A:new Set(["この","その","あの","どの"]),
  S:new Set(["「"])
};

/**
 * "「"など語頭そうなものならtrue;
 * @param word 
 */
function isPreWord(word: IWord){
  return prewords[word.pos]?.has(word.text) || word.pos=="F";
}
//「歩き出す「ん」だ」
//ブレス・ユア・ブレスで「だけどその羽ばたき「で」」が動詞扱いされているのを確認
const subwords={
  N:new Set(["ん","の","日","度","人","色","なし"]),
  V:new Set(["く","てる","ている","ない","無い","しまっ","で","い","て","でき"]),
  J:new Set(["ない"])
};
//「さぁ、「ミ」「ライ」へ―」になっているのを確認
// V+出し　等
const joinables={
  N:new Set(["たち","達","点","ない","無い"]),
  V:new Set(["こと","訳","ワケ"]),
  P:new Set(["良い","み"])
}
  /**
 * "く"など末尾にくっつきそうなものならtrue;
 * @param word 
 */
function isSubWord(word: IWord){

  // subwordsに含まれる||連続する単語のposが等しい|| joinableで指定した者たち
  return word&&(subwords[word.pos]?.has(word.text) || (word.previous?.pos === word.pos) || joinables[word.previous?.pos]?.has(word.text));
}
const endwords={
  S:new Set(["、","。","！"])
};
/**
 * "、"など終了させる単語true;
 * @param word 
 */
function isEndWord(word: IWord){
  // endwordsに含まれる&&次の文字が終了文字でない
  return word&&(endwords[word.pos]?.has(word.text) && ( !endwords[word.next?.pos]?.has(word.next?.text)));
}

