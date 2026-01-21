import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableCampaign, SortableImage } from '../components/admin-components/SortableComponents';

export const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showNewCampaignModal, setShowNewCampaignModal] = useState(false);
  const [newCampaignTitle, setNewCampaignTitle] = useState('');
  const [newCampaignDescription, setNewCampaignDescription] = useState('');
  const [editingTitle, setEditingTitle] = useState('');
  const [uploading, setUploading] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    loadCampaigns();
  }, []);

  useEffect(() => {
    if (selectedCampaign) {
      setEditingTitle(selectedCampaign.title);
    }
  }, [selectedCampaign]);

  const loadCampaigns = async () => {
    try {
      const { data } = await api.get('/api/campaigns');
      setCampaigns(data);
    } catch (error) {
      console.error('Erro ao carregar campanhas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    if (!newCampaignTitle.trim()) return;

    try {
      await api.post('/api/campaigns', {
        title: newCampaignTitle,
        description: newCampaignDescription
      });
      
      setNewCampaignTitle('');
      setNewCampaignDescription('');
      setShowNewCampaignModal(false);
      loadCampaigns();
    } catch (error) {
      console.error('Erro ao criar campanha:', error);
      alert('Erro ao criar campanha');
    }
  };

  const handleUpdateCampaignTitle = async () => {
    if (!editingTitle.trim() || editingTitle === selectedCampaign.title) return;

    try {
      await api.put(`/api/campaigns/${selectedCampaign.id}`, {
        title: editingTitle
      });
      
      setSelectedCampaign({ ...selectedCampaign, title: editingTitle });
      loadCampaigns();
    } catch (error) {
      console.error('Erro ao atualizar título:', error);
      alert('Erro ao atualizar título');
    }
  };

  const handleDeleteCampaign = async () => {
    if (!confirm(`Tem certeza que deseja deletar a campanha "${selectedCampaign.title}"? Todas as imagens serão deletadas.`)) {
      return;
    }

    try {
      await api.delete(`/api/campaigns/${selectedCampaign.id}`);
      setSelectedCampaign(null);
      loadCampaigns();
    } catch (error) {
      console.error('Erro ao deletar campanha:', error);
      alert('Erro ao deletar campanha');
    }
  };

  const handleUploadImages = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });

      await api.post(`/api/images/campaign/${selectedCampaign.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const { data } = await api.get(`/api/campaigns/${selectedCampaign.id}`);
      setSelectedCampaign(data);
      loadCampaigns();
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      alert('Erro ao fazer upload das imagens');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSetThumbnail = async (imageId) => {
    try {
      await api.put(`/api/campaigns/${selectedCampaign.id}/thumbnail`, { imageId });
      
      setSelectedCampaign({ ...selectedCampaign, thumbnailId: imageId });
      loadCampaigns();
    } catch (error) {
      console.error('Erro ao definir thumbnail:', error);
      alert('Erro ao definir capa');
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!confirm('Tem certeza que deseja deletar esta imagem?')) {
      return;
    }

    try {
      await api.delete(`/api/images/${imageId}`);
      
      const updatedImages = selectedCampaign.images.filter(img => img.id !== imageId);
      setSelectedCampaign({
        ...selectedCampaign,
        images: updatedImages,
        thumbnailId: selectedCampaign.thumbnailId === imageId ? null : selectedCampaign.thumbnailId
      });
      loadCampaigns();
    } catch (error) {
      console.error('Erro ao deletar imagem:', error);
      alert('Erro ao deletar imagem');
    }
  };

  const handleDragEndCampaigns = async (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = campaigns.findIndex((c) => c.id === active.id);
      const newIndex = campaigns.findIndex((c) => c.id === over.id);

      const newCampaigns = arrayMove(campaigns, oldIndex, newIndex);
      setCampaigns(newCampaigns);

      try {
        await Promise.all(
          newCampaigns.map((campaign, index) =>
            api.put(`/api/campaigns/${campaign.id}`, { order: index })
          )
        );
      } catch (error) {
        console.error('Erro ao atualizar ordem:', error);
        loadCampaigns();
      }
    }
  };

  const handleDragEndImages = async (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const images = selectedCampaign.images;
      const oldIndex = images.findIndex((img) => img.id === active.id);
      const newIndex = images.findIndex((img) => img.id === over.id);

      const newImages = arrayMove(images, oldIndex, newIndex);
      setSelectedCampaign({ ...selectedCampaign, images: newImages });

      try {
        await Promise.all(
          newImages.map((image, index) =>
            api.put(`/api/images/${image.id}/order`, { order: index })
          )
        );
      } catch (error) {
        console.error('Erro ao atualizar ordem:', error);
        const { data } = await api.get(`/api/campaigns/${selectedCampaign.id}`);
        setSelectedCampaign(data);
      }
    }
  };

  const handleSelectCampaign = (campaign) => {
    setSelectedCampaign(campaign);
  };

  const handleBack = () => {
    setSelectedCampaign(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500">Olá, {user?.username}</p>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 border border-gray-300 rounded hover:bg-gray-50 transition"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedCampaign ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Campanhas ({campaigns.length})
              </h2>
              <button 
                onClick={() => setShowNewCampaignModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                + Nova Campanha
              </button>
            </div>

            {campaigns.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-500">Nenhuma campanha ainda.</p>
                <p className="text-sm text-gray-400 mt-1">Clique em "Nova Campanha" para começar</p>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEndCampaigns}
              >
                <SortableContext items={campaigns.map(c => c.id)} strategy={rectSortingStrategy}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {campaigns.map((campaign) => (
                      <SortableCampaign
                        key={campaign.id}
                        campaign={campaign}
                        onSelect={handleSelectCampaign}
                        backendUrl={BACKEND_URL}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <button
                onClick={handleBack}
                className="text-sm text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-1"
              >
                ← Voltar
              </button>
              
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onBlur={handleUpdateCampaignTitle}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleUpdateCampaignTitle();
                        e.target.blur();
                      }
                    }}
                    className="text-2xl font-bold text-gray-900 border-b-2 border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 -ml-2 w-full max-w-lg"
                    placeholder="Título da campanha"
                  />
                  {selectedCampaign.description && (
                    <p className="text-gray-500 mt-1 px-2">{selectedCampaign.description}</p>
                  )}
                </div>
                
                <button 
                  onClick={handleDeleteCampaign}
                  className="px-4 py-2 text-red-600 border border-red-300 rounded hover:bg-red-50 transition"
                >
                  Deletar Campanha
                </button>
              </div>
            </div>

            <div className="mb-6">
              <input
                type="file"
                id="image-upload"
                multiple
                accept="image/*"
                onChange={handleUploadImages}
                className="hidden"
              />
              <label
                htmlFor="image-upload"
                className={`inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer ${
                  uploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {uploading ? 'Enviando...' : '+ Adicionar Imagens'}
              </label>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">
                Imagens ({selectedCampaign.images?.length || 0})
              </h3>
              
              {!selectedCampaign.images || selectedCampaign.images.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200 border-dashed">
                  <p className="text-gray-500">Nenhuma imagem ainda.</p>
                  <p className="text-sm text-gray-400 mt-1">Adicione imagens para esta campanha</p>
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEndImages}
                >
                  <SortableContext items={selectedCampaign.images.map(img => img.id)} strategy={rectSortingStrategy}>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {selectedCampaign.images.map((image) => (
                        <SortableImage
                          key={image.id}
                          image={image}
                          isThumb={selectedCampaign.thumbnailId === image.id}
                          onSetThumb={handleSetThumbnail}
                          onDelete={handleDeleteImage}
                          backendUrl={BACKEND_URL}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </div>
          </div>
        )}
      </main>

      {showNewCampaignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Nova Campanha</h2>
            
            <form onSubmit={handleCreateCampaign}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={newCampaignTitle}
                    onChange={(e) => setNewCampaignTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Verão 2024"
                    required
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição (opcional)
                  </label>
                  <textarea
                    value={newCampaignDescription}
                    onChange={(e) => setNewCampaignDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Descrição da campanha"
                    rows="3"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewCampaignModal(false);
                    setNewCampaignTitle('');
                    setNewCampaignDescription('');
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Criar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;