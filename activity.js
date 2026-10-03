
(function(){
  var root=document.getElementById('u4ts-root');
  if(!root||root.getAttribute('data-ready'))return;root.setAttribute('data-ready','1');
  function q(s){return root.querySelector(s);}
  function qa(s,c){var l=(c||root).querySelectorAll(s),r=[];for(var i=0;l.length>i;i++)r.push(l[i]);return r;}
  var TOTAL=7,cur=1,done={1:true,7:true},cb=null,lastFocus=null;

  /* ---------- المؤثرات الصوتية (تُولَّد في المتصفح دون ملفات) ---------- */
  var AC=null,soundOn=true;
  function ac(){
    if(!AC){var C=window.AudioContext||window.webkitAudioContext;if(!C)return null;AC=new C();if(!AC)return null;}
    if(AC.state==='suspended')AC.resume();return AC;
  }
  function tone(c,f,t,d,type,vol,f2){
    var o=c.createOscillator(),g=c.createGain();o.type=type||'sine';
    o.frequency.setValueAtTime(f,c.currentTime+t);
    if(f2)o.frequency.exponentialRampToValueAtTime(f2,c.currentTime+t+d);
    g.gain.setValueAtTime(0.0001,c.currentTime+t);
    g.gain.exponentialRampToValueAtTime(vol||0.12,c.currentTime+t+0.012);
    g.gain.exponentialRampToValueAtTime(0.0001,c.currentTime+t+d);
    o.connect(g);g.connect(c.destination);o.start(c.currentTime+t);o.stop(c.currentTime+t+d+0.03);
  }
  var SFX={
    tap:function(c){tone(c,880,0,0.06,'sine',0.07);},
    place:function(c){tone(c,520,0,0.07,'triangle',0.11,780);tone(c,1040,0.05,0.06,'sine',0.05);},
    remove:function(c){tone(c,700,0,0.09,'triangle',0.09,380);},
    correct:function(c){[523.25,659.25,783.99].forEach(function(f,i){tone(c,f,i*0.09,0.22,'sine',0.13);});tone(c,1046.5,0.27,0.35,'sine',0.09);},
    wrong:function(c){tone(c,330,0,0.16,'triangle',0.11,300);tone(c,247,0.15,0.26,'triangle',0.11,220);},
    info:function(c){tone(c,660,0,0.12,'sine',0.08);tone(c,880,0.1,0.16,'sine',0.07);},
    finish:function(c){[523.25,659.25,783.99,1046.5].forEach(function(f,i){tone(c,f,i*0.11,0.3,'sine',0.12);});[523.25,659.25,783.99].forEach(function(f){tone(c,f,0.5,0.7,'sine',0.06);});}
  };
  function play(n){if(!soundOn)return;var c=ac();if(c&&SFX[n])SFX[n](c);}
  q('#u4ts-sound').addEventListener('click',function(){
    soundOn=!soundOn;this.setAttribute('aria-pressed',soundOn?'true':'false');
    this.setAttribute('aria-label',soundOn?'كتم الصوت':'تشغيل الصوت');if(soundOn)play('tap');
  });

  /* ---------- الرسائل ---------- */
  function msg(type,title,text,btn,callback,list,sound){
    lastFocus=document.activeElement;
    play(sound||(type==='success'?'correct':(type==='warning'?'wrong':'info')));
    q('#u4ts-msg').className='u4ts-msg '+type;
    q('#u4ts-mt').textContent=title;
    var mb=q('#u4ts-mb');mb.textContent='';
    if(text){var pe=document.createElement('p');pe.textContent=text;mb.appendChild(pe);}
    if(list&&list.length){var ul=document.createElement('ul');list.forEach(function(i){var li=document.createElement('li');li.textContent=i;ul.appendChild(li);});mb.appendChild(ul);}
    q('#u4ts-ma').textContent=btn||'إغلاق';
    cb=callback||null;
    var md=q('#u4ts-modal');
    if(window.self!==window.top&&lastFocus&&lastFocus.getBoundingClientRect){
      var y=lastFocus.getBoundingClientRect().top;md.style.alignItems='flex-start';md.style.paddingTop=Math.max(16,y-260)+'px';
    }
    md.classList.add('on');
    setTimeout(function(){q('#u4ts-ma').focus();},30);
  }
  function closeMsg(){q('#u4ts-modal').classList.remove('on');if(lastFocus&&lastFocus.focus)lastFocus.focus();}
  q('#u4ts-x').addEventListener('click',closeMsg);
  q('#u4ts-ma').addEventListener('click',function(){var f=cb;cb=null;closeMsg();if(f)f();});
  q('#u4ts-modal').addEventListener('click',function(e){if(e.target===this)closeMsg();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&q('#u4ts-modal').classList.contains('on'))closeMsg();});

  /* ---------- التنقل ---------- */
  var navFor={3:'assign',4:'assign',5:'reflect',6:'insights'};
  function show(n,init){
    qa('.u4ts-screen').forEach(function(s){s.classList.toggle('on',+s.getAttribute('data-screen')===n);});
    cur=n;
    q('#u4ts-step').textContent='الخطوة '+n+' من '+TOTAL;
    q('#u4ts-bar').style.width=(n/TOTAL*100)+'%';
    q('#u4ts-prev').style.visibility=n===1?'hidden':'visible';
    var nx=q('#u4ts-next');
    nx.textContent=n===1?'ابدأ النشاط':(n===TOTAL?'إنهاء النشاط':'التالي');
    nx.classList.toggle('wait',!done[n]);
    qa('.u4ts-navitem').forEach(function(i){i.classList.toggle('on',i.getAttribute('data-nav')===(navFor[n]||'posts'));});
    if(init)return;
    var h=q('.u4ts-screen.on h3');if(h){h.setAttribute('tabindex','-1');h.focus({preventScroll:true});}
  }
  function complete(n){done[n]=true;if(cur===n)q('#u4ts-next').classList.remove('wait');}
  function goNext(){if(TOTAL>cur)show(cur+1);}
  q('#u4ts-prev').addEventListener('click',function(){if(cur>1){play('tap');show(cur-1);}});
  q('#u4ts-next').addEventListener('click',function(){
    if(cur===TOTAL){msg('success','أنهيت النشاط بنجاح','يمكنك الآن الانتقال إلى المحور التالي.',null,null,null,'finish');return;}
    if(!done[cur]){msg('warning','أكمل المهمة أولًا','أكمل التفاعل في هذه الخطوة، واضغط زر التحقّق قبل الانتقال إلى الخطوة التالية.');return;}
    play('tap');goNext();
  });
  function successNext(title,text){msg('success',title,text,'الانتقال إلى الخطوة التالية',goNext);}

  /* ---------- الخطوة 2: الترتيب ---------- */
  var ORDER=['team','channel','post','file','assign'];
  var slots=qa('#u4ts-slots .u4ts-slotbtn'),slotDefault=slots.map(function(s){return s.textContent;});
  qa('#u4ts-pool .u4ts-card').forEach(function(card){
    card.addEventListener('click',function(){
      var empty=slots.filter(function(s){return !s.getAttribute('data-key');})[0];
      if(!empty)return;
      empty.setAttribute('data-key',card.getAttribute('data-key'));
      empty.textContent=card.querySelector('strong').textContent;
      empty.classList.add('filled');empty.classList.remove('ok','bad');
      card.hidden=true;play('place');
    });
  });
  slots.forEach(function(s,i){
    s.addEventListener('click',function(){
      var k=s.getAttribute('data-key');if(!k)return;
      q('#u4ts-pool .u4ts-card[data-key="'+k+'"]').hidden=false;
      s.removeAttribute('data-key');s.textContent=slotDefault[i];s.classList.remove('filled','ok','bad');play('remove');
      q('#u4ts-pathline').classList.remove('on');
    });
  });
  q('#u4ts-order-check').addEventListener('click',function(){
    var keys=slots.map(function(s){return s.getAttribute('data-key');});
    if(keys.some(function(k){return !k;})){msg('warning','رتّب جميع البطاقات أولًا','ضع البطاقات الخمس في خانات الترتيب، ثم اضغط «تحقّق من الترتيب».');return;}
    var right=0;
    slots.forEach(function(s,i){var ok=keys[i]===ORDER[i];if(ok)right++;s.classList.remove('ok','bad');s.classList.add(ok?'ok':'bad');});
    if(right===5){
      q('#u4ts-pathline').classList.add('on');complete(2);
      successNext('ترتيب مناسب','يبدأ تنظيم الصف الرقمي من فريق الصف، ثم القناة، ثم المنشورات، ثم الملفات، ثم الواجبات. ويمثّل هذا الترتيب نموذجًا تنظيميًّا يمكن تكييفه وفق طبيعة الدرس واحتياجات الطلبة.');
    }else{
      msg('warning','راجع الترتيب','عدد البطاقات في موضعها الصحيح: '+right+' من 5. راجع وظيفة كل عنصر، واسأل نفسك:','حاول مرة أخرى',null,['أين تبدأ بيئة الصف؟','وأين تُنظَّم الموضوعات؟','وأين تظهر التعليمات؟','وأين تُحفظ الموارد؟','وأين يسلّم الطلبة الواجب؟']);
    }
  });
  function resetOrder(){
    slots.forEach(function(s,i){s.removeAttribute('data-key');s.textContent=slotDefault[i];s.classList.remove('filled','ok','bad');});
    qa('#u4ts-pool .u4ts-card').forEach(function(c){c.hidden=false;});
    q('#u4ts-pathline').classList.remove('on');
  }
  q('#u4ts-order-reset').addEventListener('click',resetOrder);

  /* ---------- الخطوة 3: محاكاة الواجب ---------- */
  var fileChosen='',assignTries=0;
  var FILES={video:'فيديو تعليمي',template:'قالب التقرير',image:'صورة توضيحية'};
  q('#u4ts-attach-btn').addEventListener('click',function(){play('tap');var p=q('#u4ts-picker');p.classList.toggle('on');});
  qa('#u4ts-picker button').forEach(function(b){b.addEventListener('click',function(){
    fileChosen=b.getAttribute('data-file');play('place');q('#u4ts-filename').textContent=FILES[fileChosen];
    var chip=q('#u4ts-chipfile');chip.classList.add('on');chip.classList.remove('ok','bad');
    q('#u4ts-picker').classList.remove('on');
  });});
  function norm(t){
    return (t||'').replace(/[٠-٩]/g,function(d){return d.charCodeAt(0)-0x0660;})
      .replace(/[۰-۹]/g,function(d){return d.charCodeAt(0)-0x06F0;})
      .replace(/[ً-ْـ]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه')
      .replace(/[–—\-_،,.:؛]/g,' ').replace(/\s+/g,' ').trim().toLowerCase();
  }
  function hasNum(t,n){var parts=[],cur2='';for(var i=0;t.length>i;i++){var ch=t.charAt(i);if(ch>='0'&&ch<='9')cur2+=ch;else{if(cur2)parts.push(cur2);cur2='';}}if(cur2)parts.push(cur2);return parts.indexOf(n)>-1;}
  function mark(el,ok){el.classList.remove('ok','bad');el.classList.add(ok?'ok':'bad');}
  q('#u4ts-assign').addEventListener('click',function(){
    var f={title:q('#u4ts-f-title'),ins:q('#u4ts-f-ins'),day:q('#u4ts-f-day'),time:q('#u4ts-f-time'),points:q('#u4ts-f-points'),rubric:q('#u4ts-f-rubric'),ai:q('#u4ts-f-ai')};
    var t=norm(f.title.value),ins=norm(f.ins.value),topic=/امن (ال)?رقمي/;
    var insParts={topic:topic.test(ins),count:hasNum(ins,'150')&&hasNum(ins,'200')&&ins.indexOf('كلم')>-1,tpl:ins.indexOf('قالب')>-1};
    var c={
      title:t.indexOf('تقرير')>-1&&topic.test(t),
      ins:insParts.topic&&insParts.count&&insParts.tpl,
      file:fileChosen==='template',
      day:f.day.value==='tue',time:f.time.value==='20',
      points:norm(f.points.value)==='10',
      rubric:f.rubric.value==='rubric',ai:f.ai.value==='brain'
    };
    mark(f.title,c.title);mark(f.ins,c.ins);mark(f.day,c.day);mark(f.time,c.time);mark(f.points,c.points);mark(f.rubric,c.rubric);mark(f.ai,c.ai);
    var chip=q('#u4ts-chipfile');if(chip.classList.contains('on'))mark(chip,c.file);else mark(q('#u4ts-attach-btn'),false);
    var miss=[];
    if(!c.title)miss.push('العنوان: اكتب «تقرير الأمن الرقمي».');
    if(!c.ins){
      var p=[];if(!insParts.topic)p.push('موضوع التقرير (الأمن الرقمي)');if(!insParts.count)p.push('عدد الكلمات (من 150 إلى 200 كلمة)');if(!insParts.tpl)p.push('استخدام قالب التقرير');
      miss.push('التعليمات: أضف '+p.join('، و')+'.');
    }
    if(!c.file)miss.push('المرفقات: أرفق «قالب التقرير» من زر «إرفاق».');
    if(!c.day||!c.time)miss.push('موعد التسليم: يوم الثلاثاء الساعة 8:00 مساءً.');
    if(!c.points)miss.push('النقاط: 10 نقاط.');
    if(!c.rubric)miss.push('معيار التقويم: أضف معيار تقويم التقرير.');
    if(!c.ai)miss.push('إرشادات الذكاء الاصطناعي: اختر المستوى الذي تنص عليه بطاقة المهمة.');
    if(!miss.length){
      q('#u4ts-attach-btn').classList.remove('bad');complete(3);
      successNext('عُيِّن الواجب للطلبة','أحسنت. حوّلت متطلبات المهمة إلى واجب منظّم يتضمن عنوانًا واضحًا، وتعليمات محددة، وموردًا داعمًا، وموعد تسليم، ونقاطًا ومعيار تقويم، وإرشادات لاستخدام الذكاء الاصطناعي.');
    }else{
      assignTries++;
      msg('warning','راجع إعداد الواجب',assignTries>=2?'قارن كل حقل مُعلَّم بما تنص عليه بطاقة المهمة:':'بعض الحقول لا تطابق بطاقة المهمة. الحقول المُعلَّمة باللون البرتقالي تحتاج إلى مراجعة:','حاول مرة أخرى',null,assignTries>=2?miss:miss.map(function(m){return m.split(':')[0];}));
    }
  });
  q('#u4ts-draft').addEventListener('click',function(){msg('info','حُفظ الواجب مسودةً','لن يظهر الواجب المحفوظ مسودةً للطلبة حتى تختار «تعيين» (Assign). لإكمال المهمة، راجع الحقول ثم اختر «تعيين».');});
  function resetAssign(){
    ['#u4ts-f-title','#u4ts-f-ins','#u4ts-f-day','#u4ts-f-time','#u4ts-f-points','#u4ts-f-rubric','#u4ts-f-ai'].forEach(function(id){var el=q(id);el.classList.remove('ok','bad');if(el.tagName==='SELECT')el.selectedIndex=0;else el.value='';});
    fileChosen='';assignTries=0;q('#u4ts-filename').textContent='';q('#u4ts-chipfile').classList.remove('on','ok','bad');q('#u4ts-picker').classList.remove('on');q('#u4ts-attach-btn').classList.remove('bad');
  }
  q('#u4ts-assign-reset').addEventListener('click',function(){resetAssign();});

  /* ---------- اختيارات الخطوتين 4 و5 ---------- */
  qa('[data-single]').forEach(function(box){
    qa('button',box).forEach(function(b){b.addEventListener('click',function(){
      qa('button',box).forEach(function(x){x.setAttribute('aria-pressed','false');});
      b.setAttribute('aria-pressed','true');box.classList.remove('ok','bad');play('place');
    });});
  });
  qa('[data-multi]').forEach(function(box){
    qa('button',box).forEach(function(b){b.addEventListener('click',function(){
      var on=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',on?'true':'false');
      box.classList.remove('ok','bad');qa('button',box).forEach(function(x){x.classList.remove('ok','bad');});play(on?'place':'remove');
    });});
  });
  function single(name){var box=q('[data-single="'+name+'"]'),s=box.querySelector('[aria-pressed="true"]');return {box:box,chosen:!!s,ok:!!s&&s.getAttribute('data-ok')==='1'};}
  function flag(r){r.box.classList.remove('ok','bad');r.box.classList.add(r.ok?'ok':'bad');}
  function clearStep(n){qa('[data-screen="'+n+'"] [aria-pressed]').forEach(function(x){x.setAttribute('aria-pressed','false');x.classList.remove('ok','bad');});qa('[data-screen="'+n+'"] [data-single],[data-screen="'+n+'"] [data-multi]').forEach(function(x){x.classList.remove('ok','bad');});}
  qa('[data-clear]').forEach(function(b){b.addEventListener('click',function(){clearStep(b.getAttribute('data-clear'));});});

  /* الخطوة 4: التغذية الراجعة */
  q('#u4ts-fb-check').addEventListener('click',function(){
    var fb=single('fb'),act=single('act');
    if(!fb.chosen||!act.chosen){msg('warning','أكمل الاختيار','اختر التغذية الراجعة والإجراء المناسب، ثم اضغط «تحقّق».');return;}
    flag(fb);flag(act);
    var tips=[];
    if(!fb.ok)tips.push('التغذية الراجعة: التعليق العام أو القاسي لا يساعد الطالب. اختر تعليقًا يبدأ بنقطة قوة، ويحدد ما ينقص العمل وفق معيار التقويم، ويقترح خطوة تالية واضحة.');
    if(!act.ok)tips.push('الإجراء: الطالب يحتاج إلى تعديل تقريره وتسليمه مرة أخرى؛ فأيّ إجراء يتيح له ذلك؟');
    if(!tips.length){complete(4);successNext('تغذية راجعة فاعلة','بدأت التغذية الراجعة بنقطة قوة، وحددت ما ينقص العمل وفق معيار التقويم، واقترحت خطوة تالية واضحة. واخترت «إرجاع للمراجعة» لأن الطالب يحتاج إلى تعديل عمله وتسليمه مرة أخرى.');}
    else msg('warning','راجع اختيارك','',
      'حاول مرة أخرى',null,tips);
  });

  /* الخطوة 5: القارئ الشامل وريفلكت */
  q('#u4ts-sup-check').addEventListener('click',function(){
    var irBox=q('[data-multi="ir"]'),irSel=qa('[aria-pressed="true"]',irBox);
    var rq=single('rq'),rn=single('rn');
    if(!irSel.length||!rq.chosen||!rn.chosen){msg('warning','أكمل الجزأين','اختر إعدادات القارئ الشامل، وسؤال المراجعة القصيرة، وطريقة عرض النتائج، ثم اضغط «تحقّق».');return;}
    var irWrong=irSel.filter(function(x){return x.getAttribute('data-ok')!=='1';}).length,irRight=irSel.length-irWrong;
    irSel.forEach(function(x){x.classList.remove('ok','bad');x.classList.add(x.getAttribute('data-ok')==='1'?'ok':'bad');});
    var irOk=!irWrong&&irRight===3;
    flag(rq);flag(rn);
    var tips=[];
    if(!irOk)tips.push(irWrong?'القارئ الشامل: اختر الإعدادات المرتبطة بالمشكلة فقط (حجم الخط، والتباعد، وتتبّع السطر). وتذكّر أن تمييز أجزاء الكلام والقاموس المصور غير متاحين حاليًا للنص العربي في محادثات Teams وقنواته.':'القارئ الشامل: عدد الإعدادات المناسبة التي اخترتها: '+irRight+' من 3. راجع المشكلات الثلاث: صغر الخط، وتقارب الكلمات، وفقدان السطر.');
    if(!rq.ok)tips.push('سؤال ريفلكت: اختر سؤالًا مرتبطًا بالتعلم والثقة تجاه المهمة، وتجنّب الأسئلة عن الدرجات أو الأسئلة الشخصية والحساسة.');
    if(!rn.ok)tips.push('عرض النتائج: احمِ هوية الطلبة بإخفاء الأسماء عند عرض النتائج أمام الصف.');
    if(!tips.length){complete(5);successNext('دعم مناسب للتعلم','اخترت من القارئ الشامل الإعدادات التي تعالج حاجة الطالبة فقط، وأنشأت مراجعة قصيرة في ريفلكت بسؤال مرتبط بالتعلم مع حماية خصوصية الطلبة. وستظهر استجاباتهم في لوحة الرؤى في الخطوة التالية.');}
    else msg('warning','راجع اختيارك','','حاول مرة أخرى',null,tips);
  });

  /* ---------- الخطوة 6: من المؤشر إلى القرار ---------- */
  var GROUPS={
    decisions:{step:6,opts:[['reading','تدريب قرائي قصير'],['simplify','تبسيط التعليمات وتقسيم المهمة'],['follow','متابعة فردية'],['enrich','نشاط إثرائي']],
      ok:['قرار مبني على البيانات','تصبح البيانات أكثر فائدة عندما تتحول إلى إجراء تعليمي واضح. تعرض الرؤى المؤشرات، ويتولى المعلم تفسيرها واختيار الدعم المناسب.'],
      bad:'راجع طبيعة المؤشر: هل يرتبط بالقراءة؟ أم بالشعور تجاه المهمة؟ أم بالالتزام بالتسليم؟ أم بالأداء المتقدم؟'}
  };
  Object.keys(GROUPS).forEach(function(g){
    var G=GROUPS[g];
    qa('[data-group="'+g+'"] .u4ts-row').forEach(function(row,ri){
      var box=row.querySelector('.u4ts-opts');box.setAttribute('role','group');box.setAttribute('aria-label','الخيارات للبند '+(ri+1));
      G.opts.forEach(function(o){
        var b=document.createElement('button');b.type='button';b.className='u4ts-chip';b.setAttribute('data-val',o[0]);b.setAttribute('aria-pressed','false');b.textContent=o[1];
        b.addEventListener('click',function(){qa('.u4ts-chip',box).forEach(function(x){x.setAttribute('aria-pressed','false');});b.setAttribute('aria-pressed','true');row.classList.remove('ok','bad');play('place');});
        box.appendChild(b);
      });
    });
    q('[data-check="'+g+'"]').addEventListener('click',function(){
      var rows=qa('[data-group="'+g+'"] .u4ts-row'),right=0,blank=false;
      rows.forEach(function(r){var s=r.querySelector('.u4ts-chip[aria-pressed="true"]');if(!s)blank=true;});
      if(blank){msg('warning','أكمل الاختيار','اختر إجابة لكل بند قبل التحقّق من المطابقة.');return;}
      rows.forEach(function(r){var ok=r.querySelector('.u4ts-chip[aria-pressed="true"]').getAttribute('data-val')===r.getAttribute('data-answer');if(ok)right++;r.classList.remove('ok','bad');r.classList.add(ok?'ok':'bad');});
      if(right===rows.length){complete(G.step);successNext(G.ok[0],G.ok[1]);}
      else msg('warning','راجع المطابقة','عدد المطابقات الصحيحة: '+right+' من '+rows.length+'. '+G.bad,'حاول مرة أخرى');
    });
    q('[data-reset="'+g+'"]').addEventListener('click',function(){resetGroup(g);});
  });
  function resetGroup(g){qa('[data-group="'+g+'"] .u4ts-row').forEach(function(r){r.classList.remove('ok','bad');qa('.u4ts-chip',r).forEach(function(x){x.setAttribute('aria-pressed','false');});});}

  /* ---------- إعادة النشاط ---------- */
  q('#u4ts-restart').addEventListener('click',function(){
    done={1:true,7:true};resetOrder();resetAssign();clearStep(4);clearStep(5);resetGroup('decisions');
    show(1);msg('info','أُعيد النشاط إلى بدايته','يمكنك الآن تنفيذ النشاط من الخطوة الأولى.');
  });

  show(1,true);
})();
