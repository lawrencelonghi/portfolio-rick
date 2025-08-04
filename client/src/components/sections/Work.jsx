import React, { useState, useEffect } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/plugins/captions.css";


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
        })) 
        .reverse();
        setImages(formatted);
      })
      .catch((err) => console.error("Failed to fetch works:", err));
  }, []);

  return (
    <section id="work" className="scroll-mt-28 mt-24 md:mt-40 m-5 p-2">
      <div className="bento gap-2">
        {images.map((img, i) => ( 
          <div key={i} className="relative mb-2 group">
            <img
              src={img.src}
              alt={img.title}
              className="cursor-pointer object-cover w-full h-auto"
              onClick={() => {
                setPhotoIndex(i);
                setOpen(true);
              }}
            />
            <div className="absolute inset-0 bg-black/50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white">
          <span className="font-medium pointer-events-auto">{img.title}</span>
          <span className="text-sm text-gray-300 pointer-events-auto">Click to view</span>
        </div>
          </div>
        ))}
      </div>

      

      <Lightbox
        plugins={[Zoom, Captions]}
        captions={{ descriptionTextAlign: "center" }}
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
