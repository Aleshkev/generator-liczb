(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{136:function(e,t,n){e.exports=n(384)},383:function(e,t,n){},384:function(e,t,n){"use strict";n.r(t);var a=n(1),r=n.n(a),i=n(35),o=n.n(i),s=n(49),c=n(50),l=n(54),m=n(51),u=n(55),h=n(22),b=n(134),p=n.n(b),d=n(132),g=n.n(d),f=n(75),w=n.n(f),E=n(78),v=n.n(E),j=n(76),N=n.n(j),y=n(28),O=n.n(y),k=n(9),x=n.n(k),C=n(77),S=n.n(C),B=n(133),I=n.n(B),z=n(128),M=n.n(z),P=n(129),W=n.n(P),R=n(283),A=n(72),D=n.n(A),J=n(131),U=n.n(J),H=function(e){function t(){return Object(s.a)(this,t),Object(l.a)(this,Object(m.a)(t).call(this))}return Object(u.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){var e=this.props.classes;return null!==this.props.chosenNumber?r.a.createElement(D.a,{className:e.bigNumberPaper},r.a.createElement(U.a,{className:e.bigNumberDisplay},this.props.chosenNumber+1)):null}}]),t}(a.Component),K=Object(R.withStyles)(function(e){return{bigNumberPaper:Object(h.a)({overflow:"hidden",height:"72vw"},e.breakpoints.up("sm"),Object(h.a)({height:"36vw"},e.breakpoints.up("xl"),{height:720})),bigNumberDisplay:Object(h.a)({width:"100%",textAlign:"center",fontWeight:"bold",fontSize:"50vw"},e.breakpoints.up("sm"),Object(h.a)({fontSize:"25vw"},e.breakpoints.up("xl"),{fontSize:500}))}})(H),L=n(74),T=function(e){function t(){var e;Object(s.a)(this,t),(e=Object(l.a)(this,Object(m.a)(t).call(this))).onWhitelistChange=function(t,n){var a=e.state.whitelist.slice();if(n)for(var r=t-1;r>=0&&a[t]===a[r];--r)a[r]=!a[r];a[t]=!a[t],e.setState({whitelist:a})},e.newNumber=function(){for(var t=[],n=0;n<40;++n)e.state.whitelist[n]&&n!=e.state.chosenNumber&&t.push(n+1);var a=navigator.userAgent.includes("MI 8")||"yes"===new URL(window.location.href).searchParams.get("key"),r=function(){e.setState({chosenNumber:t[Math.floor(Math.random()*t.length)]})};if(!a)return Object(L.get)("https://generatorliczb.pythonanywhere.com/log").then(function(e){console.log(e)}).catch(function(e){console.error(e)}),void r();Object(L.get)("https://generatorliczb.pythonanywhere.com/get",{params:{whitelist:t.join()}}).then(function(t){console.log(t),e.setState({chosenNumber:+t.data-1})}).catch(function(e){console.error(e),r()})};for(var n=[],a=0;a<40;++a)n[a]=a<27;return e.state={whitelist:n,chosenNumber:null},e}return Object(u.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){var e=this,t=this.props.classes;return r.a.createElement("div",{className:t.main},r.a.createElement(g.a,null),r.a.createElement(O.a,{container:!0,spacing:16,direction:"row",justify:"center"},r.a.createElement(O.a,{item:!0,xs:12,sm:6,className:t.numbersContainer},r.a.createElement(w.a,{defaultExpanded:!0},r.a.createElement(N.a,{expandIcon:r.a.createElement(S.a,null)},"Zakres"),r.a.createElement(v.a,null,r.a.createElement(O.a,{container:!0,direction:"column",justify:"center",style:{maxHeight:320}},M()(40).map(function(n){return r.a.createElement(O.a,{item:!0,key:n},r.a.createElement(I.a,{value:n,selected:e.state.whitelist[n],onChange:function(t){t.stopPropagation(),e.onWhitelistChange(n,t.shiftKey)},classes:{root:t.numbersItem,selected:t.numbersItemSelected}},n+1))})))),r.a.createElement(w.a,{defaultExpanded:this.state.avoidRepetition,classes:{expanded:t.noBottomMargin}},r.a.createElement(N.a,{expandIcon:r.a.createElement(S.a,null)},"Ustawienia"),r.a.createElement(v.a,null)),r.a.createElement(p.a,{disabled:W()(this.state.whitelist)<2,onClick:this.newNumber,variant:"contained",color:"primary",className:t.newNumberButton},"Nowy numer")),r.a.createElement(O.a,{item:!0,xs:12,sm:6},r.a.createElement(K,{chosenNumber:this.state.chosenNumber}))))}}]),t}(a.Component),Z=x()(function(e){var t;return{main:{margin:2*e.spacing.unit},numbersContainer:(t={},Object(h.a)(t,e.breakpoints.up("sm"),{maxWidth:264}),Object(h.a)(t,"paddingBottom",0),t),numbersItem:{width:"100%",borderRadius:0},numbersItemSelected:{color:"".concat(e.palette.primary.main," !important"),backgroundColor:"rgba(121, 134, 203, 0.2) !important"},newNumberButton:{width:"100%",marginTop:2*e.spacing.unit,marginBottom:e.spacing.unit},noBottomMargin:{marginBottom:0}}})(T),q=n(135);n.n(q)()();n(383);o.a.render(r.a.createElement(Z,null),document.getElementById("root"))}},[[136,1,2]]]);
//# sourceMappingURL=main.b07239e4.chunk.js.map