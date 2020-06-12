import { Component , OnInit} from '@angular/core';
import { ActivatedRoute } from "@angular/router"
@Component({
	selector : 'error-page' ,
	template : `	<nav class="shelf">
	  <a class="book home-page" href='./'>主页</a>
	  <a class="book about-us">
	  	<span style='opacity:0'>asdasd</span>
	  </a>
	  <a class="book contact" (click)="goBack()">返回上一页</a>
	  <a class="book faq"></a>


	  <span class="door left"></span>
	  <span class="door right"></span>
	</nav>
	<p>{{desc}}</p>
	<h1 style='color:#fff'>Error {{code}}</h1>` ,
	styles : [`
	@import url(https://fonts.googleapis.com/css?family=Dancing+Script:400,700);
:host {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  margin: 0;
  padding: 0;
  background-color: #446072;
  font-family: "Microsoft YaHei",sans-serif;
  color: white;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
      -ms-flex-pack: center;
          justify-content: center;
  -webkit-box-align: center;
  -webkit-align-items: center;
      -ms-flex-align: center;
          align-items: center;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
      -ms-flex-direction: column;
          flex-direction: column;
  overflow: hidden;
  height:100%;
}
h1 {
}
p{
  font-family: "Microsoft YaHei","Segoe UI", "Lucida Grande", Helvetica, Arial,sans-serif;font-size: 24px;margin-top: 2rem;
}
.shelf {
  position: relative;
  width: 30rem;
  height: 16rem;
  border: 0.5rem solid #374d5b;
  border-radius: 0.5rem;
  background-color: rgba(255, 255, 255, 0.1);
  -webkit-perspective: 130rem;
  perspective: 130rem;
  box-shadow: inset 0 0 2rem rgba(0, 0, 0, 0.2);
}
.door {
  position: absolute;
  width: 14.8rem;
  height: 15rem;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  box-sizing: border-box;
  padding: 1rem;
  background-color: #374d5b;
  -webkit-box-align: center;
  -webkit-align-items: center;
      -ms-flex-align: center;
          align-items: center;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
}
.door::before {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.1);
  content: "";
}
.door.left {
  border-radius: 0 0.75rem 0.75rem 0;
  -webkit-box-pack: end;
  -webkit-justify-content: flex-end;
      -ms-flex-pack: end;
          justify-content: flex-end;
  -webkit-animation:
      leftDoorOpen 3.5s ease-out forwards 1s,
      leftDoorFlap 15s linear infinite forwards 9s;
          animation:
      leftDoorOpen 3.5s ease-out forwards 1s,
      leftDoorFlap 15s linear infinite forwards 9s;
  -webkit-transform-origin: 0 0 0;
          transform-origin: 0 0 0;
}
.door.right {
  right: 0;
  border-radius: 0.75rem 0 0 0.75rem;
  -webkit-animation:
      rightDoorOpen 3s ease-out forwards 1.5s,
      rightDoorFlap 10s linear infinite forwards 8s;
          animation:
      rightDoorOpen 3s ease-out forwards 1.5s,
      rightDoorFlap 10s linear infinite forwards 8s;
  -webkit-transform-origin: 100% 0 0;
          transform-origin: 100% 0 0;
}
.book {
  position: absolute;
  box-sizing: border-box;
  padding: 0.8rem 4rem 0.8rem 2rem;
  border-radius: 0.25rem;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.1rem;
  cursor: pointer;
  box-shadow: inset 0 0 0.75rem rgba(255, 255, 255, 0.1);
}
.book.home-page {
  -webkit-transform: rotate(-90deg) translate(-12.4rem, 3rem);
          transform: rotate(-90deg) translate(-12.4rem, 3rem);
  -webkit-transform-origin: 0;
          transform-origin: 0;
}
.book.about-us {
  -webkit-transform: rotate(-100deg) translate(-13.4rem, 6.1rem);
          transform: rotate(-100deg) translate(-13.4rem, 6.1rem);
  -webkit-transform-origin: 0;
          transform-origin: 0;
}
.book.contact {
  right: 2rem;
  bottom: 0.2rem;
  border-radius: 0.3rem 0 0 0.3rem;
}
.book.faq {
  right: 0.8rem;
  bottom: 3.3rem;
  border-radius: 0.3rem 0 0 0.3rem;
}
.book:hover:not(.not-found) {
  background-color: rgba(255, 255, 255, 0.2);
}
@-webkit-keyframes leftDoorOpen {
  60% {-webkit-transform: rotateY(-115deg);transform: rotateY(-115deg)}
  100% {-webkit-transform: rotateY(-110deg);transform: rotateY(-110deg)}
}
@keyframes leftDoorOpen {
  60% {-webkit-transform: rotateY(-115deg);transform: rotateY(-115deg)}
  100% {-webkit-transform: rotateY(-110deg);transform: rotateY(-110deg)}
}
@-webkit-keyframes rightDoorOpen {
  60% {-webkit-transform: rotateY(125deg);transform: rotateY(125deg)}
  100% {-webkit-transform: rotateY(120deg);transform: rotateY(120deg)}
}
@keyframes rightDoorOpen {
  60% {-webkit-transform: rotateY(125deg);transform: rotateY(125deg)}
  100% {-webkit-transform: rotateY(120deg);transform: rotateY(120deg)}
}
@-webkit-keyframes rightDoorFlap {
  0% { -webkit-transform: rotateY(120deg); transform: rotateY(120deg)}
  5% {-webkit-transform: rotateY(125deg);transform: rotateY(125deg)}
  15% {-webkit-transform: rotateY(117deg);transform: rotateY(117deg)}
  25% {-webkit-transform: rotateY(123deg);transform: rotateY(123deg)}
  30% {-webkit-transform: rotateY(120deg);transform: rotateY(120deg)}
  100% {-webkit-transform: rotateY(120deg);transform: rotateY(120deg)}
}
@keyframes rightDoorFlap {
  0% { -webkit-transform: rotateY(120deg); transform: rotateY(120deg)}
  5% {-webkit-transform: rotateY(125deg);transform: rotateY(125deg)}
  15% {-webkit-transform: rotateY(117deg);transform: rotateY(117deg)}
  25% {-webkit-transform: rotateY(123deg);transform: rotateY(123deg)}
  30% {-webkit-transform: rotateY(120deg);transform: rotateY(120deg)}
  100% {-webkit-transform: rotateY(120deg);transform: rotateY(120deg)}
}
@-webkit-keyframes leftDoorFlap {
  0% { -webkit-transform: rotateY(-110deg); transform: rotateY(-110deg)}
  5% {-webkit-transform: rotateY(-115deg);transform: rotateY(-115deg)}
  15% {-webkit-transform: rotateY(-107deg);transform: rotateY(-107deg)}
  25% {-webkit-transform: rotateY(-113deg);transform: rotateY(-113deg)}
  30% {-webkit-transform: rotateY(-110deg);transform: rotateY(-110deg)}
  100% {-webkit-transform: rotateY(-110deg);transform: rotateY(-110deg)}
}
@keyframes leftDoorFlap {
  0% { -webkit-transform: rotateY(-110deg); transform: rotateY(-110deg)}
  5% {-webkit-transform: rotateY(-115deg);transform: rotateY(-115deg)}
  15% {-webkit-transform: rotateY(-107deg);transform: rotateY(-107deg)}
  25% {-webkit-transform: rotateY(-113deg);transform: rotateY(-113deg)}
  30% {-webkit-transform: rotateY(-110deg);transform: rotateY(-110deg)}
  100% {-webkit-transform: rotateY(-110deg);transform: rotateY(-110deg)}
}
@-webkit-keyframes bookFadeOut {
  50% {border: 1px dashed rgba(255, 255, 255, 0.1);}
}
@keyframes bookFadeOut {
  50% {border: 1px dashed rgba(255, 255, 255, 0.1);}
}
	`]
})
export class ErrorPageComponent implements OnInit{
	constructor(
		private routerInfo : ActivatedRoute
	){};

	code : string ;
	desc : string
	ngOnInit(){
		this.code = this.routerInfo.snapshot.params['code'] ;
		if(this.code == '404'){
			this.desc = '糟糕,你要找的东西消失在时空裂缝里面了'
		};

		if(this.code == '500'){
			this.desc = '糟糕,服务器表示我崩溃了';
		};

		if(this.code == '403' || this.code == '401'){
			this.desc = '糟糕,您没有此权限哦' ;
		};
    // if(this.code == '401'){
    //   this.desc = '糟糕,账户被冻结了' ;
    // }
  }
  goBack(){
    history.go(-2);
  }
};
