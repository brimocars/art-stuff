const socket = io();

let player = '';

function handleOrientation(event) {
  if (!event.alpha || !event.beta || !event.gamma) {
    console.error('cannot read gyroscope data');
    socket.emit('controls', `${player}|0|0|0`);
    return;
  }
  socket.emit('controls', `${player}|${event.alpha.toFixed(2)}|${event.beta.toFixed(2)}|${event.gamma.toFixed(2)}`);
}

const init = async () => {
  const url = '/player';
  const resPromise = fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  })

  // ChatGPT suggested way of getting gyroscope data. On android it should just work. On iOS, because Apple, it of
  // course requires special permissions.
  async function requestPermissionIfNeeded() {
    try {
      if (typeof DeviceOrientationEvent?.requestPermission === 'function') {
        const permissionState = await DeviceOrientationEvent.requestPermission();
        if (permissionState !== 'granted') {
          alert('Permission denied for gyroscope access.');
          return;
        }
      }
      window.addEventListener('deviceorientation', handleOrientation);
    } catch (err) {
      console.error('Error requesting gyroscope permission:', err);
    }
  }
  document.body.addEventListener('click', requestPermissionIfNeeded, { once: true });

  const div = document.querySelector('div');
  const res = await resPromise;
  if (!res.ok) {
    console.error('Error fetching player color:', data);
    alert('Error fetching player color. Please try again.');
    return;
  } else {
    const data = await res.json();
    const { color } = data;
    player = color;
    div.style.backgroundColor = `#${color}`;
  }
}

window.onload = init