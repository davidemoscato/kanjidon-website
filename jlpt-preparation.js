(() => {
  'use strict';
  const data = JSON.parse(document.querySelector('#jlpt-planner-text').textContent);
  const durations = {N5:90,N4:115,N3:140,N2:155,N1:165};
  const format = (template, values) => template.replace(/\{(\w+)\}/g, (_,key) => values[key]);
  document.querySelector('#level-choice').addEventListener('change', event => {
    const key = event.target.value;
    const [title, advice] = data.levels[key];
    document.querySelector('#level-heading').textContent = `${key} · ${title}`;
    document.querySelector('#level-advice').textContent = advice;
    document.querySelector('#level-duration').textContent = format(data.duration,{duration:durations[key]});
  });
  document.querySelector('#study-minutes').addEventListener('input', event => {
    const total = Number(event.target.value);
    const review = Math.round(total / 3);
    const reading = Math.round(total / 3);
    const listening = total - review - reading;
    document.querySelector('#minutes-label').textContent = total;
    const bar = document.querySelector('.j-timebar');
    [review,reading,listening].forEach((minutes,index) => {
      bar.children[index].textContent = `${minutes}′`;
      bar.children[index].style.flex = minutes;
    });
    const description = format(data.routine,{review,reading,listening});
    bar.setAttribute('aria-label',description);
    document.querySelector('#routine-note').textContent = description;
  });
})();
