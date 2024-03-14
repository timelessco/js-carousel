import Carousel from "../src/carousel";

let carouselValue = "";
let dotCarousel = "";
const loopCarousel = "";
let carouselValue1 = "";
let carouselValues1 = "";
const selectCarousel = "";
let yAxis = "";
document.querySelector(".new-slide")?.addEventListener("click", () => {});

document.querySelector(".left-arrow").style.display = "none";
document.querySelector(".left-arrow.dots").style.display = "none";
document.querySelector(".left-arrow-1").style.display = "none";

carouselValue = Carousel({
  parent: ".parent2 .inner",
  child: ".parent2 .slider",
  slidesToScroll: 2,
  dragFree: false,
  whileScrolling: () => {
    carouselValue.displayOrHideArrows(
      carouselValue,
      ".left-arrow",
      ".right-arrow",
    );
  },
  whileDragging: () => {
    carouselValue.displayOrHideArrows(
      carouselValue,
      ".left-arrow",
      ".right-arrow",
    );
  },
});

carouselValue1 = Carousel({
  parent: ".parent-1 .inner",
  child: ".parent-1 .slider",
  slidesToScroll: 1,
  whileScrolling: () => {
    carouselValue1.displayOrHideArrows(
      carouselValue1,
      ".left-arrow-1",
      ".right-arrow-1",
    );
  },
  whileDragging: () => {
    carouselValue1.displayOrHideArrows(
      carouselValue1,
      ".left-arrow-1",
      ".right-arrow-1",
    );
  },
});

carouselValues1 = Carousel({
  parent: ".scroll-1 .inner",
  child: ".scroll-1 .slider",
  slidesToScroll: 1,
  dragFree: true,
  whileScrolling: () => {
    carouselValues1.displayOrHideArrows(
      carouselValues1,
      ".left-arrow-s1",
      ".right-arrow-s1",
    );
  },
  whileDragging: () => {
    carouselValues1.displayOrHideArrows(
      carouselValues1,
      ".left-arrow-s1",
      ".right-arrow-s1",
    );
  },
});

Carousel({
  parent: ".parent-0 .inner",
  child: ".parent-0 .slider",
  slidesToScroll: 0,
  dragFree: true,
});

dotCarousel = Carousel({
  parent: ".dots-parent .inner",
  child: ".dots-parent .slider",
  displayDots: true,
  whileScrolling: () => {
    dotCarousel.displayOrHideArrows(
      dotCarousel,
      ".left-arrow.dots",
      ".right-arrow.dots",
    );
  },
  whileDragging: () => {
    dotCarousel.displayOrHideArrows(
      dotCarousel,
      ".left-arrow.dots",
      ".right-arrow.dots",
    );
  },
  selectedState: false,
});

Carousel({
  parent: ".start-index-div",
  child: ".start-index-div .slider",
  startIndex: 2,
  clickEvent: true,
  watchResize: () => {
    console.log("watch resize");
  },
  watchSlides: () => {
    console.log("watch slides");
  },
});
Carousel({
  parent: ".progress-inner",
  child: ".progress-inner .slider",
  whileScrolling: scrollProgress => {
    document.getElementById("progress-bar").value = scrollProgress * 100;
  },
  whileDragging: scrollProgress => {
    document.getElementById("progress-bar").value = scrollProgress * 100;
  },
  selectedState: false,
});

Carousel({
  parent: ".autoplay .inner",
  child: ".autoplay .slider",
  autoplay: true,
  selectedState: true,
});

Carousel({
  parent: ".direction-div",
  child: ".direction-div .slider",
  direction: "rtl",
});

Carousel({
  parent: ".align-c-div",
  child: ".align-c-div .slider",
  alignment: "center",
});

yAxis = Carousel({
  parent: ".axis",
  child: ".axis .slider",
  axis: "y",
  whileScrolling: () => {
    yAxis.displayOrHideArrows(yAxis, ".up-arrow.dots", ".down-arrow.dots");
  },
  whileDragging: () => {
    yAxis.displayOrHideArrows(yAxis, ".up-arrow.dots", ".down-arrow.dots");
  },
  selectedState: false,
});
document.querySelector(".left-arrow").addEventListener("click", () => {
  carouselValue.scrollPrev();
  carouselValue.displayOrHideArrows(
    carouselValue,
    ".left-arrow",
    ".right-arrow",
  );

  console.log(carouselValue.slidesInView(), "slides in view");
  console.log(carouselValue.slidesNotInView(), "slides not in view");
});
document.querySelector(".left-arrow-1").addEventListener("click", () => {
  carouselValue1.scrollPrev();
  carouselValue1.displayOrHideArrows(
    carouselValue1,
    ".left-arrow-1",
    ".right-arrow-1",
  );
});
document.querySelector(".left-arrow-s1").addEventListener("click", () => {
  carouselValues1.scrollPrev();
  carouselValue1.displayOrHideArrows(
    carouselValues1,
    ".left-arrow-s1",
    ".right-arrow-s1",
  );
});

document.querySelector(".right-arrow").addEventListener("click", () => {
  carouselValue.scrollNext();
  carouselValue.displayOrHideArrows(
    carouselValue,
    ".left-arrow",
    ".right-arrow",
  );
  console.log(carouselValue.slidesInView(), "slides in view");
  console.log(carouselValue.slidesNotInView(), "slides not in view");
  console.log(carouselValue.slideNodes(), "slide nodes");
  console.log(carouselValue.rootNode(), "root node");
  console.log(carouselValue.containerNode(), "container node");
});
document.querySelector(".right-arrow-1").addEventListener("click", () => {
  carouselValue1.scrollNext();
  carouselValue1.displayOrHideArrows(
    carouselValue1,
    ".left-arrow-1",
    ".right-arrow-1",
  );
});

document.querySelector(".right-arrow-s1").addEventListener("click", () => {
  carouselValues1.scrollNext();
  carouselValues1.displayOrHideArrows(
    carouselValues1,
    ".left-arrow-s1",
    ".right-arrow-s1",
  );
});

document.querySelector(".left-arrow.dots").addEventListener("click", () => {
  dotCarousel.scrollPrev();
  dotCarousel.displayOrHideArrows(
    dotCarousel,
    ".left-arrow.dots",
    ".right-arrow.dots",
  );
});

document.querySelector(".right-arrow.dots").addEventListener("click", () => {
  dotCarousel.scrollNext();
  dotCarousel.displayOrHideArrows(
    dotCarousel,
    ".left-arrow.dots",
    ".right-arrow.dots",
  );
});

document.querySelector(".left-arrow.select")?.addEventListener("click", () => {
  dotCarousel.scrollPrev();
  dotCarousel.displayOrHideArrows(
    selectCarousel,
    ".left-arrow.selected",
    ".right-arrow.selected",
  );
});
document.querySelector(".right-arrow.select")?.addEventListener("click", () => {
  dotCarousel.scrollNext();
  dotCarousel.displayOrHideArrows(
    selectCarousel,
    ".left-arrow.selected",
    ".right-arrow.selected",
  );
});

document.querySelector("#next-button")?.addEventListener("click", () => {
  loopCarousel.scrollNext(true);
});

document.querySelector(".up-arrow").addEventListener("click", () => {
  yAxis.scrollPrev();
  yAxis.displayOrHideArrows(yAxis, ".up-arrow.dots", ".down-arrow.dots");
});

document.querySelector(".down-arrow").addEventListener("click", () => {
  yAxis.scrollNext();
  yAxis.displayOrHideArrows(yAxis, ".up-arrow.dots", ".down-arrow.dots");
});
