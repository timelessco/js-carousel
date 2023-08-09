// appends 'selected slide' classname
export function addSelectedStateClassName(
  selectedScrollClassName,
  children,
  childIndexValue,
  selectedState,
) {
  if (selectedState) {
    children[childIndexValue]?.classList.add(selectedScrollClassName);
  }
}

// remove  'selected slide' classname
export function removeSelectedStateClassName(
  children,
  selectedScrollClassName,
) {
  children.forEach(i => {
    if (i.classList.contains(selectedScrollClassName)) {
      i?.classList?.remove(selectedScrollClassName);
    }
  });
}
// adding scroll snap classnames
export function addScrollClassNames(
  axis,
  parent,
  slidesToScroll,
  dragFree,
  child,
) {
  if (axis === "x") {
    parent.classList.add("scroll-x");
    if (parent.classList.contains("scroll-snap-x")) {
      parent.classList.remove("scroll-snap-x");
    }
    if (slidesToScroll !== 0) {
      parent.classList.add("scroll-snap-x");
      if (dragFree) {
        parent.classList.add("drag-free");
      } else {
        parent.classList.add("snap-always");
        child.forEach(i => {
          i.classList.add("snap-always");
        });
      }
    }
  } else {
    parent.classList.add("scroll-y");

    if (slidesToScroll !== 0) {
      parent.classList.add("scroll-snap-y");
      if (dragFree) {
        parent.classList.add("drag-free");
      } else {
        parent.classList.add("snap-always");
        child.forEach(i => {
          i.classList.add("snap-always");
        });
      }
    }
  }
}

// remove scroll snap classnames
export function removeScrollClassNames(parent, child) {
  if (parent.classList.contains("scroll-snap-x")) {
    parent.classList.remove("scroll-snap-x");
  }
  if (parent.classList.contains("drag-free")) {
    parent.classList.remove("drag-free");
  }
  if (parent.classList.contains("snap-always")) {
    parent.classList.remove("snap-always");
    child.forEach(i => {
      i.classList.remove("snap-always");
    });
  }
  if (parent.classList.contains("scroll-snap-y")) {
    parent.classList.remove("scroll-snap-y");
  }
}
