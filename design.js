(function(){
 'use strict';
 const root=document.getElementById('u4ts-root');
 const find=s=>root.querySelector(s);
 const pagers=[];
 function pager(container,pages,labels,actions){
  let current=0;
  const nav=document.createElement('div');nav.className='u4ts-pager';
  const prev=document.createElement('button'),next=document.createElement('button'),count=document.createElement('span');
  prev.type=next.type='button';prev.className=next.className='u4ts-btn sec';
  prev.textContent='الجزء السابق';next.textContent='الجزء التالي';count.className='u4ts-pagecount';count.setAttribute('aria-live','polite');
  nav.append(prev,count,next);container.append(nav);
  const inlineActions=(actions||[]).filter(a=>a.tagName==='DIV'&&a.parentElement===container);
  inlineActions.forEach(a=>nav.append(a));
  pages.forEach(p=>p.classList.add('u4ts-page'));
  function render(focus){
   pages.forEach((p,i)=>{p.hidden=i!==current;p.setAttribute('data-paged-hidden',String(i!==current));});
   count.textContent=(current+1)+' / '+pages.length+' — '+labels[current];
   prev.disabled=current===0;next.disabled=current===pages.length-1;
   next.hidden=inlineActions.length>0&&current===pages.length-1;
   (actions||[]).forEach(a=>a.setAttribute('data-paged-hidden',String(current!==pages.length-1)));
   if(focus){count.tabIndex=-1;count.focus({preventScroll:true});}
  }
  prev.onclick=()=>{if(current>0){current--;render(true);}};
  next.onclick=()=>{if(current<pages.length-1){current++;render(true);}};
  render(false);pagers.push(()=>{current=0;render(false);});
 }
 // Keep the assignment brief visible while separating content from settings.
 const form=find('.u4ts-formgrid');const fields=Array.from(form.children);
 fields[1].classList.add('u4ts-settings-page');
 pager(find('.u4ts-form'),fields,['محتوى الواجب','التسليم والتقويم'],[find('#u4ts-assign'),find('#u4ts-draft')]);
 const reviewStep=find('[data-screen="4"]'),reviewColumns=document.createElement('div'),feedback=document.createElement('div');
 reviewColumns.className='u4ts-reviewcolumns';feedback.className='u4ts-feedback';
 const reviewChildren=Array.from(reviewStep.children);reviewStep.append(reviewColumns);
 reviewColumns.append(reviewChildren[1],feedback);reviewChildren.slice(2).forEach(p=>feedback.append(p));
 // Split reading support and Reflect without losing selections.
 const support=find('[data-screen="5"]');const parts=Array.from(support.children);
 const reading=document.createElement('div'),reflect=document.createElement('div');
 support.insertBefore(reading,parts[1]);support.insertBefore(reflect,parts[3]);
 reading.append(parts[1],parts[2]);parts.slice(3,-1).forEach(p=>reflect.append(p));
 pager(support,[reading,reflect],['القارئ الشامل','ريفلكت'],[parts[parts.length-1]]);
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
 const decisions=find('[data-screen="6"]');
 pager(decisions,rows,['الدرجات','الواجبات والنشاط','ريفلكت','تقدّم القراءة'],[find('[data-check="decisions"]').parentElement]);
 find('[data-screen="6"] .u4ts-task p').textContent='اقرأ المؤشر واختر القرار المناسب بجواره، ثم انتقل إلى المؤشر التالي. تحقّق من إجاباتك بعد المؤشر الرابع.';
 find('[data-screen="5"] .u4ts-task p').textContent='اختر إعدادات القراءة، ثم انتقل إلى جزء ريفلكت. تحقّق من إجاباتك في نهاية الجزأين.';
 find('#u4ts-restart').addEventListener('click',()=>pagers.forEach(reset=>reset()));
 // Show validation errors in their own panel on the next attempt.
 find('[data-reset="decisions"]').addEventListener('click',()=>pagers[2]());
 // A compact frame and a genuine full screen option; browser permission comes from the click.
 const expand=document.createElement('button');expand.type='button';expand.className='u4ts-sound';expand.textContent='⛶ تكبير النشاط';expand.setAttribute('aria-label','عرض النشاط بملء الشاشة');
 find('.u4ts-user').prepend(expand);
 expand.addEventListener('click',async()=>{try{if(document.fullscreenElement){await document.exitFullscreen();}else{await document.documentElement.requestFullscreen();}}catch(e){window.open(location.href,'_blank','noopener');}});
 document.addEventListener('fullscreenchange',()=>{expand.textContent=document.fullscreenElement?'⛶ تصغير النشاط':'⛶ تكبير النشاط';});
})();
