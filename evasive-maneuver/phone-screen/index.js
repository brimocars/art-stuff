const socket = io();

const init = async () => {
  const url = '/control-type';
  const resPromise = fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  })

  const up = document.querySelector('#up');
  const down = document.querySelector('#down');
  const left = document.querySelector('#left');
  const right = document.querySelector('#right');
  const vertical = document.querySelector('#vertical');
  const horizontal = document.querySelector('#horizontal');


  const allButtons = [
    { name: 'up', element: up },
    { name: 'down', element: down },
    { name: 'left', element: left },
    { name: 'right', element: right },
  ];

  let mousedown = false;

  allButtons.forEach((button) => {
    button.element.addEventListener('mousedown', () => {
      mousedown = true;
      socket.emit('controls', `${button.name}-down`);
    });
    button.element.addEventListener('mouseup', () => {
      mousedown = false;
      socket.emit('controls', `${button.name}-up`);
    });
    button.element.addEventListener('mouseleave', () => {
      socket.emit('controls', `${button.name}-up`);
    });
    button.element.addEventListener('mouseenter', () => {
      if (mousedown) {
        socket.emit('controls', `${button.name}-down`);
      }
    });
  });

  const res = await resPromise;
  const data = await res.json();
  const { controlType } = data;

  if (controlType === 'vertical') {
    left.style.display = 'none';
    right.style.display = 'none';
    horizontal.style.display = 'none';
  } else if (controlType === 'horizontal') {
    down.style.display = 'none';
    up.style.display = 'none';
    vertical.style.display = 'none';
  } else {
    console.log('Invalid control type');
  }
}

window.onload = init