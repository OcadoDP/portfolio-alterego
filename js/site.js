(function(){
"use strict";
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
var calm=false;try{calm=matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){}

/* reveal */
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('show');io.unobserve(e.target)}})},{threshold:.1});
$$('.reveal').forEach(function(e){io.observe(e)});

/* mobile menu */
var menu=$('.mobile-menu'),links=$('.nav-links');
if(menu&&links){
  menu.setAttribute('aria-expanded','false');
  menu.setAttribute('aria-controls','site-navigation');
  if(links.id==='')links.id='site-navigation';
  function closeMenu(){links.classList.remove('open');menu.setAttribute('aria-expanded','false')}
  menu.addEventListener('click',function(){var open=links.classList.toggle('open');menu.setAttribute('aria-expanded',open?'true':'false')});
  $$('.nav-links a').forEach(function(a){a.addEventListener('click',closeMenu)});
  addEventListener('keydown',function(e){if(e.key==='Escape')closeMenu()});
  addEventListener('click',function(e){if(links.classList.contains('open')&&!links.contains(e.target)&&e.target!==menu)closeMenu()});
}

/* scroll progress, to-top, glow */
var bar=document.createElement('div');bar.className='scroll-progress';document.body.appendChild(bar);
var top=document.createElement('button');top.className='totop';top.innerHTML='↑';top.setAttribute('aria-label','Back to top');document.body.appendChild(top);
top.onclick=function(){scrollTo({top:0,behavior:'smooth'})};
addEventListener('scroll',function(){var h=document.documentElement.scrollHeight-innerHeight;bar.style.width=(h>0?scrollY/h*100:0)+'%';top.classList.toggle('on',scrollY>700)},{passive:true});
if(!calm&&matchMedia('(hover:hover)').matches){var g=document.createElement('div');g.className='cursor-glow';document.body.appendChild(g);
addEventListener('mousemove',function(e){g.classList.add('on');g.style.transform='translate('+e.clientX+'px,'+e.clientY+'px)'},{passive:true})}

/* counters */
function count(el){var t=parseFloat(el.dataset.count),d=+(el.dataset.dec||0),pre=el.dataset.pre||'',suf=el.dataset.suf||'',s=performance.now(),D=1600;
(function f(n){var p=Math.min((n-s)/D,1),v=t*(1-Math.pow(1-p,3));el.textContent=pre+(d?v.toFixed(d):Math.round(v).toLocaleString())+suf;if(p<1)requestAnimationFrame(f)})(s)}
var cio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){calm?(e.target.textContent=(e.target.dataset.pre||'')+Number(e.target.dataset.count).toLocaleString(undefined,{minimumFractionDigits:+(e.target.dataset.dec||0)})+(e.target.dataset.suf||'')):count(e.target);cio.unobserve(e.target)}})});
$$('[data-count]').forEach(function(e){cio.observe(e)});

/* typed */
var ty=$('[data-typed]');
if(ty){var W=ty.dataset.typed.split('|'),wi=0,ci=0,del=false;
(function tick(){var w=W[wi];if(calm){ty.textContent=w;return}
ty.textContent=w.slice(0,ci);if(!del&&ci<w.length){ci++;setTimeout(tick,70)}else if(!del){del=true;setTimeout(tick,1500)}else if(ci>0){ci--;setTimeout(tick,35)}else{del=false;wi=(wi+1)%W.length;setTimeout(tick,300)}})()}

/* network canvas */
var cv=$('#hero-canvas');
if(cv&&!calm){var cx=cv.getContext('2d'),w,h,pts=[],m={x:null,y:null},dpr=Math.min(devicePixelRatio||1,2),vis=true;
function size(){w=cv.offsetWidth;h=cv.offsetHeight;cv.width=w*dpr;cv.height=h*dpr;cx.setTransform(dpr,0,0,dpr,0,0);var n=Math.min(Math.floor(w*h/15000),90);pts=[];for(var i=0;i<n;i++)pts.push({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35})}
size();addEventListener('resize',size);
addEventListener('mousemove',function(e){var r=cv.getBoundingClientRect();m.x=e.clientX-r.left;m.y=e.clientY-r.top},{passive:true});
new IntersectionObserver(function(e){vis=e[0].isIntersecting}).observe(cv);
(function draw(){requestAnimationFrame(draw);if(!vis)return;cx.clearRect(0,0,w,h);
for(var i=0;i<pts.length;i++){var p=pts[i];p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>w)p.vx*=-1;if(p.y<0||p.y>h)p.vy*=-1;
if(m.x!==null){var dx=p.x-m.x,dy=p.y-m.y,d=Math.hypot(dx,dy);if(d>0&&d<160){p.x+=dx/d*.9;p.y+=dy/d*.9}}
cx.fillStyle='rgba(197,30,45,.7)';cx.beginPath();cx.arc(p.x,p.y,1.6,0,6.3);cx.fill();
for(var j=i+1;j<pts.length;j++){var q=pts[j],dd=Math.hypot(p.x-q.x,p.y-q.y);if(dd<130){cx.strokeStyle='rgba(197,30,45,'+(.22*(1-dd/130))+')';cx.beginPath();cx.moveTo(p.x,p.y);cx.lineTo(q.x,q.y);cx.stroke()}}
if(m.x!==null){var md=Math.hypot(p.x-m.x,p.y-m.y);if(md<190){cx.strokeStyle='rgba(255,255,255,'+(.3*(1-md/190))+')';cx.beginPath();cx.moveTo(p.x,p.y);cx.lineTo(m.x,m.y);cx.stroke()}}}})()}

/* card spotlight + tilt */
$$('.project-card,.app-card,.edu-card').forEach(function(c){
c.addEventListener('mousemove',function(e){var r=c.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;c.style.setProperty('--mx',x+'px');c.style.setProperty('--my',y+'px');
if(!calm&&c.classList.contains('project-card')){c.style.setProperty('--rx',((y/r.height-.5)*-4)+'deg');c.style.setProperty('--ry',((x/r.width-.5)*5)+'deg');c.classList.add('tilting')}});
c.addEventListener('mouseleave',function(){c.classList.remove('tilting');c.style.removeProperty('--rx');c.style.removeProperty('--ry')})});

/* demo iframe scaler */
function scale(){$$('.browser-body').forEach(function(b){var f=$('iframe',b);if(f){var ratio=b.clientWidth/1440;f.style.transform='scale('+ratio+')';f.setAttribute('aria-hidden',ratio<.42?'true':'false')}})}
scale();addEventListener('resize',scale);if('ResizeObserver'in window)$$('.browser-body').forEach(function(b){new ResizeObserver(scale).observe(b)});
$$('.demo-switch button').forEach(function(b){b.onclick=function(){$$('.demo-switch button').forEach(function(x){x.classList.toggle('active',x===b)});$$('[data-pane]').forEach(function(p){p.classList.toggle('hidden',p.dataset.pane!==b.dataset.show)});var l=$('#ext-link');if(l)l.classList.toggle('hidden',b.dataset.show!=='html');scale()}});

/* skills */
var SK=window.SKILLS||[],tabs=$$('.skill-tab'),pn=$('#skill-panel');
if(tabs.length&&pn){pn.setAttribute('role','tabpanel');pn.setAttribute('tabindex','0');function show(i){var k=SK[i];tabs.forEach(function(t,j){t.setAttribute('aria-selected',j===i);t.setAttribute('tabindex',j===i?'0':'-1');t.setAttribute('aria-controls','skill-panel')});
pn.innerHTML='<h3>'+k.name+'</h3><p>'+k.desc+'</p><div class="proof"><small>Proof of work</small><h4>'+k.title+'</h4><p>'+k.ev+'</p><div class="case-meta">'+k.tags.map(function(t){return'<span>'+t+'</span>'}).join('')+'</div><a class="ext-link" href="'+k.href+'">Read case study →</a></div>'}
tabs.forEach(function(t,i){t.onclick=function(){show(i)};t.onmouseenter=function(){if(matchMedia('(hover:hover)').matches)show(i)};t.onkeydown=function(e){if(e.key==='ArrowDown'||e.key==='ArrowRight'){e.preventDefault();var n=(i+1)%tabs.length;tabs[n].focus();show(n)}else if(e.key==='ArrowUp'||e.key==='ArrowLeft'){e.preventDefault();var p=(i-1+tabs.length)%tabs.length;tabs[p].focus();show(p)}else if(e.key==='Home'){e.preventDefault();tabs[0].focus();show(0)}else if(e.key==='End'){e.preventDefault();tabs[tabs.length-1].focus();show(tabs.length-1)}}});show(0)}

/* experience accordion */
$$('.exp-btn').forEach(function(b){b.onclick=function(){var it=b.parentNode,o=it.classList.toggle('open');b.setAttribute('aria-expanded',o)}});

/* project filters */
var ch=$$('.chip');ch.forEach(function(c){c.onclick=function(){ch.forEach(function(x){x.classList.toggle('on',x===c)});$$('.project-card[data-cat]').forEach(function(p){p.classList.toggle('out',c.dataset.f!=='all'&&p.dataset.cat.indexOf(c.dataset.f)<0)})}});

/* lightbox */
var lb=document.createElement('div');lb.className='lightbox';lb.innerHTML='<img alt="">';document.body.appendChild(lb);
lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');lb.setAttribute('aria-label','Image preview');lb.onclick=function(){lb.classList.remove('on')};addEventListener('keydown',function(e){if(e.key==='Escape')lb.classList.remove('on')});
$$('.screenshot-card img').forEach(function(i){i.onclick=function(){$('img',lb).src=i.src;lb.classList.add('on')}});

/* intro (once per session) */
var intro=$('#intro');
if(intro){var seen=false;try{seen=sessionStorage.getItem('dpo3')}catch(e){}
if(seen||calm)intro.remove();else{var done=false,end=function(){if(done)return;done=true;intro.classList.add('done');try{sessionStorage.setItem('dpo3','1')}catch(e){}setTimeout(function(){intro.remove()},800)};setTimeout(end,3600);intro.onclick=end;addEventListener('keydown',end,{once:true})}}

/* terminal */
var cli=document.createElement('div');cli.id='cli';
cli.innerHTML='<div class="cli-box"><div class="cli-bar"><i></i><i></i><i></i><span style="margin-left:10px">DPO_OS — guest@ocado.dev</span><button id="cli-x">ESC</button></div><div id="cli-out">DPO_OS Terminal v3.0\nType <span class="c-d">help</span> to see commands. Try <span class="c-d">ls</span>.\n\n</div><div class="cli-line"><label>guest@ocado.dev:~$</label><input id="cli-in" autocomplete="off" spellcheck="false"></div></div>';
document.body.appendChild(cli);
var out=$('#cli-out'),inp=$('#cli-in'),hist=[],hi=0;
function tog(){var o=cli.classList.toggle('on');document.body.style.overflow=o?'hidden':'';if(o)setTimeout(function(){inp.focus()},50)}
$$('[data-term]').forEach(function(b){b.onclick=tog});$('#cli-x').onclick=tog;
addEventListener('keydown',function(e){if(e.key==='Escape'&&cli.classList.contains('on'))tog();if(e.key==='`'&&!/INPUT|TEXTAREA/.test((e.target||{}).tagName))tog()});
cli.onclick=function(e){if(e.target.tagName!=='BUTTON')inp.focus()};
function log(t){out.innerHTML+=t+'\n';out.scrollTop=out.scrollHeight}
function esc(t){return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;').replace(/'/g,'&#39;')}
function go(msg,url,ms){log('<span class="c-h">'+msg+'</span>');setTimeout(function(){location.href=url},ms||1200)}
var RUN={'empower.py':['Executing Project EmpowerPH...\n[=========> ] 90%','project-empower.html'],'signature.py':['Loading ResNet-18...\nVerifying signatures...','project-signature.html'],'infratrust.js':['Inverting matrices...\nRunning OLS...','project-infratrust.html'],'volatility.r':['Fitting DCC-GARCH model...','project-volatility.html'],'dbm.js':['Automating HR pipelines...\nGenerating PDFs...','project-dbm.html']};
inp.addEventListener('keydown',function(e){
if(e.key==='ArrowUp'){inp.value=hist[--hi]||'';hi=Math.max(hi,0);e.preventDefault();return}
if(e.key==='ArrowDown'){inp.value=hist[++hi]||'';return}
if(e.key!=='Enter')return;var raw=inp.value.trim();inp.value='';log('<span class="c-r">guest@ocado.dev:~$</span> '+raw.replace(/</g,'&lt;'));if(!raw)return;hist.push(raw);hi=hist.length;
var a=raw.toLowerCase().split(/\s+/),c=a[0];
if(c==='help')log('Commands:\n  <span class="c-d">help</span>      show this menu\n  <span class="c-d">ls</span>        list files\n  <span class="c-d">cat</span> &lt;f&gt;    open a document (about.txt, story.txt)\n  <span class="c-d">run</span> &lt;f&gt;    execute a project\n  <span class="c-d">cd</span> &lt;dir&gt;   change directory (restricted)\n  <span class="c-d">whoami</span>    who are you\n  <span class="c-d">skills</span>    print the toolkit\n  <span class="c-d">contact</span>   how to reach me\n  <span class="c-d">date</span>      timestamp\n  <span class="c-d">sudo</span>      try it\n  <span class="c-d">clear</span>     wipe the buffer\n  <span class="c-d">exit</span>      close terminal');
else if(c==='ls')log('<span class="c-f">about.txt</span>      bio &amp; overview\n<span class="c-f">story.txt</span>      the fresh grad reality check\n<span class="c-d">restricted/</span>    level 4 classified archive\n\n<span class="c-f">empower.py</span>    Project EmpowerPH\n<span class="c-f">signature.py</span>  Offline Signature Verification\n<span class="c-f">infratrust.js</span> InfraTrust Decision Support\n<span class="c-f">volatility.r</span> Econometric time series\n<span class="c-f">dbm.js</span>        Enterprise HR automation');
else if(c==='cat'){a[1]==='about.txt'?go('Reading about.txt...','about.html'):a[1]==='story.txt'?go('Reading story.txt...','job-hunt.html'):log('cat: '+esc(a[1]||'missing operand')+': No such file. Try ls.')}
else if(c==='run'){var r=RUN[a[1]];r?go(r[0]+'\nRedirecting...',r[1],1500):log('Usage: run [ empower.py | signature.py | infratrust.js | volatility.r | dbm.js ]')}
else if(c==='cd'){/^restricted\/?$/.test(a[1]||'')?go('Requesting Level 4 clearance...','restricted.html'):log('cd: '+(a[1]||'')+': No such directory')}
else if(c==='whoami')log('guest (authorized portfolio visitor)');
else if(c==='skills')log('Languages  Python · R · SQL · JavaScript · TypeScript\nModeling   ARIMA · GARCH · DCC-GARCH · VAR · OLS\nML         PyTorch · ResNet-18 · Siamese · Triplet loss\nBI         Power BI · Chart.js · Power Query\nAutomation Power Automate · Office Scripts · Regex');
else if(c==='contact')log('Email   ocadodexterp@gmail.com\nGitHub  github.com/OcadoDP\nLinkedIn /in/ocadodexterp');
else if(c==='date')log(new Date().toString());
else if(c==='clear')out.innerHTML='';
else if(c==='dracarys'||c==='alohomora')go('<span style="color:#ff7c88">🔥 Valahd... 🔥</span>\nRedirecting to Restricted Section...','restricted.html',1500);
else if(c==='sudo')log('guest is not in the sudoers file. This incident will be reported.');
else if(c==='exit')tog();
else log('Command not found: '+esc(c)+". Type 'help'.")});

/* AI assistant */
var PROXY='https://dpo-ai-proxy.docado800.workers.dev',hx=[];
var ab=document.createElement('button');ab.id='ai-bubble';ab.setAttribute('aria-label','Ask Dexter\u2019s AI');ab.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
var aw=document.createElement('div');aw.id='ai-win';aw.innerHTML='<div class="ai-head"><span><i></i>Dexter\u2019s AI Assistant</span><button aria-label="Close">&times;</button></div><div id="ai-msgs"><div class="ai-m a">Hi! I can answer questions about Dexter\u2019s work, skills, and experience.</div></div><div class="ai-sug"><button>What has he built?</button><button>Tech stack?</button><button>Experience at DBM?</button></div><div class="ai-in"><input placeholder="Ask a question..." autocomplete="off"><button>Send</button></div>';
document.body.appendChild(ab);document.body.appendChild(aw);
var am=$('#ai-msgs'),ai=$('input',aw);
ab.onclick=function(){aw.classList.toggle('on');if(aw.classList.contains('on'))ai.focus()};$('.ai-head button',aw).onclick=function(){aw.classList.remove('on')};
function fmt(t){return String(t).replace(/</g,'&lt;').replace(/\*\*(.*?)\*\*/g,'<b>$1</b>').replace(/\n/g,'<br>')}
function add(t,c){var d=document.createElement('div');d.className='ai-m '+c;d.innerHTML=fmt(t);am.appendChild(d);am.scrollTop=am.scrollHeight;return d}
function send(t){t=(t||ai.value).trim();if(!t)return;ai.value='';var s=$('.ai-sug',aw);if(s)s.remove();add(t,'u');hx.push({role:'user',content:t});var d=add('Thinking...','a');
fetch(PROXY,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:hx.slice(-4)})}).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(j){if(j.error)throw 0;var r=j.reply||'No response received.';hx.push({role:'assistant',content:r});d.innerHTML=fmt(r);am.scrollTop=am.scrollHeight}).catch(function(){d.innerHTML=fmt("I'm having trouble connecting right now. Feel free to email Dexter at **ocadodexterp@gmail.com**!")})}
$('.ai-in button',aw).onclick=function(){send()};ai.addEventListener('keydown',function(e){if(e.key==='Enter')send()});
$$('.ai-sug button',aw).forEach(function(b){b.onclick=function(){send(b.textContent)}});
})();
