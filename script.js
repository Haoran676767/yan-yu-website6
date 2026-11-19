const spots=[...document.querySelectorAll('.spot')];
spots.forEach(spot=>spot.addEventListener('click',()=>{const was=spot.classList.contains('active');spots.forEach(s=>s.classList.remove('active'));spot.classList.toggle('active',!was)}));
document.addEventListener('click',e=>{if(!e.target.closest('.spot'))spots.forEach(s=>s.classList.remove('active'))});
document.addEventListener('keydown',e=>{if(e.key==='Escape')spots.forEach(s=>s.classList.remove('active'))});
const gallery=document.querySelector('.gallery'),tiles=[...gallery.querySelectorAll('.tile')];
let items=[],bounds,drag=null,lastWidth=0;
function render(){items.forEach((p,i)=>{tiles[i].style.transform=`translate(${p.x}px,${p.y}px)`})}
function layout(){
 const width=gallery.clientWidth;if(Math.abs(width-lastWidth)<1)return;lastWidth=width;
 const cols=2,cell=width/cols;
 const maxH=width>650?240:180,rowH=maxH+150;
 items=tiles.map((el,i)=>{
  const ratio=Number(el.dataset.ratio),imageH=Math.min(maxH,(cell*.78)/ratio),imageW=imageH*ratio;
  const w=Math.max(imageW,Math.min(260,cell*.84));
  el.style.width=`${w}px`;el.querySelector('.cutout').style.width=`${imageW}px`;
  const h=el.offsetHeight;
  const x=(i%cols)*cell+(cell-w)/2+(i%2?1:-1)*cell*.035;
  const y=Math.floor(i/cols)*rowH+(maxH-imageH)/2+(i%3)*12+25;
  el.style.width=`${w}px`;return{x,y,w,h};
 });
 bounds={w:width,h:Math.ceil(tiles.length/cols)*rowH+80};gallery.style.height=`${bounds.h}px`;render();
}
function finish(){if(!drag)return;const el=tiles[drag.i];el.classList.remove('dragging');el.dataset.dragged=String(drag.moved);drag=null;}
tiles.forEach((el,i)=>{
 el.addEventListener('dragstart',e=>e.preventDefault());
 el.addEventListener('pointerdown',e=>{if(el.classList.contains('add-tile'))return;if(e.button!==0||drag)return;e.preventDefault();el.focus({preventScroll:true});drag={i,id:e.pointerId,x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY,moved:false};el.dataset.dragged='false';el.setPointerCapture(e.pointerId);el.classList.add('dragging')});
 el.addEventListener('pointermove',e=>{if(!drag||drag.i!==i||drag.id!==e.pointerId)return;if(Math.hypot(e.clientX-drag.startX,e.clientY-drag.startY)>6)drag.moved=true;ArchitectureCollision.move(items,i,e.clientX-drag.x,e.clientY-drag.y,bounds);drag.x=e.clientX;drag.y=e.clientY;render()});
 el.addEventListener('pointerup',finish);el.addEventListener('pointercancel',finish);el.addEventListener('lostpointercapture',finish);
 el.addEventListener('keydown',e=>{const keys={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};if(!keys[e.key])return;e.preventDefault();const [x,y]=keys[e.key],n=e.shiftKey?30:10;ArchitectureCollision.move(items,i,x*n,y*n,bounds);render()});
});
new ResizeObserver(()=>{finish();layout()}).observe(gallery);layout();

const names={"zh": ["耶鲁大学·纽黑文", "布达拉宫·拉萨", "都江堰·成都", "法源寺·北京", "寒山寺·苏州", "兰亭·绍兴", "圣心天主教堂·萨拉热窝", "塔克西姆清真寺·伊斯坦布尔", "鲍氏宗祠·徽州", "天坛·北京", "托普卡帕宫·伊斯坦布尔", "伊奥拉尼宫·檀香山", "哲蚌寺·拉萨", "哲蚌寺·拉萨"], "en": ["Yale University · New Haven", "Potala Palace · Lhasa", "Dujiangyan · Chengdu", "Fayuan Temple · Beijing", "Hanshan Temple · Suzhou", "Lanting · Shaoxing", "Sacred Heart Cathedral · Sarajevo", "Taksim Mosque · Istanbul", "Bao Family Ancestral Hall · Huizhou", "Temple of Heaven · Beijing", "Topkapi Palace · Istanbul", "Iolani Palace · Honolulu", "Drepung Monastery · Lhasa", "Drepung Monastery · Lhasa"]};
const hotspotEnglish=[['Roof ridge','Where roof slopes meet'],['Roof tiles','Channel rainwater'],['Eaves','Shelter from sun and rain'],['Columns','Support the roof frame'],['Doors & windows','Light and ventilation'],['Railings','Guard open edges']];
const hotspotChinese=spots.map(s=>[s.querySelector('strong').textContent,s.querySelector('.tip>span').textContent]);
let language='zh';
const languageButton=document.querySelector('.language-toggle');
function setLanguage(lang){
 language=lang;const english=lang==='en';document.documentElement.lang=english?'en':'zh-CN';
 document.title=english?'Architecture around the world':'楼台烟雨';
 languageButton.textContent=english?'中文':'EN';languageButton.setAttribute('aria-label',english?'切换到中文':'Switch to English');
 document.querySelector('.home').setAttribute('aria-label',english?'Back to home':'返回首页');
 const poem=english?'Four hundred and eighty temples of the Southern Dynasties; towers in mist and rain.':'南朝四百八十寺，多少楼台烟雨中';
 document.querySelector('.hero').setAttribute('aria-label',poem);document.querySelector('.calligraphy').alt=poem;
 document.querySelector('.architecture').setAttribute('aria-label',english?'Lanting hall: architectural details':'兰亭大殿建筑构造');
 document.querySelector('.building-caption').textContent=english?'Lanting · Shaoxing':'兰亭·绍兴';
 document.querySelector('.building img').alt=english?'Lanting hall':'兰亭大殿';
 gallery.setAttribute('aria-label',english?'World architecture, drag to rearrange':'世界建筑，可拖动排列');
 tiles.forEach((tile,i)=>{if(tile.classList.contains('add-tile')){tile.setAttribute('aria-label',english?'Add building':'添加建筑');return;}if(tile.dataset.custom){tile.setAttribute('aria-label',tile.querySelector('.caption').textContent);return;}tile.querySelector('.caption').textContent=names[lang][i];tile.querySelector('img').alt=names[lang][i];tile.setAttribute('aria-label',names[lang][i]+(english?', draggable':'，可拖动'))});
 spots.forEach((spot,i)=>{const [name,description]=(english?hotspotEnglish:hotspotChinese)[i];spot.querySelector('strong').textContent=name;spot.querySelector('.tip>span').textContent=description;spot.setAttribute('aria-label',name+': '+description)});
 try{localStorage.setItem('architecture-language',lang)}catch{}
}
languageButton.addEventListener('click',()=>setLanguage(language==='zh'?'en':'zh'));
try{setLanguage(new URLSearchParams(location.search).get('lang')||localStorage.getItem('architecture-language')||'zh')}catch{setLanguage(new URLSearchParams(location.search).get('lang')||'zh')}

// A released drag never activates the detail link. Keyboard clicks remain available.
tiles.forEach((el,i)=>el.addEventListener('click',e=>{
 if(e.detail!==0 && el.dataset.dragged==='true'){el.dataset.dragged='false';return;}
 if(el.classList.contains('add-tile')){openBuildingForm();return;}
 window.location.href=el.dataset.custom?`pages/custom.html?id=${encodeURIComponent(el.dataset.custom)}&lang=${language}`:`pages/building-${String(i).padStart(2,'0')}.html?lang=${language}`;
}));
const hallLink=document.querySelector('.building-caption');
hallLink.setAttribute('role','link');hallLink.tabIndex=0;
hallLink.addEventListener('click',()=>window.location.href='pages/building-14.html?lang='+language);
hallLink.addEventListener('keydown',e=>{if(e.key==='Enter')window.location.href='pages/building-14.html?lang='+language});
document.querySelector('.building').addEventListener('click',e=>{if(!e.target.closest('.spot'))window.location.href='pages/building-14.html?lang='+language});
