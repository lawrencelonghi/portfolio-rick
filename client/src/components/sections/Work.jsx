import React, { useState, useEffect } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";


export const Work = () => {
  const [open, setOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [images, setImages] = useState([]);

  const BACKEND_URL = "http://127.0.0.1:8000"; 

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/works/`)
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((item) => ({
          src: item.image,
          title: item.title || "Untitled",
        }));
        setImages(formatted);
      })
      .catch((err) => console.error("Failed to fetch works:", err));
  }, []);

  return (
    <section id="work" className="scroll-mt-28 mt-24 md:mt-40 m-5 p-2">
      <div className="bento gap-2">
        {images.map((img, i) => (
          <img
            key={i}
            src={img.src}
            alt={img.title}
            className="mb-2 cursor-pointer object-cover w-full h-auto"
            onClick={() => {
              setPhotoIndex(i);
              setOpen(true);
            }}
          />
        ))}
      </div>

      <Lightbox
        plugins={[Thumbnails, Zoom]}
        open={open}
        close={() => setOpen(false)}
        slides={images}
        index={photoIndex}
        styles={{ container: { backgroundColor: "rgba(247, 243, 243, 1)" }, 
                  button: { color: "#707070", filter: "none" }}}
                  
                  
      />
    </section>
  );
};
