import React, { useState, useEffect } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Video from "yet-another-react-lightbox/plugins/video";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

export const Work = () => {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [items, setItems] = useState([]);

  const BACKEND_URL = "http://127.0.0.1:8000";

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/works/`)
      .then((res) => res.json())
      .then((data) => {
        const formatted = data
          .filter((item) => item.file_url) // ignore items without file
          .map((item) => {
            const url = item.file_url;
            const ext = url.split(".").pop().toLowerCase();

            if (["mp4", "webm", "ogg"].includes(ext)) {
              return {
                type: "video",
                title: item.title || "Untitled",
                sources: [{ src: url, type: `video/${ext}` }],
              };
            } else {
              return {
                type: "image",
                src: url,
                title: item.title || "Untitled",
              };
            }
          })
          .reverse();

        setItems(formatted);
      })
      .catch(console.error);
  }, []);

  return (
    <section className="scroll-mt-28 mt-24 md:mt-40 m-5 p-2">
      <div className="bento gap-2">
        {items.map((item, i) => (
          <div key={i} className="relative mb-2 group">
            {item.type === "image" ? (
              <img
                src={item.src}
                alt={item.title}
                className="cursor-pointer object-cover w-full h-auto"
                onClick={() => {
                  setIndex(i);
                  setOpen(true);
                }}
              />
            ) : (
              <video
                src={item.sources[0].src}
                className="cursor-pointer object-cover w-full h-auto"
                muted
                
                onClick={() => {
                  setIndex(i);
                  setOpen(true);
                }}
              />
            )}

            <div
              onClick={() => {
                setIndex(i);
                setOpen(true);
              }}
              className="absolute cursor-pointer inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white"
            >
              <span className="font-medium">{item.title}</span>
            </div>
          </div>
        ))}
      </div>

      <Lightbox
        plugins={[Zoom, Captions, Video, Thumbnails]}
        open={open}
        close={() => setOpen(false)}
        slides={items}
        index={index}
        thumbnails={{ width: 64, height: 64 }}
        styles={{
          container: { backgroundColor: "#fff" },
          button: { color: "#707070", filter: "none" },
        }}
      />
    </section>
  );
};
