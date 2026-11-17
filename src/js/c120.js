// Блок «Нам 120» — варианты: 1 «Спил из фотографий», 2 «Покрути время».
// Архив: фонд Канского краеведческого музея (публикации театра «Страницы памяти», 2024).
const A = '/img/arch/', T = '/img/arch/t/', MUS = 'Фонд Канского краеведческого музея';

const TH = 'Архив театра';
// каждый пункт: c — подпись, s — своя история; txt — текстовая плитка
export const ERAS = [
  { k: '1907–1920', t: 'Начало', d: 'Театр начинался с любителей. 5 апреля 1907 года Енисейская губернская канцелярия зарегистрировала Канское «Общество любителей драматического искусства, музыки и пения» — спектакли давали в здании Общественного собрания. В 1920-м на основе общества создан государственный театр.',
    items: [
      { img: A + 'doska.jpg', c: 'Памятная доска на здании театра', s: '«Общество любителей драматического искусства, музыки и пения. 5 апреля 1907». С этой даты театр ведёт свой возраст.', src: TH },
      { txt: '1907', c: '5 апреля 1907', s: 'Общество зарегистрировано Енисейской губернской канцелярией; его устав хранится в краевом архиве. Долгое время днём рождения театра считали 1920 год — теперь отсчёт ведут от 1907-го.' },
      { txt: 'Общест­венное собрание', c: 'Первая сцена', s: 'Первые спектакли любители давали в здании Канского Общественного собрания.' },
      { txt: 'Устав', c: 'Устав общества', s: 'Устав Общества любителей драматического искусства, музыки и пения сохранился — он хранится в краевом архиве.' },
      { txt: '5 артистов', c: 'Из Иркутска', s: 'В 1920 году по приглашению ревкома в Канск приезжают пять артистов Иркутского театра. С них начинается профессиональная труппа.' },
      { txt: '1920', c: 'Государственный театр', s: 'По приглашению Канского ревкома из Иркутска приезжают пять профессиональных артистов — на основе общества рождается государственный театр.' }
    ] },
  { k: '1930–40-е', t: 'Горгостеатр и война', d: 'В 1930-е театр называется Канский горгостеатр. В годы войны актёры уходили на фронт прямо со сцены, а в Канск был эвакуирован Грозненский драматический театр. Первый мирный сезон, 1945/46, открывается комедией и пьесой приключений.',
    items: [
      { img: A + '1937.jpg', c: 'Коллектив горгостеатра, сезон 1937/38', s: 'Так подписан снимок в музейном фонде: «Коллектив Канского горгостеатра, сезон 1937–1938 года».', src: MUS },
      { txt: '1941', c: 'Война', s: 'Актёры уходили на фронт прямо со сцены. В Канск эвакуирован Грозненский драматический театр — по словам старого буклета, он «своей плодотворной работой оживляет театральную жизнь города».' },
      { img: A + '1945a.jpg', c: '«Чужой ребёнок», сезон 1945/46', s: 'Комедия В. Шкваркина. Программа выпущена Отделом по делам искусств при Красноярском крайисполкоме.', src: MUS },
      { img: A + '1945b.jpg', c: '«Ровно в полночь», сезон 1945/46', s: 'Пьеса приключений в 4-х актах, 8 картинах — тот же первый мирный сезон.', src: MUS }
    ] },
  { k: '1950–60-е', t: 'Городской театр', d: 'Канский городской драматический театр считает годы работы с 1920-го: сезон 1954/55 — 35-й. Артисты помогают заводской самодеятельности, выходят с театром на улицы города. В семьях складываются актёрские династии.',
    items: [
      { img: A + '1954.jpg', c: '«35-й год работы. Сезон 1954–55»', s: 'Обложка программы Канского городского драматического театра.', src: MUS },
      { img: A + 'buklet.jpg', c: 'Буклет городского театра', s: '«Канский городской драматический театр начал свой творческий путь в 1920 г.» — из буклета театра.', src: MUS },
      { img: A + 'saln-arch.jpg', c: 'Программки из семейного архива Сальниковых', s: 'Владимир Сальников — актёр в третьем поколении династии Сальниковых. Первую роль он сыграл ребёнком, в 1956 году.', src: TH },
      { img: A + 'grim.jpg', c: 'Урок грима', s: 'Старейший артист театра учит гриму участников художественной самодеятельности заводского клуба: театр был консультационным пунктом для самодеятельных коллективов.', src: MUS },
      { img: A + 'scena1.jpg', c: 'Сцена из спектакля', s: 'Архивный снимок из театральных папок. Год на нём не подписан.', src: TH },
      { img: A + 'scena2.jpg', c: 'Труппа на сцене', s: 'Ещё один снимок из архива театра — костюмный спектакль, год не подписан.', src: TH },
      { img: A + '1967.jpg', c: 'Дед Щукарь, 1967', s: 'Старейший артист театра, на сцене с 30-х годов, — в роли деда Щукаря на праздничной демонстрации 1967 года.', src: MUS }
    ] },
  { k: '1970-е', t: 'Полвека', d: 'В декабре 1970 года театр отмечает 50 лет государственной труппе: торжественный вечер, полный зал, выставка в фойе, памятные адреса работникам театра.',
    items: [
      { img: A + '1970.jpg', c: 'Торжественный вечер к 50-летию', s: 'Сцена и зал в день юбилея, декабрь 1970-го.', src: MUS },
      { img: A + '1970b.jpg', c: 'Зрители юбилейного вечера', s: 'Аплодисменты театру — 50 лет.', src: MUS },
      { img: A + '1970c.jpg', c: '«50 лет Канскому драматическому театру»', s: 'Памятный адрес работнику театра в связи с 50-летним юбилеем, декабрь 1970.', src: MUS },
      { img: A + '1970d.jpg', c: 'Выставка к юбилею', s: 'Фойе в дни юбилея: афиши, фотографии, сувениры театра.', src: MUS },
      { img: A + '1970e.jpg', c: 'Юбилейный вечер', s: 'Труппа и гости юбилейного вечера.', src: MUS },
      { img: A + 'raspred.jpg', c: 'Распределение ролей', s: '«Хитроумная влюблённая»: Фениса — М. Любина, капитан Бернардо — В. Сальников. Машинописный лист из архива театра.', src: TH },
      { img: A + 'bobina.jpg', c: 'Магнитофонная бобина', s: 'На таких плёнках хранились фонограммы спектаклей.', src: TH }
    ] },
  { k: '1980-е', t: '«Всем, кто любит театр»', d: 'Театр — Государственный Канский драматический. Зрителей зовут телеграммами: «Куда: г. Канск. Кому: всем, кто любит театр». В 1982-м впервые на канской сцене — музыкальная комедия. В 1985-м в труппу приходит Олег Мичков.',
    items: [
      { img: A + '1982a.jpg', c: 'Телеграмма на «Проделки Ханумы», 1982', s: '«Кому: всем, кто любит комедию». Впервые на сцене Канского театра — музыкальная комедия.', src: MUS },
      { img: A + 'michkovy.jpg', c: 'Династия Мичковых', s: 'Екатерина Мичкова — заслуженная артистка РСФСР, служила в театре до 2001 года. Её сын Олег — заслуженный артист Красноярского края, в театре с 1985-го. Внучка Валерия — актриса в Петербурге.', src: TH },
      { img: A + '1982c.jpg', c: 'Репертуар сезона', s: '«Не беспокойся, мама!», «Свадьба Кречинского», «Здравствуй, Чехов!», «Балерина политотдела», «В день свадьбы».', src: MUS },
      { img: A + '1982e.jpg', c: 'Профсоюзный билет Екатерины Мичковой', s: 'Документ из архива — билет мамы Олега Мичкова.', src: MUS },
      { img: A + '1982b.jpg', c: 'Телеграмма к открытию сезона, 1982', s: 'Театр открывает сезон 8 октября и приглашает зрителей телеграммой.', src: MUS },
      { img: A + 'hanuma.jpg', c: '«Проделки Ханумы», 1982', s: 'Постановочная группа: режиссёр Дмитрий Свидерский из Павлодара, художник Виталий Шадуренко. В спектакле заняты ведущие артисты театра, среди них — Екатерина Мичкова.', src: MUS },
      { img: A + 'dogovor.jpg', c: 'Договор о содружестве, 1982', s: 'Договор о социалистическом содружестве коллективов Канского ХБК и Государственного драматического театра.', src: TH },
      { img: A + 'gramota.jpg', c: 'Почётная грамота Екатерине Мичковой', s: 'Актрисе Канского драматического театра — за участие в эстетическом воспитании и в связи с 25-летием сценической деятельности.', src: MUS },
      { img: A + 'repert2.jpg', c: 'Репертуар с «Ханумой»', s: '«Жестокость», «Колонисты», «Ханума», а для детей — «Кошка, которая гуляла сама по себе», «Снежная королева», «Шишок».', src: MUS },
      { img: A + 'chaika.jpg', c: '«Чайка» А. П. Чехова', s: 'Книга о постановках «Чайки» из театральной библиотеки, 1980.', src: TH },
      { img: A + 'vto.jpg', c: 'Членский билет ВТО', s: 'Всероссийское театральное общество — билет актрисы театра, 1980-е.', src: MUS },
      { img: A + 'vedomost.jpg', c: 'Ведомость Советского фонда мира', s: 'Взносы работников драматического театра — подписи всей труппы.', src: MUS },
      { img: A + '1982d.jpg', c: 'Телеграмма «Всем, кто любит театр»', s: 'Так театр звал зрителей в 1980-е.', src: MUS },
      { img: A + '1989.jpg', c: 'Членский билет СТД РСФСР, 1989', s: 'Союз театральных деятелей — профессиональный союз артистов.', src: MUS }
    ] },
  { k: '1990–2000-е', t: 'Свой дом', d: 'В 1993 году театр получает постоянное здание — окна фойе выходят прямо в сосновый бор. В 1990-е приходят артистки, которые служат здесь больше 30 лет. В 2007-м театр отмечает столетие.',
    items: [
      { img: '/img/zdanie.jpg', c: 'Здание театра', s: 'Свой дом с 1993 года.' },
      { txt: '1993', c: 'Свой дом', s: 'Театр обретает постоянное здание.' },
      { img: A + 'gazeta.jpg', c: '«Две встречи»', s: 'Газета о гастролях: свой 85-й сезон Канский государственный драматический театр начал с гастролей в Железногорске.', src: TH },
      { img: A + 'lat-role.jpg', c: 'Галина Латышева в роли', s: 'Заслуженная артистка Красноярского края, больше 30 лет на сцене театра. Её героини — в спектаклях «Фотография, на которой меня нет», «Волки и овцы», «Баба Шанель».', src: TH },
      { img: A + 'vhs.jpg', c: 'Видеокассета', s: 'Спектакли 1990-х записывали на VHS — кассеты до сих пор лежат в архиве театра.', src: TH },
      { txt: '2007', c: 'Сто лет', s: 'Театр отмечает вековой юбилей.' },
      { img: A + 'zem-role.jpg', c: 'Людмила Земцова в роли', s: 'В 2025 году — двойной юбилей: 60 лет, из них 30 на канской сцене.', src: TH },
      { img: A + 'smir-role.jpg', c: 'Ольга Смирнова в роли', s: 'На канской сцене с конца 1980-х. Её образы — от «Головлёвых» до «Бабы Шанель».', src: TH }
    ] },
  { k: 'Сегодня', t: '120-й сезон', d: 'Новые директор и главный режиссёр, премьеры, лаборатории, гастроли, выезды в детские сады. В 2025-м зрители подписали полотно пожеланий к 118-летию. 5 апреля 2027 театру — 120.',
    items: [
      { img: A + '2025.jpg', c: 'Полотно пожеланий, 2025', s: 'В день рождения зрители оставили пожелания на полотне в фойе — и вся труппа вышла с ним на сцену.', src: TH },
      { img: A + 'benefis.jpg', c: 'Бенефис Владимира Сальникова, 2022', s: 'Сам себя называет «живой историей» театра: больше 50 ролей. В 75 лет — бенефис на спектакле «Продавец дождя».', src: TH },
      { img: A + 'saln1.jpg', c: 'Владимир Сальников в роли', s: 'Актёр в третьем поколении династии Сальниковых.', src: TH },
      { img: A + 'golovlevy.jpg', c: '«Головлёвы. Страшная сказка»', s: 'Афиша спектакля по Салтыкову-Щедрину.', src: TH },
      { img: A + 'saln2.jpg', c: 'Сцена из спектакля', s: 'Владимир Сальников на канской сцене.', src: TH },
      { img: '/img/volshebnik.jpg', c: '«Волшебник Изумрудного города»', s: 'Сказка из репертуара театра.' },
      { img: A + 'saln3.jpg', c: 'Сцена из спектакля', s: 'Владимир Сальников на канской сцене.', src: TH },
      { img: A + '2025b.jpg', c: 'Полотно пожеланий, 2025', s: 'Пожелания зрителей к 118-летию.', src: TH },
      { img: '/img/g-kru2.jpg', c: '«Принцесса Кру»', s: 'Спектакль из репертуара театра.' },
      { img: A + 'saln4.jpg', c: 'Сцена из спектакля', s: 'Владимир Сальников на канской сцене.', src: TH },
      { img: '/img/g-lesograd2.jpg', c: 'Спектакль театра', s: 'Сцена из репертуара.' },
      { img: A + 'saln5.jpg', c: 'Сцена из спектакля', s: 'Владимир Сальников на канской сцене.', src: TH },
      { img: '/img/devochka.jpg', c: 'Спектакль театра', s: 'Сцена из репертуара.' },
      { img: '/img/g-romeo.jpg', c: '«Ромео и Джульетта»', s: 'Спектакль, открывший 116-й сезон.' },
      { img: A + 'bor.jpg', c: 'Сосновый бор у театра', s: 'Окна фойе выходят в бор: зимой пахнет дровяным дымом и снегом.', src: TH },
      { img: '/img/g-snezh.jpg', c: '«Снежная королева»', s: 'Сказка из репертуара театра.' },
      { img: A + 'saln-role.jpg', c: 'Владимир Сальников в роли', s: 'Характерный актёр широкого диапазона.', src: TH },
      { img: '/img/g-ledi.jpg', c: 'Спектакль театра', s: 'Сцена из репертуара.' },
      { img: '/img/g-zritel.jpg', c: 'Зрители', s: 'Ради них всё и затевалось в 1907-м.' },
      { img: '/img/g-kru.jpg', c: '«Принцесса Кру»', s: 'Спектакль из репертуара театра.' },
      { img: '/img/g-foye.jpg', c: 'Фойе театра', s: 'Здесь подписывают полотна пожеланий и встречаются перед спектаклем.' },
      { img: '/img/g-lesograd.jpg', c: 'Спектакль театра', s: 'Сцена из репертуара.' },
      { img: '/img/g-more.jpg', c: 'Спектакль театра', s: 'Сцена из репертуара.' }
    ] }
];

export const EV = [
  { y: 1907, t: 'Начало', d: '5 апреля зарегистрировано «Общество любителей драматического искусства, музыки и пения».' },
  { y: 1920, t: 'Государственный театр', d: 'Из Иркутска приезжают пять артистов — в Канске появляется профессиональная труппа.' },
  { y: 1937, t: 'Труппа сезона 1937/38', d: 'Коллектив Канского горгостеатра.', img: A + '1937.jpg', src: MUS },
  { y: 1941, t: 'Война', d: 'Актёры уходили на фронт прямо со сцены.' },
  { y: 1945, t: 'Первый мирный сезон', d: '1945/46: «Чужой ребёнок», «Ровно в полночь».', img: A + '1945a.jpg', src: MUS },
  { y: 1954, t: '35-й год работы', d: 'Программа сезона 1954/55 городского драматического театра.', img: A + '1954.jpg', src: MUS },
  { y: 1967, t: 'Дед Щукарь', d: 'Старейший артист театра — в роли деда Щукаря на праздничной демонстрации.', img: A + '1967.jpg', src: MUS },
  { y: 1970, t: '50 лет', d: 'Юбилейный вечер: полвека государственной труппе.', img: A + '1970.jpg', src: MUS },
  { y: 1982, t: '«Проделки Ханумы»', d: 'Телеграмма зрителям: «Кому: всем, кто любит комедию». Впервые — музыкальная комедия.', img: A + '1982a.jpg', src: MUS },
  { y: 1993, t: 'Свой дом', d: 'Театр обретает постоянное здание.', img: '/img/zdanie.jpg' },
  { y: 2007, t: 'Сто лет', d: 'Театр отмечает вековой юбилей.' },
  { y: 2025, t: '118 лет', d: 'Зрители подписали полотно пожеланий — и вся труппа вышла с ним на сцену.', img: A + '2025.jpg' },
  { y: 2027, t: '120 лет', d: '5 апреля 2027 — юбилей. 120-й сезон уже идёт.' }
];
const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));

export function initSetC(root, { gsap, ScrollTrigger, CALM }) {
  const $ = (s, r = root) => r.querySelector(s), $$ = (s, r = root) => [...r.querySelectorAll(s)];
  const sec = $('[data-c120]'); if (!sec) return;

  /* ---------- 1. Спил из фотографий ---------- */
  {
    const box = $('[data-mos]'), inner = $('.mos__in', box), pan = $('[data-mpan]');
    const S = 56, RAD = ERAS.map((_, i) => 100 + i * 62);
    let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    let html = '<div class="mos__wood"></div><button class="mos__core" data-core aria-label="1907 — начало"><b>1907</b></button>';
    ERAS.forEach((e, ri) => {
      // кольцо заполнено целиком: тексты — по одному разу, фото — сначала целиком, повторно — крупным фрагментом
      const r = RAD[ri], n = Math.floor(2 * Math.PI * r / (S * 1.08)), dur = 170 + ri * 35, dir = ri % 2 ? -1 : 1;
      const txt = e.items.map((it, i) => it.txt ? i : -1).filter(i => i >= 0), pho = e.items.map((it, i) => it.img ? i : -1).filter(i => i >= 0);
      const slots = Array(n).fill(-1); txt.forEach((ti, k) => { slots[Math.floor((k + .5) * n / txt.length)] = ti; });
      const seen = {}; let pk = 0, t = '';
      for (let i = 0; i < n; i++) {
        const idx = slots[i] >= 0 ? slots[i] : pho[pk++ % pho.length], it = e.items[idx], a = i / n * 360;
        let in2;
        if (it.txt) in2 = `<span>${it.txt}</span>`;
        else { const c = seen[idx] = (seen[idx] || 0) + 1, sc = c == 1 ? 1 : 2.2 + rnd() * 1.3, ox = Math.round(15 + rnd() * 70), oy = Math.round(15 + rnd() * 70);
          in2 = `<img src="${it.img}" alt="" loading="lazy" style="object-position:${ox}% ${oy}%;transform:scale(${sc.toFixed(2)})">`; }
        t += `<button class="mt${it.txt ? ' mt--t' : ''}" style="transform:rotate(${a}deg) translateY(-${r}px)" data-e="${ri}" data-i="${idx}" aria-label="${it.c}">${in2}</button>`;
      }
      html += `<div class="mline" style="width:${2 * r + S + 8}px;height:${2 * r + S + 8}px"></div><div class="mr" data-r="${ri}" style="--d:${dur}s;--dir:${dir}">${t}</div>`;
    });
    inner.innerHTML = html;
    const fit = () => { const s = box.clientWidth / 1000; inner.style.transform = `scale(${s})`; };
    fit(); addEventListener('resize', fit);
    const showEra = (ri, ii) => {
      const e = ERAS[ri], it = e.items[ii != null ? ii : e.items.findIndex(x => x.img)];
      $$('.mr', inner).forEach(r => r.classList.toggle('act', +r.dataset.r == ri)); box.classList.add('hov');
      $$('[data-era]').forEach(b => b.classList.toggle('on', +b.dataset.era == ri));
      pan.innerHTML = `<span class="mp__k">${e.k} · ${e.t}</span>
        ${it.img ? `<figure><img src="${it.img}" alt="${it.c}"></figure>` : `<div class="mp__big">${it.txt}</div>`}
        <h3>${it.c}</h3><p class="mp__s">${it.s}</p>${it.src ? `<small class="mp__src">Источник: ${it.src}</small>` : ''}
        <p class="mp__era">${e.d}</p>`;
    };
    $$('.mt', inner).forEach(b => { const f = () => showEra(+b.dataset.e, +b.dataset.i); b.addEventListener('pointerenter', f); b.addEventListener('focus', f); b.addEventListener('click', f); });
    const core = $('[data-core]', inner), fc = () => showEra(0, 0); core.addEventListener('pointerenter', fc); core.addEventListener('click', fc); core.addEventListener('focus', fc);
    box.addEventListener('pointerleave', () => { box.classList.remove('hov'); $$('.mr', inner).forEach(r => r.classList.remove('act')); });
    $$('[data-era]').forEach(b => b.addEventListener('click', () => showEra(+b.dataset.era)));
    $$('.mr', inner).forEach((r, i) => r.style.setProperty('--i', i));
    showEra(0, 0); box.classList.remove('hov'); $$('.mr', inner).forEach(r => r.classList.remove('act'));
    if (CALM) box.classList.add('in');
    else new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { box.classList.add('in'); o.disconnect(); } }), { threshold: .25 }).observe(box);
  }

  /* ---------- 2. Покрути время ---------- */
  {
    const vin = $('[data-vin]'), disc = $('.vin__disc', vin), svg = $('svg', vin), ring = $('[data-vring]', svg), arm = $('[data-arm]', svg), head = $('[data-head]', svg);
    const yrEl = $('[data-vyr]'), card = $('[data-vcard]'), hint = $('[data-vhint]');
    const YPT = 20, MIN = -(2027 - 1907) / YPT * 360, R0 = .02, R1 = .43, P = [.58, -.46], L = Math.hypot(.58, .46) - .005;
    let ang = 0, vis = 0, vel = 0, drag = false, last = 0, raf = 0, cur = -1, hintT = 0;
    const edge = t => { hint.textContent = t; hint.classList.remove('off'); clearTimeout(hintT); hintT = setTimeout(() => hint.classList.add('off'), 1800); };
    const turn = d => { const want = ang + d; ang = cl(want, MIN, 0); vis += d;
      if (want > 0 && d > .5) edge('Это наши дни — крутите назад ↺'); else if (want < MIN && d < -.5) edge('Это 1907 — начало. Обратно ↻'); };
    const yOf = a => 2027 + a / 360 * YPT, rOf = y => R0 + (y - 1907) / 120 * (R1 - R0);
    function needle(r) { const d = Math.hypot(P[0], P[1]), a = (r * r - L * L + d * d) / (2 * d), h = Math.sqrt(Math.max(0, r * r - a * a)), ux = P[0] / d, uy = P[1] / d; return [a * ux - h * uy, a * uy + h * ux]; }
    function render() {
      const y = yOf(ang), r = rOf(y), Y = Math.round(y);
      disc.style.transform = `rotate(${vis}deg)`; ring.setAttribute('r', r);
      const [nx, ny] = needle(r); arm.setAttribute('x2', nx); arm.setAttribute('y2', ny);
      const ar = Math.atan2(ny - P[1], nx - P[0]) * 180 / Math.PI; head.setAttribute('transform', `translate(${nx} ${ny}) rotate(${ar})`);
      yrEl.textContent = Y;
      let k = 0; EV.forEach((e, i) => { if (e.y <= Y) k = i; });
      if (k != cur) { cur = k; const e = EV[k];
        card.innerHTML = `${e.img ? `<div class="vc__ph"><img src="${e.img}" alt="${e.t}"></div>` : `<div class="vc__ph vc__ph--t"><span>${e.y}</span></div>`}<div class="vc__b"><b>${e.y}</b><strong>${e.t}</strong><p>${e.d}</p>${e.src ? `<small>Фото: ${e.src.toLowerCase()}</small>` : ''}</div>`;
        card.classList.remove('in'); void card.offsetWidth; card.classList.add('in'); }
    }
    const ptA = e => { const dr = disc.getBoundingClientRect(); return Math.atan2(e.clientY - (dr.top + dr.height / 2), e.clientX - (dr.left + dr.width / 2)) * 180 / Math.PI; };
    const spin = () => { if (drag || Math.abs(vel) < .05) { raf = 0; return; } turn(vel); vel *= .965; render(); raf = requestAnimationFrame(spin); };
    const st = { a: 0 };
    disc.addEventListener('pointerdown', e => { drag = true; last = ptA(e); vel = 0; disc.setPointerCapture(e.pointerId); if (hint.textContent.startsWith('↺')) hint.classList.add('off'); gsap.killTweensOf(st); });
    disc.addEventListener('pointermove', e => { if (!drag) return; const a = ptA(e); let d = a - last; if (d > 180) d -= 360; if (d < -180) d += 360; last = a; turn(d); vel = d; render(); });
    const up = () => { if (!drag) return; drag = false; if (!raf && !CALM) raf = requestAnimationFrame(spin); };
    disc.addEventListener('pointerup', up); disc.addEventListener('pointercancel', up);
    const goY = y => { hint.classList.add('off'); st.a = ang; gsap.to(st, { a: (y - 2027) / YPT * 360, duration: CALM ? 0 : 1.6, ease: 'power3.inOut', onUpdate: () => { turn(st.a - ang); render(); } }); };
    $('[data-vprev]').addEventListener('click', () => { const Y = Math.round(yOf(ang)); const e = [...EV].reverse().find(e => e.y < Y); if (e) goY(e.y); });
    $('[data-vnext]').addEventListener('click', () => { const Y = Math.round(yOf(ang)); const e = EV.find(e => e.y > Y); if (e) goY(e.y); });
    disc.addEventListener('keydown', e => { if (e.key == 'ArrowLeft' || e.key == 'ArrowDown') { turn(-18); render(); e.preventDefault(); } if (e.key == 'ArrowRight' || e.key == 'ArrowUp') { turn(18); render(); e.preventDefault(); } });
    render();
    // подсказка: спил сам чуть «прокручивается» назад и возвращается
    if (!CALM) ScrollTrigger.create({ trigger: vin, start: 'top 60%', once: true, onEnter: () => { if (sec.dataset.v != 2) return; st.a = 0; gsap.to(st, { a: -140, duration: 1.4, ease: 'power2.inOut', yoyo: true, repeat: 1, onUpdate: () => { if (!drag) { turn(st.a - ang); render(); } } }); } });
  }

  const setV = v => { sec.dataset.v = v; ScrollTrigger.refresh(); dispatchEvent(new Event('resize')); };
  return { setV, stop: () => {} };
}
