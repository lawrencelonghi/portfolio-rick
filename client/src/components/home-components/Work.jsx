// Work.jsx
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
  const [thumbnailsLoaded, setThumbnailsLoaded] = useState(false);
  const [allImagesPreloaded, setAllImagesPreloaded] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  // pre-carrega imagem
  const preloadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(src);
      img.onerror = () => reject(src);
      img.src = src;
    });
  };

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/campaigns`)
      .then((res) => res.json())
      .then((data) => {
        setCampaigns(data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (campaigns.length === 0) return;

    const thumbnailUrls = campaigns
      .filter(campaign => campaign.thumbnail)
      .map(campaign => `${BACKEND_URL}${campaign.thumbnail.path}`);

    Promise.allSettled(thumbnailUrls.map(preloadImage))
      .then(() => {
        setThumbnailsLoaded(true);
      });
  }, [campaigns, BACKEND_URL]);

  useEffect(() => {
    if (!thumbnailsLoaded || campaigns.length === 0) return;

    const allImageUrls = campaigns.flatMap(campaign => 
      (campaign.imgVdos || [])
        .filter(imgVdo => {
          const ext = imgVdo.filename.split(".").pop().toLowerCase();
          return !["mp4", "webm", "ogg", "mov"].includes(ext);
        })
        .map(imgVdo => `${BACKEND_URL}${imgVdo.path}`)
    );

    // carrega em partes para não sobrecarregar o navegador
    const batchSize = 5;
    const loadBatch = async (urls, startIndex = 0) => {
      if (startIndex >= urls.length) {
        setAllImagesPreloaded(true);
        return;
      }

      const batch = urls.slice(startIndex, startIndex + batchSize);
      await Promise.allSettled(batch.map(preloadImage));
      
      // aguarda um pouco antes de carregar a proxima parte (estava bugando)
      setTimeout(() => loadBatch(urls, startIndex + batchSize), 100);
    };

    loadBatch(allImageUrls);
  }, [thumbnailsLoaded, campaigns, BACKEND_URL]);

  const formatImgVdosForLightbox = (imgVdos) => {
    return imgVdos.map((imgVdo) => {
      const url = `${BACKEND_URL}${imgVdo.path}`;
      const ext = imgVdo.filename.split(".").pop().toLowerCase();

      if (["mp4", "webm", "ogg", "mov"].includes(ext)) {
        return {
          type: "video",
          title: imgVdo.filename || "Untitled",
          sources: [{ src: url, type: `video/${ext === 'mov' ? 'mp4' : ext}` }],
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
      />
    );
  };

  if (!thumbnailsLoaded) {
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
        />
      )}
    </section>
  );
};

export default Work;