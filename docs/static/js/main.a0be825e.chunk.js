(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{213:function(e,t,n){e.exports=n(356)},271:function(e,t,n){},356:function(e,t,n){"use strict";n.r(t);var a=n(104);Object(a.a)();var i=n(1),r=n.n(i),o=n(30),s=n.n(o),c=(n(271),n(106)),l=n(107),m=n(111),u=n(108),h=n(112),d=n(39),p=n(9),b=n(18),g=n(63),w=n(64),f=n.n(w),v=n(110),E=n(109),N=function(e){function t(){var e;return Object(c.a)(this,t),(e=Object(m.a)(this,Object(u.a)(t).call(this))).onWhitelistChange=function(t){var n=e.state.whitelist.slice();-1==n.indexOf(t)?n.push(t):n.splice(n.indexOf(t),1),e.setState({whitelist:n})},e.newNumber=function(){var t=e.state.whitelist.slice();if(0!==t.length){var n=e.state.chosenNumbers.slice(),a=n[n.length-1];-1!==t.indexOf(a)&&t.splice(t.indexOf(a),1);for(var i=0;i<100;++i){var r=Math.floor(Math.random()*t.length);console.log(r,t[r],t)}var o=t[Math.floor(Math.random()*t.length)];n.push(o),e.setState({chosenNumbers:n})}},e.n=40,e.state={whitelist:Object(g.range)(1,30),avoidRepetition:!1,chosenNumbers:[-1]},e}return Object(h.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){var e=this,t=this.props.classes;return r.a.createElement("div",{className:t.main},r.a.createElement(p.b,null),r.a.createElement(p.g,{container:!0,spacing:16,direction:"row",justify:"center"},r.a.createElement(p.g,{item:!0,xs:12,sm:6,className:t.numbersContainer},r.a.createElement(p.c,{defaultExpanded:!0},r.a.createElement(p.e,{expandIcon:r.a.createElement(f.a,null)},"Zakres"),r.a.createElement(p.d,null,r.a.createElement(p.g,{container:!0,direction:"column",justify:"center",style:{maxHeight:320}},Object(g.range)(1,this.n+1).map(function(n){return r.a.createElement(p.g,{item:!0,key:n},r.a.createElement(v.a,{value:n,selected:-1!==e.state.whitelist.indexOf(n),onChange:function(t){return e.onWhitelistChange(n)},classes:{root:t.numbersItem,selected:t.numbersItemSelected}},n))})))),r.a.createElement(p.c,{classes:{expanded:t.noBottomMargin}},r.a.createElement(p.e,{expandIcon:r.a.createElement(f.a,null)},"Ustawienia"),r.a.createElement(p.d,null,r.a.createElement(p.f,{control:r.a.createElement(p.i,{checked:this.state.avoidRepetition,onChange:function(){return e.setState({avoidRepetition:!e.state.avoidRepetition})}}),label:"Unikaj powt\xf3rze\u0144"}))),r.a.createElement(p.a,{disabled:this.state.whitelist.length<2,onClick:this.newNumber,variant:"contained",color:"primary",className:t.newNumberButton},"Nowy numer")),r.a.createElement(p.g,{item:!0,xs:12,sm:6},r.a.createElement(p.h,null,r.a.createElement(p.j,{className:t.bigNumberDisplay},this.state.chosenNumbers.length>1?this.state.chosenNumbers[this.state.chosenNumbers.length-1]:"")))))}}]),t}(i.Component),O=Object(b.withStyles)(function(e){return{main:{margin:2*e.spacing.unit},numbersContainer:Object(d.a)({},e.breakpoints.up("sm"),{maxWidth:264}),numbersItem:{width:"100%",borderRadius:0},numbersItemSelected:{color:"".concat(e.palette.primary.main," !important"),backgroundColor:"".concat(E(e.palette.primary.light).alpha(.2)," !important")},bigNumberDisplay:Object(d.a)({width:"100%",textAlign:"center",fontWeight:"bold",fontSize:"50vw"},e.breakpoints.up("sm"),Object(d.a)({fontSize:"25vw"},e.breakpoints.up("xl"),{fontSize:500})),newNumberButton:{width:"100%",marginTop:2*e.spacing.unit,marginBottom:e.spacing.unit},noBottomMargin:{marginBottom:0}}})(N);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));s.a.render(r.a.createElement(O,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[213,2,1]]]);
//# sourceMappingURL=main.a0be825e.chunk.js.map