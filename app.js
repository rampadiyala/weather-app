const $ = id => document.getElementById(id);
async function getJSON(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error('Weather service error');
  return r.json();
}
$('f').onsubmit = async e => {
  e.preventDefault();
  $('status').textContent = 'Loading...'; $('now').textContent = ''; $('days').replaceChildren();
  try {
    const geo = await getJSON('https://geocoding-api.open-meteo.com/v1/search?count=1&name=' + encodeURIComponent($('city').value.trim()));
    if (!geo.results) throw new Error('City not found');
    const c = geo.results[0];
    const w = await getJSON(`https://api.open-meteo.com/v1/forecast?latitude=${c.latitude}&longitude=${c.longitude}&current=temperature_2m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`);
    $('now').textContent = `${c.name}: ${w.current.temperature_2m} °C`;
    $('days').replaceChildren(...w.daily.time.map((d, i) => {
      const li = document.createElement('li');
      li.textContent = `${d}: ${w.daily.temperature_2m_min[i]} to ${w.daily.temperature_2m_max[i]} °C`;
      return li;
    }));
    $('status').textContent = '';
  } catch (err) { $('status').textContent = err.message; }
};
