// Адрес страницы артиста: artist.html?a=<фамилия-имя латиницей>
const TR = {а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'e',ж:'zh',з:'z',и:'i',й:'y',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'h',ц:'ts',ч:'ch',ш:'sh',щ:'sch',ъ:'',ы:'y',ь:'',э:'e',ю:'yu',я:'ya'};
export const slug = p => { const w = p.name.toLowerCase().split(' '); return [w.slice(-1)[0], ...w.slice(0, -1)].join('-').replace(/[а-яё]/g, c => TR[c] ?? c).replace(/[^a-z-]/g, ''); };
export const artistUrl = p => `/artist.html?a=${slug(p)}`;
