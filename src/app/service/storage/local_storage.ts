import { Injectable } from '@angular/core' ;

const typeMethod = {
	checkType : function (val : any , type : string) : boolean{
		return Object.prototype.toString.call(val) === `[object ${type}]`
	},
	getType : function( val : any){
		let type = Object.prototype.toString.call(val);

		let reg = / \w+/g ;

		return type.match(reg)[0].trim()
	}
};
let ls = window.localStorage ;
let isType = function(type,obj){
	return Object.prototype.toString.call(obj) === '[object '+type+']';
};
@Injectable()
export class LocalStorageService{
	set = function(name,value){
		// if(type){
		// 	if( isType("String",value) ){
		// 		ls[name] = value;
		// 	}else{
		// 		ls[name] = JSON.stringify(value);
		// 	};
		// }
		if( isType("String",value) ){
			ls[name] = value;
		}else{
			ls[name] = JSON.stringify(value);
		};
		return this;
	};

	get = function(name){
		var value = ls[name];
		try{
			return JSON.parse(value)
		}catch(e){
			return value
		};
	};
	remove = function(arr){
		for(var key in arr){
			ls.removeItem(arr[key]);
		};
		return this;
	};
	clear = function(){
		ls.clear();
		return this;
	};
	isEmpty = function(name){
		var obj = this.get(name);

		isType("String",obj) && ( (function(){
			return obj.length === 0 || obj === undefined || obj === null;
		})());

		isType("Object",obj) && ((function(){
			for(var keys in obj){
				if(!obj.hasOwnProperty(keys))
					return true;
			};
		})());
	};
	isExist = function(name){
		var obj = this.get(name);
		return !!obj && !this.isEmpty(name);
	};
	upDate = function(name,key){
		var obj = ls[name];
		try{
			var data = JSON.parse(obj);
			if(isType("Number",data)){
				ls[name] = key;
			}else{
				for(var keys in key){
					data[keys] = key[keys];
				};
				this.set(name,data);
			};
		}catch(e){
			ls[name] = key;
		};
		return this;
	};
};
