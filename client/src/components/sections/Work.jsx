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

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/works/`)
      .then((res) => res.json())
      .then((data) => {
        setCampaigns(data);
      })
      .catch(console.error);
  }, []);

  const formatItemsForLightbox = (items) => {
    return items
      .filter((item) => item.file_url)
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
      });
  };

  const handleCoverClick = (campaign) => {
    setSelectedCampaign(campaign);
    setOpen(true);
  };

  const renderCoverMedia = (cover) => {
    if (!cover || !cover.file_url) return null;

    const ext = cover.file_url.split(".").pop().toLowerCase();
    const isVideo = ["mp4", "webm", "ogg"].includes(ext);

    return isVideo ? (
      <video
        src={cover.file_url}
        className="cursor-pointer object-cover w-full h-auto"
        muted
      />
    ) : (
      <img
        src={cover.file_url}
        alt={cover.title}
        className="cursor-pointer object-cover w-full h-auto"
      />
    );
  };

  return (
    <section id="work" className="scroll-mt-28 mt-24 md:mt-40 m-5 p-2">
      <div className="bento gap-2">
        {campaigns.map((campaign, i) => (
          <div key={i} className="relative mb-2 group">
            <div onClick={() => handleCoverClick(campaign)}>
              {renderCoverMedia(campaign.cover)}
            </div>

            <div
              onClick={() => handleCoverClick(campaign)}
              className="absolute cursor-pointer inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
            >
              <div className="text-center">
                <span className="font-medium block">{campaign.campaign}</span>
                <span className="text-sm opacity-75">
                  {campaign.items.length} {campaign.items.length === 1 ? "foto" : "fotos"}
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
          slides={formatItemsForLightbox(selectedCampaign.items)}
          index={0}
          // carousel={{ finite: selectedCampaign.items.length <= 10 }}
          thumbnails={{ 
            width: 80, 
            height: 80, 
            border: 0, 
            borderRadius: 0,
            padding: 0,
            gap: 8,
            vignette: false
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