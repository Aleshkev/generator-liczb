(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{163:function(e,t,n){},252:function(e,t,n){"use strict";n.r(t);var a=n(86);n.n(a)()();for(var r=n(1),i=n.n(r),o=n(29),c=n.n(o),s=(n(163),n(88)),l=n(89),u=n(97),m=n(90),h=n(98),d=n(31),b=n(92),p=n.n(b),f=n(96),g=n.n(f),v=n(95),w=n.n(v),E=n(94),O=n.n(E),j=n(25),N=n.n(j),y=n(49),x=n.n(y),k=n(53),B=n.n(k),C=n(56),S=n.n(C),I=n(54),R=n.n(I),W=n(50),z=n.n(W),D=n(8),J=n.n(D),M=n(55),U=n.n(M),A=n(93),H=n.n(A),T=n(17),Z=n(91),$=n.n(Z),q={1:20,25:500,19:200,27:200},F=1;F<=40;++F)void 0===q[F]&&(q[F]=100);var G=function(e){return e.length>4&&Object(T.max)(e)<=29};function K(e){if(!G(e))return e;var t=[],n=!0,a=!1,r=void 0;try{for(var i,o=e[Symbol.iterator]();!(n=(i=o.next()).done);n=!0)for(var c=i.value,s=0;s<q[c];++s)t.push(c)}catch(l){a=!0,r=l}finally{try{n||null==o.return||o.return()}finally{if(a)throw r}}return t}var L=[],P=0;function Q(e,t,n){return n?function e(t,n){for(;P<L.length&&-1===t.indexOf(L[P]);)++P;if(P<L.length)return L[P++];var a=K(Object(T.range)(1,41));L=[];for(var r=function(){var e=a[Object(T.random)(0,a.length-1)];Object(T.remove)(a,function(t){return t===e}),L.push(e)};a.length>0;)r();return console.log("planned:",L),P=0,e(t)}(e):function(e,t){e.length>2&&Object(T.remove)(e,function(e){return e===t[t.length-1]});var n=K(e);return n[Object(T.random)(0,n.length-1)]}(e,t)}var V=function(e){function t(){var e;return Object(s.a)(this,t),(e=Object(u.a)(this,Object(m.a)(t).call(this))).onWhitelistChange=function(t){var n=e.state.whitelist.slice();-1===n.indexOf(t)?n.push(t):n.splice(n.indexOf(t),1),e.setState({whitelist:n})},e.newNumber=function(){var t=Q(e.state.whitelist.slice(),e.state.chosenNumbers.slice(),e.state.avoidRepetition);e.state.chosenNumbers.push(t),e.setState({chosenNumbers:e.state.chosenNumbers})},e.state={whitelist:Object(T.range)(1,8),avoidRepetition:!1,chosenNumbers:[-1]},e}return Object(h.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){var e=this,t=this.props.classes;return i.a.createElement("div",{className:t.main},i.a.createElement(p.a,null),i.a.createElement(N.a,{container:!0,spacing:16,direction:"row",justify:"center"},i.a.createElement(N.a,{item:!0,xs:12,sm:6,className:t.numbersContainer},i.a.createElement(B.a,{defaultExpanded:!0},i.a.createElement(R.a,{expandIcon:i.a.createElement(U.a,null)},"Zakres"),i.a.createElement(S.a,null,i.a.createElement(N.a,{container:!0,direction:"column",justify:"center",style:{maxHeight:320}},Object(T.range)(1,41).map(function(n){return i.a.createElement(N.a,{item:!0,key:n},i.a.createElement(H.a,{value:n,selected:-1!==e.state.whitelist.indexOf(n),onChange:function(t){return e.onWhitelistChange(n)},classes:{root:t.numbersItem,selected:t.numbersItemSelected}},n))})))),i.a.createElement(B.a,{classes:{expanded:t.noBottomMargin}},i.a.createElement(R.a,{expandIcon:i.a.createElement(U.a,null)},"Ustawienia"),i.a.createElement(S.a,null,i.a.createElement(O.a,{control:i.a.createElement(w.a,{checked:this.state.avoidRepetition,onChange:function(){return e.setState({avoidRepetition:!e.state.avoidRepetition})}}),label:"Unikaj powt\xf3rze\u0144"}))),i.a.createElement(g.a,{disabled:this.state.whitelist.length<2,onClick:this.newNumber,variant:"contained",color:"primary",className:t.newNumberButton},"Nowy numer")),i.a.createElement(N.a,{item:!0,xs:12,sm:6},i.a.createElement(x.a,null,i.a.createElement(z.a,{className:t.bigNumberDisplay},this.state.chosenNumbers.length>1?this.state.chosenNumbers[this.state.chosenNumbers.length-1]:"")))))}}]),t}(r.Component),X=J()(function(e){var t;return{main:{margin:2*e.spacing.unit},numbersContainer:(t={},Object(d.a)(t,e.breakpoints.up("sm"),{maxWidth:264}),Object(d.a)(t,"paddingBottom",0),t),numbersItem:{width:"100%",borderRadius:0},numbersItemSelected:{color:"".concat(e.palette.primary.main," !important"),backgroundColor:"".concat($()(e.palette.primary.light).alpha(.2)," !important")},bigNumberDisplay:Object(d.a)({width:"100%",textAlign:"center",fontWeight:"bold",fontSize:"50vw"},e.breakpoints.up("sm"),Object(d.a)({fontSize:"25vw"},e.breakpoints.up("xl"),{fontSize:500})),newNumberButton:{width:"100%",marginTop:2*e.spacing.unit,marginBottom:e.spacing.unit},noBottomMargin:{marginBottom:0}}})(V);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(i.a.createElement(X,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},99:function(e,t,n){e.exports=n(252)}},[[99,2,1]]]);
//# sourceMappingURL=main.578d7456.chunk.js.map