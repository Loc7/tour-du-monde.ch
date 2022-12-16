document.addEventListener('keyup', function (event) {
    if (event.key === 'ArrowLeft') {
      keys.left = true;
      setTimeout(function () {
        keys.left = false;
      }, 10);
    }
  
    if (event.key === 'ArrowRight') {
      keys.right = true;
      setTimeout(function () {
        keys.right = false;
      }, 10);
    }
  
    if (event.key === 'a') {
      if (currentFrontGear < bike.frontGears) {
        currentFrontGear += 1;
      }
    }
  
    if (event.key === 'y') {
      if (currentFrontGear > 1) {
        currentFrontGear -= 1;
      }
    }
  
    if (event.key === 's') {
      if (currentRearGear < bike.rearGears) {
        currentRearGear += 1;
      }
    }
  
    if (event.key === 'x') {
      if (currentRearGear > 1) {
        currentRearGear -= 1;
      }
    }
  });