// Work.jsx
import React, { useState, useEffect } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Video from "yet-another-react-lightbox/plugins/video";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";

export const Work = () => {
  const [open, setOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/campaigns`)
      .then((res) => res.json())
      .then((data) => {
        setCampaigns(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const formatImgVdosForLightbox = (imgVdos) => {
    return imgVdos.map((imgVdo) => {
      const url = `${BACKEND_URL}${imgVdo.path}`;
      const ext = imgVdo.filename.split(".").pop().toLowerCase();

      if (["mp4", "webm", "ogg", "mov"].includes(ext)) {
        return {
          type: "video",
          title: imgVdo.filename || "Untitled",
          sources: [{ src: url, type: `video/${ext === "mov" ? "mp4" : ext}` }],
        };
      } else {
        return {
          type: "image",
          src: url,
          title: imgVdo.filename || "Untitled",
        };
      }
    });
  };

  const handleCoverClick = (campaign) => {
    setSelectedCampaign(campaign);
    setOpen(true);
  };

  const renderThumbnail = (campaign) => {
    if (!campaign.thumbnail) return null;

    const url = `${BACKEND_URL}${campaign.thumbnail.path}`;
    const ext = campaign.thumbnail.filename.split(".").pop().toLowerCase();
    const isVideo = ["mp4", "webm", "ogg", "mov"].includes(ext);

    return isVideo ? (
      <video
        src={url}
        className="cursor-pointer object-cover w-full h-auto"
        muted
        playsInline
      />
    ) : (
      <img
        src={url}
        alt={campaign.title}
        className="cursor-pointer object-cover w-full h-auto"
        loading="lazy"
      />
    );
  };

  if (loading) {
    return (
      <section id="work" className="scroll-mt-28 mt-24 md:mt-40 m-5 p-2">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando a galeria...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="work" className="scroll-mt-28 mt-24 md:mt-40 m-5 p-2">
      <div className="bento gap-2">
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="relative mb-2 group">
            <div onClick={() => handleCoverClick(campaign)}>
              {renderThumbnail(campaign)}
            </div>

            <div
              onClick={() => handleCoverClick(campaign)}
              className="absolute cursor-pointer inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
            >
              <div className="text-center">
                <span className="font-medium block">{campaign.title}</span>
                <span className="text-sm opacity-75">
                  {campaign.imgVdos?.length || 0}{" "}
                  {campaign.imgVdos?.length === 1 ? "item" : "itens"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedCampaign && (
        <Lightbox
          plugins={[Zoom, Video, Thumbnails]}
          open={open}
          close={() => {
            setOpen(false);
            setSelectedCampaign(null);
          }}
          slides={formatImgVdosForLightbox(selectedCampaign.imgVdos || [])}
          index={0}
          video={{
            autoPlay: true,
            controls: true,
            playsInline: true,
          }}
          thumbnails={{
            width: 80,
            height: 80,
            border: 0,
            borderRadius: 0,
            padding: 0,
            gap: 8,
            vignette: false,
          }}
          styles={{
            container: { backgroundColor: "#fff" },
            button: { color: "#707070", filter: "none" },
            thumbnail: { border: "none" },
            thumbnailsContainer: { backgroundColor: "#fff" },
          }}
          render={{
            iconPrev: () => null,
            slideHeader: () => (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  zIndex: 10,
                  padding: "16px 60px",
                  textAlign: "center",
                  pointerEvents: "none",
                }}
              >
                <span
                  style={{
                    fontSize: "13px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#555",
                    fontWeight: 500,
                  }}
                >
                  {selectedCampaign.title}
                </span>
              </div>
            ),
          }}
        />
      )}
    </section>
  );
};

export default Work;