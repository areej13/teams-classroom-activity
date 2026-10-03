(function(){
 'use strict';
 const root=document.getElementById('u4ts-root');
 const find=s=>root.querySelector(s);
 // Keep the original Teams assignment form intact, with all controls visible.
 const reviewStep=find('[data-screen="4"]'),reviewColumns=document.createElement('div'),feedback=document.createElement('div');
 reviewColumns.className='u4ts-reviewcolumns';feedback.className='u4ts-feedback';
 const reviewChildren=Array.from(reviewStep.children);reviewStep.append(reviewColumns);
 reviewColumns.append(reviewChildren[1],feedback);reviewChildren.slice(2).forEach(p=>feedback.append(p));
 // Keep feedback and action choices together.
 const support=find('[data-screen="5"]');const parts=Array.from(support.children);
 const reading=document.createElement('div'),reflect=document.createElement('div');
 support.insertBefore(reading,parts[1]);support.insertBefore(reflect,parts[3]);
 reading.append(parts[1],parts[2]);parts.slice(3,-1).forEach(p=>reflect.append(p));
 reading.className=reflect.className='u4ts-supportsection';
 const supportPair=document.createElement('div');supportPair.className='u4ts-supportpair';support.insertBefore(supportPair,reading);supportPair.append(reading,reflect);
 // Every SVG represents only the supplied training data, without invented trends.
 const charts=[
  '<svg viewBox="0 0 280 84" role="img" aria-label="6 من 28 لديهم تسليم متأخر، و4 طلبة غير نشطين"><path d="M12 24H268M12 60H268" stroke="#e7e4e9" stroke-width="14"/><path d="M213 24H268" stroke="#a34d0c" stroke-width="14"/><path d="M231 60H268" stroke="#a34d0c" stroke-width="14"/><text x="12" y="15">6 / 28 — تسليم متأخر</text><text x="12" y="50">4 / 28 — غير نشطين</text></svg>',
  '<svg viewBox="0 0 280 84" role="img" aria-label="الكلمات الثلاث التي تكررت صعوبتها: التشفير، المصادقة، الخصوصية"><rect x="4" y="22" width="84" height="40" rx="8" fill="#e9f1f7" stroke="#397393"/><rect x="98" y="22" width="84" height="40" rx="8" fill="#e9f1f7" stroke="#397393"/><rect x="192" y="22" width="84" height="40" rx="8" fill="#e9f1f7" stroke="#397393"/><text x="46" y="47" text-anchor="middle">الخصوصية</text><text x="140" y="47" text-anchor="middle">المصادقة</text><text x="234" y="47" text-anchor="middle">التشفير</text></svg>',
  '<svg viewBox="0 0 280 84" role="img" aria-label="9 من 22 مستجيبا اختاروا قلق، نحو 41 بالمئة"><circle cx="235" cy="42" r="30" stroke="#e7e4e9" stroke-width="10"/><circle cx="235" cy="42" r="30" stroke="#9c3867" stroke-width="10" stroke-dasharray="77 189" transform="rotate(-90 235 42)"/><text x="235" y="47" text-anchor="middle">41%</text><text x="175" y="32" text-anchor="end">قلق تجاه الواجب</text><text x="175" y="57" text-anchor="end">«المطلوب غير واضح»</text></svg>',
  '<svg viewBox="0 0 280 84" role="img" aria-label="5 طلبة حصلوا على 95 بالمئة فأكثر في آخر ثلاثة واجبات"><path d="M30 15V66H265" stroke="#d2d6dc"/><path d="M72 59V24M147 59V24M222 59V24" stroke="#217154" stroke-width="24"/><text x="147" y="14" text-anchor="middle">95% فأكثر</text><text x="72" y="81" text-anchor="middle">واجب 1</text><text x="147" y="81" text-anchor="middle">واجب 2</text><text x="222" y="81" text-anchor="middle">واجب 3</text></svg>'
 ];
 const cards=Array.from(root.querySelectorAll('.u4ts-inscard'));
 cards.forEach((card,i)=>{card.style.setProperty('--metric',['#a34d0c','#286586','#9c3867','#217154'][i]);card.querySelector('.u4ts-num').insertAdjacentHTML('afterend',charts[i]);});
 const rows=Array.from(root.querySelectorAll('[data-group="decisions"] .u4ts-row'));
 const mapping=[3,0,2,1];rows.forEach((row,i)=>{const answers=document.createElement('div');answers.className='u4ts-answerbox';while(row.firstChild)answers.append(row.firstChild);row.append(cards[mapping[i]],answers);});
 const insights=find('.u4ts-ins');insights.insertBefore(find('[data-group="decisions"]'),find('.u4ts-caption'));
 find('[data-screen="6"] .u4ts-task p').textContent='اقرأ المؤشرات واختر لكل مؤشر القرار المناسب من الخيارات الظاهرة معه، ثم اضغط «تحقّق من المطابقة».';
 find('[data-screen="5"] .u4ts-task p').textContent='اقرأ الموقفين واختر الإجابات المناسبة من الخيارات الظاهرة، ثم اضغط «تحقّق».';
 // A compact frame and a genuine full screen option; browser permission comes from the click.
 const expand=document.createElement('button');expand.type='button';expand.className='u4ts-sound';expand.textContent='⛶ تكبير النشاط';expand.setAttribute('aria-label','عرض النشاط بملء الشاشة');
 find('.u4ts-user').prepend(expand);
 expand.addEventListener('click',async()=>{try{if(document.fullscreenElement){await document.exitFullscreen();}else{await document.documentElement.requestFullscreen();}}catch(e){window.open(location.href,'_blank','noopener');}});
 document.addEventListener('fullscreenchange',()=>{expand.textContent=document.fullscreenElement?'⛶ تصغير النشاط':'⛶ تكبير النشاط';});
})();

/* The same visual language across all seven activity steps. */
(function(){
 const root=document.getElementById('u4ts-root'),q=s=>root.querySelector(s);
 const icons={
  team:'<circle cx="9" cy="8" r="3"/><path d="M3 20v-3a6 6 0 0 1 12 0v3M17 5a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 5"/>',
  channel:'<path d="M9 3 7 21M17 3l-2 18M3 9h18M2 15h18"/>',
  post:'<path d="M4 4h16v12H9l-5 4zM8 8h8M8 12h5"/>',
  file:'<path d="M5 3h9l5 5v13H5zM14 3v6h5M9 13h6M9 17h6"/>',
  assign:'<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2h6v2M8 11l2 2 5-5M9 17h6"/>',
  support:'<path d="M3 5h6a3 3 0 0 1 3 3v13a4 4 0 0 0-4-3H3zM21 5h-6a3 3 0 0 0-3 3M21 5v13h-5"/>',
  chart:'<path d="M4 3v18h17M8 16v-5M13 16V6M18 16V9"/>',
  check:'<circle cx="12" cy="12" r="9"/><path d="m7 12 3 3 7-7"/>'
 };
 function icon(name){const el=document.createElement('span');el.className='u4ts-vector';el.setAttribute('aria-hidden','true');el.innerHTML='<svg viewBox="0 0 24 24">'+icons[name]+'</svg>';return el;}
 function panelLabel(text){const el=document.createElement('div');el.className='u4ts-panel-label';el.textContent=text;return el;}
 // Overview: readable introduction next to a numbered route with meaningful icons.
 const intro=q('.u4ts-intro'),introNodes=Array.from(intro.children),introGrid=document.createElement('div'),introText=document.createElement('div'),route=document.createElement('div');
 introGrid.className='u4ts-introgrid';introText.className='u4ts-context';route.className='u4ts-routepanel';
 introText.append(panelLabel('السياق والهدف'),introNodes[1],introNodes[2]);route.append(introNodes[3],introNodes[4]);introGrid.append(introText,route);intro.append(introGrid);
 ['team','assign','post','support','chart','check'].forEach((name,i)=>q('.u4ts-road').children[i].prepend(icon(name)));
 // Organizing the class: choices and answer slots remain beside one another.
 const order=q('[data-screen="2"]'),orderNodes=Array.from(order.children),orderGrid=document.createElement('div'),path=document.createElement('div');
 orderGrid.className='u4ts-ordergrid';path.className='u4ts-orderanswer';order.insertBefore(orderGrid,orderNodes[1]);
 orderGrid.append(orderNodes[1],path);path.append(orderNodes[2],orderNodes[3]);
 root.querySelectorAll('.u4ts-card[data-key]').forEach(card=>card.prepend(icon(card.dataset.key)));
 q('#u4ts-assign-reset').classList.add('u4ts-minor');
 // Feedback, reading, and Reflect use identical context/answer containers.
 q('.u4ts-feedback').prepend(panelLabel('الإجابة والإجراء'));
 root.querySelectorAll('[data-screen="5"] .u4ts-supportsection').forEach(page=>{
  const children=Array.from(page.children),context=document.createElement('div'),answers=document.createElement('div');
  page.classList.add('u4ts-supportstack');context.className='u4ts-context';answers.className='u4ts-answerpanel';
  children[0].querySelector('strong').textContent=children[0].querySelector('strong').textContent.replace(/الجزء (الأول|الثاني) — /,'');context.append(children[0]);children.slice(1).forEach(el=>answers.append(el));answers.prepend(panelLabel('اختياراتك'));page.append(context,answers);
 });
 // Summary repeats the same vector cues used in the activity.
 ['team','assign','post','support','chart'].forEach((name,i)=>{const card=q('.u4ts-sum').children[i];card.prepend(icon(name));});
 // Make question groups distinct from contextual body copy on every screen.
 root.querySelectorAll('.u4ts-feedback .u4ts-label,.u4ts-answerpanel > .u4ts-label').forEach(el=>el.classList.add('u4ts-question-label'));
 root.querySelectorAll('input,textarea,select').forEach(el=>{el.addEventListener('input',()=>el.classList.toggle('u4ts-hasvalue',!!el.value));el.addEventListener('change',()=>el.classList.toggle('u4ts-hasvalue',!!el.value));});
 q('#u4ts-restart').addEventListener('click',()=>root.querySelectorAll('.u4ts-hasvalue').forEach(el=>el.classList.remove('u4ts-hasvalue')));
})();
