(() => {
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const intro=$('#intro'), header=$('#siteHeader');
let introDone=false;
function finishIntro(){if(introDone)return;introDone=true;intro?.classList.add('is-done');document.body.classList.add('page-entered');setTimeout(()=>intro?.remove(),900)}
$('#skipIntro')?.addEventListener('click',finishIntro);setTimeout(finishIntro,reduce?150:4900);

// galaxy canvas
const c=$('#cosmosCanvas'),ctx=c?.getContext('2d');let stars=[];
function resize(){if(!c||!ctx)return;const d=Math.min(devicePixelRatio||1,2);c.width=innerWidth*d;c.height=innerHeight*d;c.style.width=innerWidth+'px';c.style.height=innerHeight+'px';ctx.setTransform(d,0,0,d,0,0);stars=Array.from({length:innerWidth<700?450:1200},()=>{const a=Math.random()*Math.PI*2,r=Math.pow(Math.random(),.65)*Math.min(innerWidth,innerHeight)*.45;return{a,r,s:.4+Math.random()*1.5,v:.001+Math.random()*.002,g:Math.random()>.75,o:.25+Math.random()*.65}})}
function draw(t){if(!ctx||introDone)return;ctx.clearRect(0,0,innerWidth,innerHeight);ctx.globalCompositeOperation='lighter';const p=Math.min(1,t/2100);for(const s of stars){s.a+=s.v;const rr=s.r*p;const x=innerWidth/2+Math.cos(s.a)*rr,y=innerHeight/2+Math.sin(s.a)*rr*.34;ctx.fillStyle=s.g?`rgba(255,207,86,${s.o*p})`:`rgba(38,137,255,${s.o*p})`;ctx.beginPath();ctx.arc(x,y,s.s,0,Math.PI*2);ctx.fill()}requestAnimationFrame(draw)}if(c&&ctx&&!reduce){resize();addEventListener('resize',resize);requestAnimationFrame(draw)}

// cursor
const cursor=$('.cursor-dot');if(cursor&&matchMedia('(pointer:fine)').matches){addEventListener('mousemove',e=>{cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px'});document.addEventListener('pointerover',e=>{if(e.target.closest('a,button,.lab-card,.solution-card,.repo-card,.phone-layer'))document.body.classList.add('hovering')});document.addEventListener('pointerout',e=>{if(e.target.closest('a,button,.lab-card,.solution-card,.repo-card,.phone-layer'))document.body.classList.remove('hovering')})}

// navegação: a barra nasce na dobra do hero e fica sticky quando toca o topo
function navState(){
  let current='inicio';
  $$('main section[id]').forEach(s=>{
    if(scrollY>=s.offsetTop-innerHeight*.4) current=s.id;
  });
  $$('.desktop-nav a').forEach(a=>
    a.classList.toggle('active',a.getAttribute('href')==='#'+current)
  );
}
addEventListener('scroll',navState,{passive:true});
navState();

const menu=$('#mobileMenu');$('#menuBtn')?.addEventListener('click',()=>menu?.classList.toggle('open'));$$('.mobile-menu a').forEach(a=>a.addEventListener('click',()=>menu?.classList.remove('open')));

// hero parallax + rotating cinematic backgrounds
const hero=$('.hero'),heroBg=$('#heroBg');
const heroSlides=$$('.hero-bg-slide',heroBg);let heroSceneIndex=0,heroSceneTimer=null;const HERO_SCENE_MS=9000;
function setHeroScene(index,manual=false){if(!heroSlides.length)return;heroSceneIndex=(index+heroSlides.length)%heroSlides.length;heroSlides.forEach((slide,i)=>{slide.classList.toggle('is-active',i===heroSceneIndex);slide.classList.toggle('is-prev',i===(heroSceneIndex-1+heroSlides.length)%heroSlides.length)});const scene=heroSlides[heroSceneIndex]?.dataset.scene||'paris';hero?.setAttribute('data-scene',scene);if(manual)restartHeroScenes()}
function restartHeroScenes(){clearInterval(heroSceneTimer);if(!reduce)heroSceneTimer=setInterval(()=>setHeroScene(heroSceneIndex+1),HERO_SCENE_MS)}
setHeroScene(0);restartHeroScenes();
hero?.addEventListener('mouseenter',()=>clearInterval(heroSceneTimer));hero?.addEventListener('mouseleave',()=>restartHeroScenes());
hero?.addEventListener('mousemove',e=>{if(innerWidth<900||reduce)return;const r=hero.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;const active=$('.hero-bg-slide.is-active',heroBg);if(active)active.style.transform=`rotateY(${x*2.2}deg) rotateX(${y*-1.2}deg) scale(1.035) translate3d(${x*-12}px,${y*-8}px,0)`;$('.hero-profile').style.translate=`${x*9}px ${y*6}px`;$('.hero-coat').style.translate=`${x*15}px ${y*10}px`});
hero?.addEventListener('pointerleave',()=>{const active=$('.hero-bg-slide.is-active',heroBg);if(active)active.style.transform='rotateY(0) rotateX(0) scale(1) translate3d(0,0,0)';$('.hero-profile').style.translate='0 0';$('.hero-coat').style.translate='0 0'});

// reveal
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.1});$$('.reveal').forEach(el=>io.observe(el));

// hero stars
const hc=$('#heroStars'),hctx=hc?.getContext('2d');let hs=[];function hresize(){if(!hc||!hctx)return;const r=hc.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);hc.width=r.width*d;hc.height=r.height*d;hctx.setTransform(d,0,0,d,0,0);hs=Array.from({length:100},()=>({x:Math.random()*r.width,y:Math.random()*r.height,a:.1+Math.random()*.35,s:.2+Math.random()*1.1,v:.03+Math.random()*.12,g:Math.random()>.8}))}function hdraw(){if(!hc||!hctx)return;const r=hc.getBoundingClientRect();hctx.clearRect(0,0,r.width,r.height);hs.forEach(s=>{s.y+=s.v;if(s.y>r.height)s.y=0;hctx.fillStyle=s.g?`rgba(255,208,93,${s.a})`:`rgba(44,139,255,${s.a})`;hctx.beginPath();hctx.arc(s.x,s.y,s.s,0,Math.PI*2);hctx.fill()});requestAnimationFrame(hdraw)}if(hc&&hctx&&!reduce){hresize();addEventListener('resize',hresize);hdraw()}

// lab carousel
const track=$('#labTrack'),timer=$('#labTimer'),counter=$('#labIndex');let current=0,busy=false,autoplay,timerAnim;const duration=9500;const originals=track?[...track.children]:[],count=originals.length;if(track&&count){originals.slice(0,2).forEach(x=>track.appendChild(x.cloneNode(true)))}
function step(){const card=track?.querySelector('.lab-card');if(!card)return 0;return card.getBoundingClientRect().width+parseFloat(getComputedStyle(track).gap||18)}
function paint(){$$('.lab-card',track).forEach((c,i)=>c.classList.toggle('is-active',i===current));if(counter)counter.textContent=String((current%count)+1).padStart(2,'0')}
function resetTimer(){timerAnim?.cancel();if(timer&&!reduce)timerAnim=timer.animate([{width:'0%'},{width:'100%'}],{duration,easing:'linear',fill:'forwards'})}
function go(n,manual=false){if(!track||busy)return;busy=true;current=n;track.style.transition='transform .9s cubic-bezier(.16,.82,.18,1)';track.style.transform=`translate3d(${-current*step()}px,0,0)`;paint();resetTimer();setTimeout(()=>{if(current>=count){track.style.transition='none';current=0;track.style.transform='translate3d(0,0,0)';track.offsetHeight;paint()}else if(current<0){track.style.transition='none';current=count-1;track.style.transform=`translate3d(${-current*step()}px,0,0)`;track.offsetHeight;paint()}busy=false;if(manual)restart()},940)}
function restart(){clearInterval(autoplay);resetTimer();if(!reduce)autoplay=setInterval(()=>go(current+1),duration)}$('#labPrev')?.addEventListener('click',()=>go(current-1,true));$('#labNext')?.addEventListener('click',()=>go(current+1,true));$('#labCarousel')?.addEventListener('mouseenter',()=>{clearInterval(autoplay);timerAnim?.pause()});$('#labCarousel')?.addEventListener('mouseleave',()=>{timerAnim?.play();restart()});addEventListener('resize',()=>{if(track){track.style.transition='none';track.style.transform=`translate3d(${-current*step()}px,0,0)`}});paint();restart();

// solution infinite rail
const st=$('#solutionsTrack');if(st)st.innerHTML+=st.innerHTML;

// architecture tabs
const archData={
interface:{title:'Interface',symbol:'UI',image:'assets/architecture/interface.webp',desc:'Onde a ideia ganha identidade, hierarquia, clareza e uma experiência visual consistente.',points:['Design responsivo','Experiência orientada à conversão','Identidade visual aplicada ao produto']},
frontend:{title:'Front-end',symbol:'</>',image:'assets/architecture/frontend.webp',desc:'Transforma o design em comportamento: componentes, animações, estados e respostas em tempo real.',points:['HTML, CSS e JavaScript','Microinterações e movimento','Performance em diferentes telas']},
logic:{title:'Lógica',symbol:'01',image:'assets/architecture/logic.webp',desc:'Coordena decisões, regras e validações para que cada ação gere o comportamento esperado.',points:['Regras de negócio','Estados e validações','Fluxos personalizados']},
backend:{title:'Back-end',symbol:'BE',image:'assets/architecture/backend.webp',desc:'Processa dados, autenticação e serviços que sustentam a aplicação por trás da interface.',points:['Rotas e serviços','Autenticação e segurança','Processamento no servidor']},
api:{title:'API',symbol:'API',image:'assets/architecture/api.webp',desc:'Conecta o projeto a pagamentos, formulários, catálogos, serviços externos e outros sistemas.',points:['Integrações externas','Troca de dados','Endpoints sob medida']},
database:{title:'Banco de Dados',symbol:'DB',image:'assets/architecture/database.webp',desc:'Organiza informações com estrutura, consistência e espaço para crescer sem virar bagunça.',points:['MySQL e modelos relacionais','Consultas e organização','Dados prontos para escalar']},
infra:{title:'Infraestrutura',symbol:'CLD',image:'assets/architecture/infra.webp',desc:'Coloca tudo no ar com deploy, hospedagem, versionamento, segurança e monitoramento.',points:['Deploy e hospedagem','Disponibilidade e segurança','Escala e manutenção']}
};
const archTitle=$('#archTitle'),archDesc=$('#archDesc'),archPoints=$('#archPoints'),archSymbol=$('#archSymbol'),archImage=$('#archImage'),archCopy=$('#archCopy');
$$('.arch-tab').forEach(btn=>btn.addEventListener('click',()=>{const d=archData[btn.dataset.arch];if(!d)return;$$('.arch-tab').forEach(b=>b.classList.toggle('active',b===btn));archCopy?.classList.add('changing');archImage?.classList.add('is-changing');if(archSymbol){archSymbol.style.transform='translateY(8px) scale(.9)';archSymbol.style.opacity='.2'}setTimeout(()=>{if(archTitle)archTitle.textContent=d.title;if(archDesc)archDesc.textContent=d.desc;if(archPoints)archPoints.innerHTML=d.points.map(x=>`<li>${x}</li>`).join('');if(archImage){archImage.src=d.image;archImage.alt=`Visual da camada ${d.title}`;archImage.classList.remove('is-changing')}if(archSymbol){archSymbol.textContent=d.symbol;archSymbol.style.transform='';archSymbol.style.opacity=''}archCopy?.classList.remove('changing')},240)}));

// projects GitHub
const grid=$('#projectsGrid'),status=$('#repoStatus'),GH='GabrielProgramador206';const fallback=[{name:'gb-studios-finance-dashboard',html_url:'https://github.com/GabrielProgramador206/gb-studios-finance-dashboard',homepage:'https://gabrielprogramador206.github.io/gb-studios-finance-dashboard/',has_pages:true,description:'Premium financial management dashboard built with React and Chart.js.',language:'JavaScript',updated_at:'2026-09-18T00:00:00Z'},{name:'premium-promotional-wheel',html_url:'https://github.com/GabrielProgramador206/premium-promotional-wheel',homepage:'https://gabrielprogramador206.github.io/premium-promotional-wheel/',has_pages:true,description:'Premium responsive promotional roulette built with HTML, CSS and JavaScript.',language:'CSS',updated_at:'2026-09-18T00:00:00Z'}];
const pretty=n=>n.split('-').map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(' ');const live=r=>r.homepage|| (r.has_pages?`https://${GH.toLowerCase()}.github.io/${r.name}/`:r.html_url);function imageFor(r){const k=r.name.toLowerCase();if(k.includes('finance'))return'assets/projects/finance-dashboard.webp';if(k.includes('wheel')||k.includes('roleta'))return'assets/projects/promotional-wheel.webp';if(k.includes('memory'))return'assets/projects/memory-game.webp';return'assets/projects/default-project.webp'}function renderRepos(repos){if(!grid)return;grid.innerHTML=repos.filter(r=>!r.fork&&!r.archived).slice(0,8).map(r=>`<article class="repo-card"><div class="repo-preview" style="background-image:url('${imageFor(r)}')"></div><div class="repo-body"><div class="repo-top"><h3>${pretty(r.name)}</h3><a class="repo-link-main" href="${live(r)}" target="_blank" rel="noreferrer">Abrir projeto ↗</a></div><p class="repo-desc">${r.description||'Projeto GB Studios em evolução contínua.'}</p><div class="repo-meta"><span>${r.language||'Projeto'}</span><span>Portfólio</span><span>Projeto ao vivo</span></div><div class="repo-footer"><span>Atualizado automaticamente</span><span>${new Date(r.updated_at).toLocaleDateString('pt-BR')}</span></div></div></article>`).join('')}
async function load(){renderRepos(fallback);try{const res=await fetch(`https://api.github.com/users/${GH}/repos?sort=updated&direction=desc&per_page=100`,{headers:{Accept:'application/vnd.github+json'}});if(!res.ok)throw 0;const repos=await res.json(),filtered=repos.filter(r=>!r.fork&&!r.archived);if(filtered.length)renderRepos(filtered);if(status)status.textContent=`${filtered.length} projetos públicos · catálogo atualizado pela API do GitHub · o visitante abre a versão funcionando.`;window.__gbRepos=filtered}catch{if(status)status.textContent='Modo demonstração · exibindo os projetos publicados conhecidos.';window.__gbRepos=fallback}}load();

// results trigger
const results=$('.results');const rio=new IntersectionObserver(es=>{if(es[0].isIntersecting){results?.classList.add('on');rio.disconnect()}},{threshold:.2});if(results)rio.observe(results);

// contact
const msg=encodeURIComponent('Olá Gabriel! Gostaria de falar sobre um projeto da GB Studios.\n\nNome:\nTelefone:\nEmail:\nProjeto/ideia:');const whats=`https://wa.me/5511993063315?text=${msg}`;$('#whatsappBtn')?.setAttribute('href',whats);$('#mainWhatsBtn')?.setAttribute('href',whats);const gmail='https://mail.google.com/mail/?view=cm&fs=1&to=gabrielprogramadorsenior@gmail.com&su='+encodeURIComponent('Projeto - GB Studios')+'&body='+encodeURIComponent('Nome:\nTelefone:\nEmail:\nProjeto/ideia:\n');$('#gmailBtn')?.setAttribute('href',gmail);const toast=$('#toast');function showToast(t){if(!toast)return;toast.textContent=t;toast.classList.add('show');clearTimeout(showToast.t);showToast.t=setTimeout(()=>toast.classList.remove('show'),2200)}$$('[data-copy]').forEach(b=>b.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(b.dataset.copy);showToast('Copiado com sucesso.')}catch{showToast('Selecione e copie manualmente.')}}));

// modal demos
const modal=$('#experienceModal'),mc=$('#experienceContent');let cleanupModal=()=>{};
function openModal(type){if(!modal||!mc)return;cleanupModal();cleanupModal=()=>{};modal.classList.add('open');document.body.style.overflow='hidden';if(type==='memory')memory();if(type==='slot')slot();if(type==='github')github();if(type==='dashboard')dashboard()}
function close(){cleanupModal();cleanupModal=()=>{};modal?.classList.remove('open');document.body.style.overflow='';if(mc)mc.innerHTML=''}
$('#modalClose')?.addEventListener('click',close);$$('[data-close-modal]').forEach(x=>x.addEventListener('click',close));addEventListener('keydown',e=>{if(e.key==='Escape')close()});track?.addEventListener('click',e=>{const card=e.target.closest('.lab-card');if(card)openModal(card.dataset.experience)});$('#openFirstExperience')?.addEventListener('click',()=>openModal('memory'));

function slot(){
 mc.innerHTML=`<div class="exp-shell"><div class="exp-head"><div><span class="eyebrow">EXPERIÊNCIA DE MARCA</span><h2>Neon Reel</h2></div><p>Três rolos independentes, vidro, neon e feedback visual para uma interação de evento mais viva.</p></div><div class="slot-exp-stage" id="slotStage"><div class="slot-machine"><div class="slot-top"><b>GB STUDIOS · NEON REEL</b><span id="slotState">PRONTO</span></div><div class="slot-glass"><div class="slot-reels"><div class="slot-reel gold" id="slotA">GB</div><div class="slot-reel cyan" id="slotB">◆</div><div class="slot-reel" id="slotC">★</div></div><div class="slot-center-line"></div></div><div class="slot-console"><div class="slot-readout"><small>COMBINAÇÃO</small><strong id="slotCombo">—</strong><span id="slotMsg">Ative o mecanismo</span></div><button class="slot-spin" id="slotSpin">SPIN</button></div></div><button class="slot-lever-pro" id="slotLever" aria-label="Puxar alavanca"></button></div></div>`;
 const symbols=[['GB','gold'],['◆','cyan'],['★','gold'],['ϟ','cyan'],['◉',''],['✦','gold']], reels=[$('#slotA',mc),$('#slotB',mc),$('#slotC',mc)],state=$('#slotState',mc),combo=$('#slotCombo',mc),msgEl=$('#slotMsg',mc),stage=$('#slotStage',mc),lever=$('#slotLever',mc);let busy=false,intervals=[];
 function particles(n){for(let i=0;i<n;i++){const p=document.createElement('i');p.className='slot-particle';p.style.left='50%';p.style.top='52%';p.style.setProperty('--x',`${(Math.random()-.5)*420}px`);p.style.setProperty('--y',`${(Math.random()-.5)*300}px`);p.style.background=Math.random()>.5?'var(--gold2)':'#65d8ff';stage.appendChild(p);setTimeout(()=>p.remove(),1100)}}
 function spin(){if(busy)return;busy=true;state.textContent='GIRANDO';combo.textContent='...';msgEl.textContent='Sincronizando rolos';lever.classList.remove('pulled');void lever.offsetWidth;lever.classList.add('pulled');const final=[];reels.forEach((r,i)=>{r.classList.add('spinning');let tick=0;const id=setInterval(()=>{const s=symbols[Math.floor(Math.random()*symbols.length)];r.textContent=s[0];r.className=`slot-reel spinning ${s[1]}`;if(++tick>13+i*5){clearInterval(id);const f=symbols[Math.floor(Math.random()*symbols.length)];final[i]=f[0];r.textContent=f[0];r.className=`slot-reel ${f[1]}`;if(i===2){const all=final[0]===final[1]&&final[1]===final[2],pair=final[0]===final[1]||final[1]===final[2]||final[0]===final[2];combo.textContent=final.join(' · ');msgEl.textContent=all?'COMBINAÇÃO PERFEITA':pair?'COMBINAÇÃO DUPLA':'NOVA SEQUÊNCIA';state.textContent='PRONTO';if(all)particles(44);else if(pair)particles(20);busy=false}}},90+i*12);intervals.push(id)})}
 $('#slotSpin',mc).onclick=spin;lever.onclick=spin;cleanupModal=()=>intervals.forEach(clearInterval);
}

function memory(){
 const faces=[
  {id:'dashboard',name:'Dashboard',img:'assets/memory/premium/dashboard.webp'},
  {id:'camera',name:'Câmera',img:'assets/memory/premium/camera.webp'},
  {id:'phone',name:'Contato',img:'assets/memory/premium/phone.webp'},
  {id:'laptop',name:'Desenvolvimento',img:'assets/memory/premium/laptop.webp'},
  {id:'controller',name:'Experiência',img:'assets/memory/premium/controller.webp'},
  {id:'assistant',name:'Assistente',img:'assets/memory/premium/assistant.webp'}
 ];
 const deck=[...faces.map(x=>({...x,copy:1})),...faces.map(x=>({...x,copy:2}))].sort(()=>Math.random()-.5);

 mc.innerHTML=`<div class="exp-shell memory-v15">
   <div class="exp-head">
     <div><span class="eyebrow">DESAFIO DE MEMÓRIA</span><h2>Jogo da Memória</h2></div>
     <p>Memorize as posições por 5 segundos. Depois encontre os 6 pares antes do tempo acabar.</p>
   </div>

   <div class="memory-toolbar memory-toolbar-v15">
     <div class="memory-time" id="memoryTime">05:00</div>
     <div class="memory-meta" id="memoryMoves">0 jogadas</div>
     <div class="memory-meta" id="memoryPairs">0 / 6 pares</div>
     <div class="memory-preview-countdown" id="memoryPreview"><i></i><span>Memorize: 5s</span></div>
   </div>

   <div class="memory-progress"><span id="memoryProgress"></span></div>

   <div class="memory-game-premium memory-game-v15" id="memoryGrid">
     ${deck.map((f,i)=>`<button type="button" class="memory-card-pro is-face-up preview-open" data-id="${f.id}" data-copy="${f.copy}" data-index="${i}">
       <span class="memory-card-inner">
         <span class="memory-front"><i class="memory-front-mark">GB</i></span>
         <span class="memory-back memory-back-v15">
           <img src="${f.img}" alt="${f.name}" draggable="false">
           <span>${f.name}</span>
         </span>
       </span>
     </button>`).join('')}
   </div>

   <div class="memory-banner" id="memoryBanner">Observe as cartas. Elas serão escondidas em 5 segundos.</div>
 </div>`;

 const cards=$$('.memory-card-pro',mc);
 const timeEl=$('#memoryTime',mc);
 const movesEl=$('#memoryMoves',mc);
 const pairsEl=$('#memoryPairs',mc);
 const progress=$('#memoryProgress',mc);
 const banner=$('#memoryBanner',mc);
 const previewEl=$('#memoryPreview',mc);
 const previewLabel=previewEl?.querySelector('span');

 let selected=[];
 let busy=true;
 let moves=0;
 let pairs=0;
 let remaining=300;
 let finished=false;
 let timerId=null;
 let previewTimeouts=[];

 const setFace=(card,up)=>{
   card.classList.toggle('is-face-up',up);
 };

 const updateTimer=()=>{
   const m=Math.floor(remaining/60);
   const s=remaining%60;
   timeEl.textContent=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
   progress.style.transform=`scaleX(${Math.max(0,remaining)/300})`;
   timeEl.classList.toggle('danger',remaining<=30);
 };

 const stopGame=(message,kind='')=>{
   finished=true;
   busy=true;
   clearInterval(timerId);
   banner.textContent=message;
   banner.className=`memory-banner ${kind}`.trim();
 };

 const beginPlay=()=>{
   if(finished)return;
   cards.forEach(card=>{
     card.classList.remove('preview-open');
     setFace(card,false);
   });
   busy=false;
   previewEl?.classList.add('done');
   banner.textContent='Valendo! Cartas já vistas ficam douradas até você encontrar o par.';
   banner.className='memory-banner';
   updateTimer();
   timerId=setInterval(()=>{
     if(finished)return;
     remaining--;
     updateTimer();
     if(remaining<=0){
       cards.forEach(c=>setFace(c,true));
       stopGame('Tempo encerrado. As cartas foram reveladas para você conferir os pares.','error');
     }
   },1000);
 };

 for(let i=4;i>=0;i--){
   previewTimeouts.push(setTimeout(()=>{
     if(previewLabel)previewLabel.textContent=`Memorize: ${i}s`;
     if(i===0)beginPlay();
   },(5-i)*1000));
 }

 cards.forEach(card=>card.addEventListener('click',()=>{
   if(busy||finished||card.classList.contains('matched')||card.classList.contains('is-face-up'))return;

   setFace(card,true);
   card.classList.add('seen');
   selected.push(card);

   if(selected.length===1)return;

   busy=true;
   moves++;
   movesEl.textContent=`${moves} jogada${moves!==1?'s':''}`;

   const [a,b]=selected;
   const match=a.dataset.id===b.dataset.id;

   if(match){
     setTimeout(()=>{
       a.classList.add('matched');
       b.classList.add('matched');
       a.classList.remove('seen');
       b.classList.remove('seen');
       pairs++;
       pairsEl.textContent=`${pairs} / 6 pares`;
       banner.textContent='Acerto! Par confirmado.';
       banner.className='memory-banner success';
       selected=[];
       busy=false;

       if(pairs===faces.length){
         cards.forEach(c=>setFace(c,true));
         stopGame(`Concluído! ${moves} jogadas e ${timeEl.textContent} restantes.`,'success');
       }
     },420);
   } else {
     a.classList.add('wrong');
     b.classList.add('wrong');
     banner.textContent='Não combinou. Essas duas cartas agora ficam marcadas como já vistas.';
     banner.className='memory-banner error';

     setTimeout(()=>{
       a.classList.remove('wrong');
       b.classList.remove('wrong');
       setFace(a,false);
       setFace(b,false);
       selected=[];
       busy=false;
     },850);
   }
 }));

 cleanupModal=()=>{
   previewTimeouts.forEach(clearTimeout);
   clearInterval(timerId);
 };
}
function github(){
 const repos=(window.__gbRepos||fallback).slice(0,5);
 mc.innerHTML=`<div class="exp-shell"><div class="exp-head"><div><span class="eyebrow">PORTFÓLIO EM EVOLUÇÃO</span><h2>Catálogo GitHub</h2></div><p>Um atalho elegante para projetos públicos, experimentos e versões que continuam recebendo melhorias.</p></div><div class="github-portal"><div class="github-hero-card"><div class="gh-mark">GH</div><h3>GabrielProgramador206</h3><p>Projetos web, interfaces, experiências interativas, dashboards e sistemas publicados no GitHub.</p><a class="github-cta" href="https://github.com/GabrielProgramador206?tab=repositories" target="_blank" rel="noreferrer">Abrir meu GitHub ↗</a></div><div class="github-list-premium">${repos.map(r=>`<a class="github-repo-card" href="${live(r)}" target="_blank" rel="noreferrer"><b>${pretty(r.name)}</b><p>${r.description||'Projeto GB Studios em evolução contínua.'}</p><span>ABRIR PROJETO ↗</span></a>`).join('')}</div></div></div>`;
}

function dashboard(){
 const data=[
  {id:1,desc:'Hospedagem',origin:'Infraestrutura',value:59.90},
  {id:2,desc:'Internet',origin:'Operação',value:129.90},
  {id:3,desc:'Adobe / Design',origin:'Software',value:109.00},
  {id:4,desc:'Transporte',origin:'Operação',value:84.50},
  {id:5,desc:'Domínio anual',origin:'Infraestrutura',value:42.00}
 ];
 mc.innerHTML=`<div class="exp-shell"><div class="exp-head"><div><span class="eyebrow">DASHBOARD INTERATIVO</span><h2>Dashboard Financeiro</h2></div><p>Uma demonstração de planilha/sistema financeiro com lançamentos, origem dos gastos e análise automática.</p></div><div class="expense-showcase" aria-hidden="true"></div><div class="expense-dashboard"><div class="expense-main"><div class="expense-kpis"><div class="expense-kpi primary"><small>TOTAL GASTO</small><strong id="expenseTotal">R$ 0</strong></div><div class="expense-kpi"><small>MÉDIA</small><strong id="expenseAvg">R$ 0</strong></div><div class="expense-kpi"><small>MAIOR GASTO</small><strong id="expenseMax">R$ 0</strong></div><div class="expense-kpi"><small>LANÇAMENTOS</small><strong id="expenseCount">0</strong></div></div><form class="expense-form" id="expenseForm"><input id="expenseDesc" placeholder="Descrição" required><select id="expenseOrigin"><option>Operação</option><option>Software</option><option>Infraestrutura</option><option>Marketing</option><option>Outros</option></select><input id="expenseValue" type="number" min="0.01" step="0.01" placeholder="Valor" required><button>Adicionar</button></form><div class="expense-table-wrap"><table class="expense-table"><thead><tr><th>GASTO</th><th>ORIGEM</th><th>VALOR</th><th></th></tr></thead><tbody id="expenseRows"></tbody></table></div></div><aside class="expense-side"><div class="expense-card expense-distribution"><div class="expense-card-head"><h4>DISTRIBUIÇÃO DOS GASTOS</h4><span>Atualização ao vivo</span></div><div class="expense-donut-layout"><div class="expense-donut" id="expenseDonut"><div class="expense-donut-center"><small>TOTAL</small><b id="expenseDonutTotal">R$ 0</b></div></div><div class="expense-legend" id="expenseLegend"></div></div></div><div class="expense-card"><h4>GASTOS POR ORIGEM</h4><div class="expense-bars" id="expenseBars"></div></div></aside></div></div>`;
 const rows=$('#expenseRows',mc),totalEl=$('#expenseTotal',mc),avgEl=$('#expenseAvg',mc),maxEl=$('#expenseMax',mc),countEl=$('#expenseCount',mc),bars=$('#expenseBars',mc),donutTotal=$('#expenseDonutTotal',mc),donut=$('#expenseDonut',mc),legend=$('#expenseLegend',mc),form=$('#expenseForm',mc);let nextId=6;
 const money=v=>v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
 function render(){
  const total=data.reduce((s,x)=>s+x.value,0),avg=data.length?total/data.length:0,max=data.length?Math.max(...data.map(x=>x.value)):0;
  totalEl.textContent=money(total);avgEl.textContent=money(avg);maxEl.textContent=money(max);countEl.textContent=data.length;donutTotal.textContent=money(total);
  rows.innerHTML=data.map(x=>`<tr><td>${x.desc}</td><td><span class="origin-pill">${x.origin}</span></td><td>${money(x.value)}</td><td><button class="expense-remove" data-id="${x.id}">✕</button></td></tr>`).join('');
  const by={};data.forEach(x=>by[x.origin]=(by[x.origin]||0)+x.value);
  const palette=['#2f9dff','#ffd86a','#57d4c8','#8ba2bd','#1767c8'];
  const entries=Object.entries(by).sort((a,b)=>b[1]-a[1]);
  let acc=0;
  const stops=entries.map(([k,v],i)=>{const from=acc;acc+=total?((v/total)*100):0;return `${palette[i%palette.length]} ${from.toFixed(2)}% ${acc.toFixed(2)}%`});
  if(donut)donut.style.background=`conic-gradient(${stops.join(',')||'#162333 0 100%'})`;
  if(legend)legend.innerHTML=entries.map(([k,v],i)=>`<div class="expense-legend-row"><i style="background:${palette[i%palette.length]}"></i><span>${k}</span><b>${total?((v/total)*100).toFixed(1):0}%</b></div>`).join('');
  const top=Math.max(1,...Object.values(by));
  bars.innerHTML=entries.map(([k,v],i)=>`<div class="expense-bar-row"><span>${k}</span><div class="expense-bar"><i style="width:${v/top*100}%;--bar:${palette[i%palette.length]}"></i></div><b>${money(v)}</b></div>`).join('');
  $$('.expense-remove',rows).forEach(b=>b.onclick=()=>{const id=Number(b.dataset.id),idx=data.findIndex(x=>x.id===id);if(idx>=0){data.splice(idx,1);render()}});
}
 form.onsubmit=e=>{e.preventDefault();const desc=$('#expenseDesc',mc).value.trim(),origin=$('#expenseOrigin',mc).value,value=Number($('#expenseValue',mc).value);if(!desc||!value)return;data.push({id:nextId++,desc,origin,value});form.reset();render()};render();
}
})();