import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Componente de Campanha Sortable
export const SortableCampaign = ({ campaign, onSelect, backendUrl }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: campaign.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition group relative">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="absolute top-2 right-2 z-10 p-2 bg-white/90 hover:bg-white rounded shadow-sm cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Arrastar campanha"
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </button>

        {/* Área clicável */}
        <div onClick={() => onSelect(campaign)} className="cursor-pointer">
          <div className="aspect-video bg-gray-100 relative">
            {campaign.thumbnail ? (
              <img
                src={`${backendUrl}${campaign.thumbnail.path}`}
                alt={campaign.title}
                className=" w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                Sem thumbnail
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
          </div>

          <div className="p-4">
            <h3 className="font-medium text-gray-900 mb-1">{campaign.title}</h3>
            <p className="text-sm text-gray-500">
              {campaign.images?.length || 0} {campaign.images?.length === 1 ? 'imagem' : 'imagens'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente de Imagem Sortable
export const SortableImage = ({ image, isThumb, onSetThumb, onDelete, backendUrl }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group"
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="absolute top-2 right-2 z-10 p-2 bg-white/90 hover:bg-white rounded shadow-sm cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Arrastar imagem"
      >
        <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </button>

      {/* Imagem */}
      <img
        src={`${backendUrl}${image.path}`}
        alt={image.filename}
        className="w-full h-full object-cover"
      />

      {/* Badge de Capa */}
      {isThumb && (
        <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-medium z-10">
          ★ CAPA
        </div>
      )}

      {/* Botões de Ação - aparecem no hover */}
      <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSetThumb(image.id);
          }}
          className="flex-1 px-3 py-2 bg-white text-gray-900 text-sm rounded hover:bg-gray-100 font-medium"
        >
          {isThumb ? '★ Capa' : 'Definir Capa'}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(image.id);
          }}
          className="px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 font-medium"
        >
          Deletar
        </button>
      </div>
    </div>
  );
};