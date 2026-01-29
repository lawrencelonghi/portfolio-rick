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
import { SortableCampaign, SortableImgVdo } from '../components/admin-components/SortableComponents';

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
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [newProfileText, setNewProfileText] = useState({
        textPt: '',
        textEn: ''
      });

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

    useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const { data } = await api.get('/api/profile-image');
        
        setNewProfileImage(data);
      } catch (error) {
        console.error('Erro ao buscar imagem de perfil:', error);
      }
    };

    fetchProfileImage();
  }, []);

  useEffect(() => {
    const fetchProfileText = async () => {
      try {
        const { data } = await api.get('/api/profile-texts');
        setNewProfileText(data)
      } catch (error) {
        console.error('Erro ao buscar texto de perfil:', error);
      }
    };
    fetchProfileText();
  }, [])

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

  const handleUploadImgVdos = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('imgVdos', file);
      });

      await api.post(`/api/imgVdos/campaign/${selectedCampaign.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const { data } = await api.get(`/api/campaigns/${selectedCampaign.id}`);
      setSelectedCampaign(data);
      loadCampaigns();
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      alert('Erro ao fazer upload dos arquivos');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

 const handleUploadProfileImage = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setUploading(true);

  try {
    const formData = new FormData();
    formData.append('profileImage', file);

    await api.put('/api/profile-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    const { data } = await api.get('/api/profile-image');
    setNewProfileImage(data); 
  } catch (error) {
    console.error('Erro ao fazer upload:', error);
    alert('Erro ao fazer upload da imagem de perfil');
  } finally {
    setUploading(false);
    e.target.value = '';
  }
}
const handleUpdateProfileText = async (language) => {
  try {
    const update = language === 'pt' 
      ? { textPt: newProfileText.textPt }
      : { textEn: newProfileText.textEn };

    await api.put('/api/profile-texts', update);
    
    alert(`Texto em ${language === 'pt' ? 'português' : 'inglês'} atualizado com sucesso!`);
  } catch (error) {
    console.error('Erro ao atualizar texto de perfil:', error);
    alert('Erro ao atualizar texto de perfil');
  }
}

  const handleSetThumbnail = async (imgVdoId) => {
    try {
      await api.put(`/api/campaigns/${selectedCampaign.id}/thumbnail`, { imgVdoId });
      
      setSelectedCampaign({ ...selectedCampaign, thumbnailId: imgVdoId });
      loadCampaigns();
    } catch (error) {
      console.error('Erro ao definir thumbnail:', error);
      alert('Erro ao definir capa');
    }
  };

  const handleDeleteImgVdo = async (imgVdoId) => {
    if (!confirm('Tem certeza que deseja deletar este arquivo?')) {
      return;
    }

    try {
      await api.delete(`/api/imgVdos/${imgVdoId}`);
      
      const updatedImgVdos = selectedCampaign.imgVdos.filter(img => img.id !== imgVdoId);
      setSelectedCampaign({
        ...selectedCampaign,
        imgVdos: updatedImgVdos,
        thumbnailId: selectedCampaign.thumbnailId === imgVdoId ? null : selectedCampaign.thumbnailId
      });
      loadCampaigns();
    } catch (error) {
      console.error('Erro ao deletar arquivo:', error);
      alert('Erro ao deletar arquivo');
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

  const handleDragEndImgVdos = async (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const imgVdos = selectedCampaign.imgVdos;
      const oldIndex = imgVdos.findIndex((img) => img.id === active.id);
      const newIndex = imgVdos.findIndex((img) => img.id === over.id);

      const newImgVdos = arrayMove(imgVdos, oldIndex, newIndex);
      setSelectedCampaign({ ...selectedCampaign, imgVdos: newImgVdos });

      try {
        await Promise.all(
          newImgVdos.map((imgVdo, index) =>
            api.put(`/api/imgVdos/${imgVdo.id}/order`, { order: index })
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
            <p className="text-sm text-gray-500">Oi, {user?.username}</p>
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

           {/* IMAGEM DO PERFIL */}
            <div className='mt-6 md:mt-8'>
              <div className='flex justify-between'>
              <h2 className="text-xl font-semibold text-gray-900">
                Imagem do Perfil
              </h2>

            <div className="mb-6">
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleUploadProfileImage}
                className="hidden"
              />
              <label
                htmlFor="image-upload"
                className={`inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer ${
                  uploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {uploading ? 'Enviando...' : '+ Adicionar Imagem de perfil'}
              </label>
            </div>
              </div>
              <div>
                {newProfileImage?.path ? (
                  <div>
                    <img className='max-w-xs w-full' 
                        src={`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}${newProfileImage.path}`} alt="Imagem de perfil" />
                  </div>
                ) : (
                  <p>nenhuma imagem adicionada</p>
                )}
              </div>
            </div>

            {/* AREA DOS TEXTOS */}
         <div>
  <div className='mt-6 md:mt-8'>
    <h2 className="text-xl font-semibold text-gray-900">Textos do perfil</h2>
  </div>

  <div className='mt-6 md:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6'>
    {/* Texto em Português */}
    <div className='flex flex-col gap-4'>
      <label htmlFor="profile-pt-text" className="font-medium">
        Texto em português:
      </label>
      <textarea
        id="profile-pt-text"
        className='w-full px-3 py-2 border border-gray-300 
        rounded focus:outline-none focus:ring-2 focus:ring-blue-500 
        min-h-[200px] resize-y'
        value={newProfileText.textPt}
        onChange={(e) => setNewProfileText(prev => ({
          ...prev,
          textPt: e.target.value
        }))}
        placeholder="Digite o texto em português. Pressione Enter para criar novos parágrafos."
      />
      <button 
        className='max-w-xs px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer'
        onClick={() => handleUpdateProfileText('pt')}
      >
        Alterar texto em português
      </button>
    </div>

    {/* Texto em Inglês */}
    <div className='flex flex-col gap-4'>
      <label htmlFor="profile-en-text" className="font-medium">
        Texto em inglês:
      </label>
      <textarea
        id="profile-en-text"
        className='w-full px-3 py-2 border border-gray-300 
        rounded focus:outline-none focus:ring-2 focus:ring-blue-500 
        min-h-[200px] resize-y'
        value={newProfileText.textEn}
        onChange={(e) => setNewProfileText(prev => ({
          ...prev,
          textEn: e.target.value
        }))}
        placeholder="Type the text in English. Press Enter to create new paragraphs."
      />
      <button 
        className='max-w-xs px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer'
        onClick={() => handleUpdateProfileText('en')}
      >
        Alterar texto em inglês
      </button>
    </div>
  </div>
</div>
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
                id="imgVdo-upload"
                multiple
                accept="image/*,video/*"
                onChange={handleUploadImgVdos}
                className="hidden"
              />
              <label
                htmlFor="imgVdo-upload"
                className={`inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer ${
                  uploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {uploading ? 'Enviando...' : '+ Adicionar imagem ou vídeo'}
              </label>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">
                Arquivos ({selectedCampaign.imgVdos?.length || 0})
              </h3>
              
              {!selectedCampaign.imgVdos || selectedCampaign.imgVdos.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200 border-dashed">
                  <p className="text-gray-500">Nenhuma imagem ou vídeo ainda.</p>
                  <p className="text-sm text-gray-400 mt-1">Adicione arquivos para esta campanha</p>
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEndImgVdos}
                >
                  <SortableContext items={selectedCampaign.imgVdos.map(img => img.id)} strategy={rectSortingStrategy}>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {selectedCampaign.imgVdos.map((imgVdo) => (
                        <SortableImgVdo
                          key={imgVdo.id}
                          imgVdo={imgVdo}
                          isThumb={selectedCampaign.thumbnailId === imgVdo.id}
                          onSetThumb={handleSetThumbnail}
                          onDelete={handleDeleteImgVdo}
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