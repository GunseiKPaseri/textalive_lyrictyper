interface PlayCotrollerCallback extends Object {
  onPlayClick: Function;
  onPauseClick: Function;
  onPlayStart: Function;
  onPlayResume: Function;
  onPlayStop: Function;
}

/**
 * 再生・停止ボタン周辺のモジュール
 */
export class PlayController{
  private isPlayed :boolean = false;
  /* 再生を始めたらtrueを返す */
  private callback :PlayCotrollerCallback={
      /**
       * プレイヤーで再生が開始したらtrueを返す関数 
       */
      onPlayClick: ()=>{return false},
      /* プレイヤーで停止したらfalseを返す関数 */
      onPauseClick: ()=>{return false},
      /* 実際に再生が開始したとき実行する関数 */
      onPlayStart: ()=>{return false},
      onPlayResume: ()=>{return false},
      /* 実際に再生が停止したとき実行する関数 */
      onPlayStop: ()=>{return false}
    };

  constructor(){}

  /**
   * 初期化します
   * @param funcobj {PlayCotrollerCallback} コールバック関数群
   */
  public init(funcobj :Object){
    Object.assign(this.callback,funcobj);

    window.addEventListener('DOMContentLoaded',(event)=>{
      // PLAY BUTTON LISTENER
      Array.from(document.querySelectorAll('.play-button'), (x)=>{
        x.addEventListener("click",(e)=>{
          e.preventDefault();
          // 再生ボタンクリック時
          if(this.callback.onPlayClick) this.callback.onPlayClick();
        });
      });
      Array.from(document.querySelectorAll('.prev-button'), (x)=>{
        x.addEventListener("click",(e)=>{
          e.preventDefault();
          // 再生ボタンクリック時
          
          if(this.callback.onPauseClick){
            this.isPlayed=this.callback.onPauseClick();
          }
        });
      });
    });

    
  }
  
  /**
   * 停止をボタンに反映させ、onPlayStop()を実行する関数です
   */
  public toPause(){
    if(this.callback.onPlayStart)this.callback.onPlayStop();
    Array.from(document.querySelectorAll('.play-button'), (y) =>{
      y.classList.remove("playing");
    });
  }
  /**
   * 再生をボタンに反映させonPlayStart()(先頭再生時)とonPlayResume()を実行する関数です
   */
  public toPlay(){
    if(this.callback.onPlayResume)this.callback.onPlayResume();
    if(!this.isPlayed){
      if(this.callback.onPlayStart)this.callback.onPlayStart();
      this.isPlayed=true;
    }
    document.querySelector("#overlay").classList.add("hidden");
    Array.from(document.querySelectorAll('.play-button'), (y) =>{
      y.classList.add("playing");
    });
  }
}