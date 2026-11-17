const labels = { name: 'Имя', phone: 'Телефон', budget: 'Бюджет', rooms: 'Спален', comment: 'Комментарий', page: 'Страница' };

export default async req => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  const data = await req.json().catch(() => ({}));
  if (!data.phone) return new Response('phone required', { status: 400 });
  const text = 'Заявка с сайта\n' + Object.entries(labels).filter(([k]) => data[k]).map(([k, l]) => `${l}: ${data[k]}`).join('\n');
  const r = await fetch(`https://api.telegram.org/bot${process.env.TG_TOKEN}/sendMessage`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: process.env.TG_CHAT, text })
  });
  return new Response(r.ok ? 'ok' : 'telegram error', { status: r.ok ? 200 : 502 });
};
