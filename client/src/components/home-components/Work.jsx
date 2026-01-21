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
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [campaigns, setCampaigns] = useState([]);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/campaigns`)
      .then((res) => res.json())
      .then((data) => {
        setCampaigns(data);
      })
      .catch(console.error);
  }, []);

  const formatImagesForLightbox = (images) => {
    return images.map((image) => {
      const url = `${BACKEND_URL}${image.path}`;
      const ext = image.filename.split(".").pop().toLowerCase();

      // Suporte para vídeos (caso você adicione no futuro)
      if (["mp4", "webm", "ogg"].includes(ext)) {
        return {
          type: "video",
          title: image.filename || "Untitled",
          sources: [{ src: url, type: `video/${ext}` }],
        };
      } else {
        return {
          type: "image",
          src: url,
          title: image.filename || "Untitled",
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
    const isVideo = ["mp4", "webm", "ogg"].includes(ext);

    return isVideo ? (
      <video
        src={url}
        className="cursor-pointer object-cover w-full h-auto"
        muted
      />
    ) : (
      <img
        src={url}
        alt={campaign.title}
        className="cursor-pointer object-cover w-full h-auto"
      />
    );
  };

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
                  {campaign.images?.length || 0}{" "}
                  {campaign.images?.length === 1 ? "foto" : "fotos"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedCampaign && (
        <Lightbox
          plugins={[Zoom, Captions, Video, Thumbnails]}
          open={open}
          close={() => {
            setOpen(false);
            setSelectedCampaign(null);
          }}
          slides={formatImagesForLightbox(selectedCampaign.images || [])}
          index={0}
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
        />
      )}
    </section>
  );
};

export default Work;