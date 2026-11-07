const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
const themeButton=document.querySelector('.theme-toggle');
function syncTheme(){const light=document.documentElement.dataset.theme==='light';const en=document.body.dataset.lang==='en';themeButton?.setAttribute('aria-label',en?'Light theme':'Tema terang');themeButton?.setAttribute('aria-pressed',String(light));if(themeButton)themeButton.title=en?(light?'Switch to dark theme':'Switch to light theme'):(light?'Aktifkan tema gelap':'Aktifkan tema terang');document.querySelector('meta[name="theme-color"]')?.setAttribute('content',light?'#f2f1ec':'#0b1017');}
syncTheme();themeButton?.addEventListener('click',()=>{const next=document.documentElement.dataset.theme==='light'?'dark':'light';document.documentElement.dataset.theme=next;try{localStorage.setItem('ziqri-theme',next);}catch{}syncTheme();});
const header=document.querySelector('.site-header');
function syncScroll(){header?.classList.toggle('is-scrolled',window.scrollY>16);if(window.scrollY<100)document.querySelectorAll('.navigation a[aria-current]').forEach(a=>a.removeAttribute('aria-current'));}
syncScroll();window.addEventListener('scroll',syncScroll,{passive:true});
function syncVisibility(){document.body.classList.toggle('is-paused',document.hidden);}
document.addEventListener('visibilitychange',syncVisibility);syncVisibility();
const menu=document.querySelector('.menu-button');
function closeMenu(){menu?.setAttribute('aria-expanded','false');menu?.setAttribute('aria-label',menu.dataset.openLabel);document.querySelector('.site-header')?.classList.remove('menu-open');}
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?menu.dataset.closeLabel:menu.dataset.openLabel);document.querySelector('.site-header').classList.toggle('menu-open',open);});
document.querySelectorAll('.navigation a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu?.getAttribute('aria-expanded')==='true'){closeMenu();menu.focus();}});
const resize=new ResizeObserver(()=>{if(window.innerWidth>760)closeMenu();});resize.observe(document.documentElement);

function updateTime(){const clock=document.querySelector('[data-clock]');if(clock){clock.textContent=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Makassar',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date());clock.dateTime=new Date().toISOString();}}
updateTime();setInterval(updateTime,60000);

const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target);}}),{threshold:0.12});
document.querySelectorAll('[data-reveal]').forEach(el=>observer.observe(el));
const sections=[...document.querySelectorAll('main>section[id]')];
if(sections.length){const activeObserver=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){document.querySelectorAll('.navigation a').forEach(a=>{const yes=a.hash==='#'+e.target.id;if(yes)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}});},{rootMargin:'-20% 0px -55% 0px'});sections.forEach(s=>activeObserver.observe(s));}

document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));document.querySelector('.f-project-grid')?.classList.toggle('is-filtered',button.dataset.filter!=='all');let count=0;document.querySelectorAll('.project[data-kind]').forEach(project=>{const show=button.dataset.filter==='all'||project.dataset.kind===button.dataset.filter;project.hidden=!show;if(show){count++;project.classList.add('in-view');}});const label=document.querySelector('.filter-count');if(label)label.textContent=count+' '+(document.body.dataset.lang==='id'?'proyek':'projects');}));

const terminal=document.querySelector('[data-terminal]');
if(terminal){const data=JSON.parse(terminal.dataset.terminal);const output=terminal.querySelector('.console-output');let timers=[];
 const render=(index,animate)=>{timers.forEach(clearTimeout);timers=[];const fragment=document.createDocumentFragment();data.steps[index].forEach((text,i)=>{const line=document.createElement('p');line.className='output-line'+(i===3?' output-success':'');const marker=document.createElement('span');marker.textContent=i===3?'✓':'›';line.append(marker,document.createTextNode(text));if(animate&&!reduced.matches){line.classList.add('output-enter');line.style.animationDelay=(i*160)+'ms';}fragment.append(line);});output.replaceChildren(fragment);};
 terminal.querySelectorAll('[data-workflow]').forEach(button=>button.addEventListener('click',()=>{terminal.querySelectorAll('[data-workflow]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));render(Number(button.dataset.workflow),true);}));
 render(0,true);
 reduced.addEventListener('change',()=>{if(reduced.matches)output.querySelectorAll('.output-enter').forEach(l=>l.classList.remove('output-enter'));});
}

const typing=document.querySelector('[data-typewriter]');
if(typing&&!reduced.matches){const text=typing.dataset.typewriter;let index=0,timer;typing.textContent='';const tick=()=>{typing.textContent=text.slice(0,++index);if(index<text.length)timer=setTimeout(tick,40);};timer=setTimeout(tick,200);reduced.addEventListener('change',()=>{if(reduced.matches){clearTimeout(timer);typing.textContent=text;}});}
const marquee=document.querySelector('.f-marquee');
if(marquee){const motionObserver=new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.classList.toggle('offscreen',!entry.isIntersecting)));motionObserver.observe(marquee);}
