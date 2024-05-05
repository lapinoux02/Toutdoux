export function rightLeft(fRight, fLeft) {
  return e => {
    switch(e.key) {
      case 'ArrowRight':
        fRight()
        break
      case 'ArrowLeft':
        fLeft()
        break
    }
  }
}