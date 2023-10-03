import Carousel from "../src/carousel";

Carousel({
  parent: ".skew .inner",
  child: ".skew .slider",
  selectedState: true,
  minWebWidth: 100,
  springConfig: `spring(1,90,20,19)`,
  whileDragging: () => {
    document.querySelectorAll(".skew .slider").forEach(i => {
      i.classList.add("while-drag");
    });
  },
  whileDragEnd: () => {
    if (window.innerWidth < 700) {
      document.querySelectorAll(".skew .slider").forEach(i => {
        if (i.classList.contains("while-drag")) {
          i.classList.remove("while-drag");
        }
      });
    } else {
      setTimeout(() => {
        document.querySelector(
          ".skew .inner",
        ).style.transform = `rotateY(${0}deg)`;
      }, 600);
    }
  },
});

Carousel({
  parent: ".container .carousel",
  child: ".carousel .item",
  customDragAction: "rotate",
});

Carousel({
  parent: ".artists-carousel",
  child: ".each-artist",
});

document.querySelectorAll(".carousel .item").forEach((i, index) => {
  const element = i;
  if (index === 0) {
    element.style.transform = `rotateY(${36}deg) translatez(${-window.innerWidth}px)`;
  } else if (index === 1) {
    element.style.transform = `rotateY(${0}deg) translatez(${-window.innerWidth}px)`;
  } else
    element.style.transform = `rotateY(${
      (index - 1) * -36
    }deg) translatez(${-window.innerWidth}px)`;
});
