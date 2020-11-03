import dat from "dat.gui";
import { Color } from "textalive-app-api";

interface NumParameter extends Parameter {
    params: [number, number];
    initialValue: number;
    className: "Slider";
}
interface CheckParameter extends Parameter {
    initialValue: boolean;
    className: "Check";
}
interface ColorRGB extends Object{
    r:number;
    g:number;
    b:number;
}
interface ColorParameter extends Parameter {
    initialValue: string | ColorRGB;
    className: "Color";
}
interface SelectParameter extends Parameter {
    params: Array<[string,string]>;
    initialValue: string;
    className: "Select";
}
interface Parameter extends Object {
    title: string;
    name: string;
    className: string;
    onChange: Function;
}

/**
 * パラメータを一元管理するクラス
 */
export class ParameterController{
    private params: Array<NumParameter|CheckParameter|ColorParameter|SelectParameter>;
    private datparams:{[s:string]: any} ={} ;
    /**
     * 
     * @param x パラメータ配列
     */
    constructor(x: Array<NumParameter|CheckParameter|ColorParameter|SelectParameter>){
        /**
         * パラメータ管理
         * @type {Object}
         */
        this.params = x;
        
        window.addEventListener('DOMContentLoaded',(event)=>{
            const gui = new dat.GUI(null);
            Array.from(this.params, (y) =>{
                this.datparams[y.title] = y.initialValue;
            });
            Array.from(this.params, (y) =>{
                switch(y.className){
                    case "Select":
                        let option:{[s:string]: string} = {};
                        Array.from(y.params, (z) =>{
                            option[z[1]] = z[0];
                        });
                        gui.add(this.datparams, y.title, option).onFinishChange(()=>{y.onChange(this.datparams[y.title])});
                        break;
                    case "Color":
                        gui.addColor(this.datparams, y.title).onFinishChange(()=>{y.onChange(this._getColor(this.datparams[y.title]))});
                        break;
                    case "Check":
                        gui.add(this.datparams, y.title).onFinishChange(()=>{y.onChange(this.datparams[y.title])});
                        break;
                    case "Slider":
                        gui.add(this.datparams, y.title,y.params[0], y.params[1]).step(1).onFinishChange(()=>{y.onChange(this.datparams[y.title])});
                        break;
                }
            });
            gui.close();
            // dat.GUI 最前面
            var style = document.createElement('style');
            style.append(".dg.ac { z-index: 1500 !important; }");
            document.head.appendChild(style);
        });


    }
    /**
     * Player引数取得
     * @param name 
     * @return {Object} Player引数用Object
     */
    public getPlayerParams(){
        const cloned=[];
        //不要な要素を除去しながら配列内のオブジェクトをそれぞれクローン
        Array.from(this.params, (y)=>{
            const clonedobj={};
            for(const key in y){
                if(key!=="onChange") clonedobj[key]=y[key];
            }
            cloned.push(clonedobj);
        });
        return cloned;
    }
    /**
     * パラメータの変更を反映する
     * @param name {string} パラメータ名
     * @param value {any} パラメータ値
     */
    public onParamChange(name :string, value){
        const found = this.params.find(element => element.name===name);
        if(found){
            if(found.className === "Color"){
                this.datparams[found.title] = this._getColor(value);
            }
            found.onChange(value);
        }
    }
    /**
     * パラメータ値を取得
     * @param name パラメータ名
     * @return {any} パラメータ値
     */
    public get(name :string){
        let found = this.params.find(element => element.name===name);
        return (found.className=="Color") ? this._getColor(this.datparams[found.title]) : this.datparams[found.title];
    }
    /**
     * 色情報から色値を取得(0x000000<x<0xffffff)
     * @param name 
     * @return {any} パラメータ値
     */
    private _getColor(value: any){
        if(value.rgb){
            return value.value;
        }
        if(0<=value.r){
            return Math.floor(value.r)*256*256 + Math.floor(value.g)*256+Math.floor(value.b);
        }
        return (isNaN(value)) ? parseInt(value.replace("#", ""), 16) : value;
    }
}