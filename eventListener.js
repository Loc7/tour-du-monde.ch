document.addEventListener('keyup', function (event) {
  if (event.key === 'g') {
    keys.left = true;
    setTimeout(function () {
      keys.left = false;
    }, 10);
  }

  if (event.key === 'j') {
    keys.right = true;
    setTimeout(function () {
      keys.right = false;
    }, 10);
  }

  if (event.key === 't') {
    if (currentFrontGear < bike.frontGears) {
      currentFrontGear += 1;
    }
  }

  if (event.key === 'r') {
    if (currentFrontGear > 1) {
      currentFrontGear -= 1;
    }
  }

  if (event.key === 'i') {
    if (currentRearGear < bike.rearGears) {
      currentRearGear += 1;
    }
  }

  if (event.key === 'o') {
    if (currentRearGear > 1) {
      currentRearGear -= 1;
    }
  }
});

document.addEventListener('keydown', function (event) {
  if (event.duration > 500) {
    if (event.key === 'r') {
      currentFrontGear += 3;
    }
    if (event.key === 'f') {
      currentFrontGear -= 3;
    }
    if (event.key === 'i') {
      currentRearGear -= 3;
      console.log("test")
    }
  }
});