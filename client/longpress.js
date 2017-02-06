export default function longpressToContextMenu(map) {
  let timer;
  let mapDiv = map._canvas;

  function handleLongPress(e) {
    function mousePos(el, e) {
        const rect = el.getBoundingClientRect();
        e = e.touches ? e.touches[0] : e;
        return {
          x: e.clientX - rect.left - el.clientLeft,
          y: e.clientY - rect.top - el.clientTop
        };
    };

    let pos = mousePos(mapDiv, e);

    map.fire('contextmenu', {
      lngLat: map.unproject(pos),
      point: pos,
      originalEvent: e
    });
  }

  mapDiv.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      timer = setTimeout(handleLongPress, 500, e);
    } else {
      clearTimeout(timer);
    }
    return false;
  });

  mapDiv.addEventListener('touchend', (e) => {
    clearTimeout(timer);
    return false;
  });

  map.on('drag', (e) => {
    clearTimeout(timer);
  });
}
