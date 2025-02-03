import y from"https://cdn.jsdelivr.net/npm/openai@4.0.0/+esm";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))o(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const c of a.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&o(c)}).observe(document,{childList:!0,subtree:!0});function r(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(n){if(n.ep)return;n.ep=!0;const a=r(n);fetch(n.href,a)}})();const w=new y({apiKey:prompt("Пожалуйста, введите ваш API ключ OpenAI:"),dangerouslyAllowBrowser:!0});var i=L.map("map").setView([0,0],2),l=[];L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(i);async function v(e,t){const r=`https://api.open-meteo.com/v1/forecast?latitude=${e}&longitude=${t}&hourly=temperature_2m,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7`;try{const o=await fetch(r);if(!o.ok)throw new Error("Ошибка при запросе к API");return await o.json()}catch(o){return console.error("Ошибка:",o),null}}function I(e){return e<0?"Очень холодно! Наденьте теплую куртку, шапку, шарф и перчатки.":e<10?"Прохладно. Рекомендуется надеть пальто или куртку.":e<20?"Умеренно тепло. Подойдет легкая куртка или свитер.":e<25?"Тепло. Можно надеть футболку и легкие брюки или юбку.":"Жарко! Наденьте легкую одежду и не забудьте про головной убор."}function m(e){return e<=3?"☀️":e<=48?"☁️":e<=77?"🌧️":e<=82?"🌨️":"⛈️"}async function $(e){try{const t=e.hourly.temperature_2m[new Date().getHours()],r=e.hourly.weathercode[new Date().getHours()];return(await w.chat.completions.create({model:"gpt-4",messages:[{role:"user",content:`Дай короткую рекомендацию по одежде для погоды: температура ${t}°C, код погоды ${r}`}],temperature:.7,max_tokens:300})).choices[0].message.content}catch(t){return console.error("Ошибка при получении рекомендации от AI:",t),I(currentTemp)}}async function x(e){if(!e||!e.hourly)return"Не удалось получить данные о погоде";const t=new Date().getHours(),r=e.hourly.temperature_2m[t],o=e.hourly.weathercode[t],n=m(o),a=await $(e);let c=`<h3>Текущая погода: ${n} ${r.toFixed(1)}°C</h3>`;c+=`<p>${a}</p>`,c+="<h4>Прогноз на 7 дней:</h4>";for(let s=0;s<7;s++){const d=new Date(e.daily.time[s]).toLocaleDateString(),f=e.daily.temperature_2m_min[s],g=e.daily.temperature_2m_max[s],h=m(e.daily.weathercode[s]);c+=`<p>${d}: ${h} ${f.toFixed(1)}°C - ${g.toFixed(1)}°C</p>`}return c}function M(){const e=l.map(t=>{const r=t.getLatLng();return{lat:r.lat,lng:r.lng}});localStorage.setItem("savedMarkers",JSON.stringify(e))}async function _(){const e=localStorage.getItem("savedMarkers");if(e){const t=JSON.parse(e);for(const r of t)await u(r.lat,r.lng)}}async function u(e,t){const r=await v(e,t);let o=`<h3>Координаты: ${e}, ${t}</h3>`;o+=await x(r);const n=L.marker([e,t]).addTo(i).bindPopup(o).openPopup();l.push(n),p(),M()}i.on("click",async function(e){var t=e.latlng.lat.toFixed(4),r=e.latlng.lng.toFixed(4);u(t,r)});function p(){const e=document.getElementById("favorites");e.innerHTML="",l.forEach((t,r)=>{const o=document.createElement("li");o.textContent=`Локация ${r+1}: ${t.getLatLng().lat.toFixed(4)}, ${t.getLatLng().lng.toFixed(4)}`,o.onclick=()=>{i.setView(t.getLatLng(),10),t.openPopup()},e.appendChild(o)})}document.getElementById("citySearch").addEventListener("submit",async function(e){e.preventDefault();const t=document.getElementById("cityInput").value;try{const o=await(await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(t)}`)).json();if(console.log(o),o&&o.length>0){const{lat:n,lon:a}=o[0];i.setView([n,a],10),u(n,a)}else alert("Город не найден")}catch(r){console.error("Ошибка при поиске города:",r),alert("Произошла ошибка при поиске города")}});function k(){l.forEach(e=>{i.removeLayer(e)}),l=[],p(),localStorage.removeItem("savedMarkers")}document.getElementById("clearMarkers").addEventListener("click",k);document.addEventListener("DOMContentLoaded",()=>{_()});
