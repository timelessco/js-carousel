import Carousel from "../src/carousel";

Carousel({
  parent: ".skew .inner",
  child: ".skew .slider",
  // direction: "ltr",
  selectedState: true,
  minWebWidth: 100,
  springConfig: `spring(1,90,20,16)`,
  whileDragging: () => {
    document.querySelectorAll(".skew .slider").forEach(i => {
      console.log("whileee");
      i.classList.add("whileDrag");
    });
  },
  whileDragEnd: () => {
    document.querySelectorAll(".skew .slider").forEach(i => {
      if (i.classList.contains("whileDrag")) {
        console.log("drag end", i);

        i.classList.remove("whileDrag");
      }
    });
  },
});
