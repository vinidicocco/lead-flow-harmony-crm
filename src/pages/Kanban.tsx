
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Lead } from '@/types';
import { getLeadsByProfile } from '@/data/mockData';
import { useProfile } from '@/context/ProfileContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Clock, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

const Kanban = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { currentProfile } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [currentProfile]);

  const fetchData = async () => {
    if (!currentProfile) return [];
    const leads = getLeadsByProfile(currentProfile);
    setLeads(leads);
    return leads.sort((a, b) => 
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newLeads = [...leads];
    const leadToMove = newLeads.find(lead => lead.id === draggableId);

    if (leadToMove) {
      leadToMove.status = destination.droppableId as Lead['status'];

      const sourceIndex = newLeads.findIndex(lead => lead.id === draggableId);
      newLeads.splice(sourceIndex, 1);
      newLeads.splice(destination.index, 0, leadToMove);

      setLeads(newLeads);
    }
  };

  const filteredLeads = useMemo(() => {
    if (!searchTerm) {
      return leads;
    }

    const term = searchTerm.toLowerCase();
    return leads.filter(lead =>
      lead.name.toLowerCase().includes(term) ||
      lead.company.toLowerCase().includes(term) ||
      (lead.email && lead.email.toLowerCase().includes(term)) ||
      (lead.phone && lead.phone.toLowerCase().includes(term))
    );
  }, [leads, searchTerm]);

  const getLeadsByStatus = (status: Lead['status']) => {
    return filteredLeads.filter(lead => lead.status === status);
  };

  const handleLeadClick = (lead: Lead) => {
    navigate(`/leads/${lead.id}`);
  };

  const renderCard = (lead: Lead) => {
    return (
      <div 
        className="bg-white p-4 mb-3 rounded-lg border shadow-sm hover:shadow cursor-pointer"
        onClick={() => handleLeadClick(lead)}
      >
        <h3 className="font-semibold text-gray-800">{lead.name}</h3>
        <p className="text-gray-600 text-sm">{lead.company}</p>
        <div className="text-xs mt-2 text-gray-500">
          <div className="flex items-center">
            <Clock size={12} className="mr-1" />
            <span>Último contato: {lead.last_contact ? formatDate(lead.last_contact) : "N/A"}</span>
          </div>
          <div className="flex items-center mt-1">
            <Calendar size={12} className="mr-1" />
            <span>Próximo contato: {lead.next_follow_up ? formatDate(lead.next_follow_up) : "N/A"}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <h1 className="text-3xl font-bold mb-4">Kanban</h1>
        <div className="relative">
          <Input
            type="text"
            placeholder="Buscar leads..."
            className="pl-10"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-6 gap-4">
          {/* Qualified */}
          <div className="col-span-1">
            <h2 className="font-semibold mb-2">Qualificado</h2>
            <Droppable droppableId="qualified">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="bg-gray-100 p-3 rounded-md min-h-[300px]"
                >
                  {getLeadsByStatus('qualified').map((lead, index) => (
                    <Draggable key={lead.id} draggableId={lead.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {renderCard(lead)}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          {/* Contact Attempt */}
          <div className="col-span-1">
            <h2 className="font-semibold mb-2">Tentativa de Contato</h2>
            <Droppable droppableId="contact_attempt">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="bg-gray-100 p-3 rounded-md min-h-[300px]"
                >
                  {getLeadsByStatus('contact_attempt').map((lead, index) => (
                    <Draggable key={lead.id} draggableId={lead.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {renderCard(lead)}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          {/* Contacted */}
          <div className="col-span-1">
            <h2 className="font-semibold mb-2">Contactado</h2>
            <Droppable droppableId="contacted">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="bg-gray-100 p-3 rounded-md min-h-[300px]"
                >
                  {getLeadsByStatus('contacted').map((lead, index) => (
                    <Draggable key={lead.id} draggableId={lead.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {renderCard(lead)}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          {/* Proposal */}
          <div className="col-span-1">
            <h2 className="font-semibold mb-2">Proposta</h2>
            <Droppable droppableId="proposal">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="bg-gray-100 p-3 rounded-md min-h-[300px]"
                >
                  {getLeadsByStatus('proposal').map((lead, index) => (
                    <Draggable key={lead.id} draggableId={lead.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {renderCard(lead)}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          {/* Contract */}
          <div className="col-span-1">
            <h2 className="font-semibold mb-2">Contrato</h2>
            <Droppable droppableId="contract">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="bg-gray-100 p-3 rounded-md min-h-[300px]"
                >
                  {getLeadsByStatus('contract').map((lead, index) => (
                    <Draggable key={lead.id} draggableId={lead.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {renderCard(lead)}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          {/* Payment */}
          <div className="col-span-1">
            <h2 className="font-semibold mb-2">Pagamento</h2>
            <Droppable droppableId="payment">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="bg-gray-100 p-3 rounded-md min-h-[300px]"
                >
                  {getLeadsByStatus('payment').map((lead, index) => (
                    <Draggable key={lead.id} draggableId={lead.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {renderCard(lead)}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          {/* Closed */}
           <div className="col-span-1">
            <h2 className="font-semibold mb-2">Fechado</h2>
            <Droppable droppableId="closed">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="bg-gray-100 p-3 rounded-md min-h-[300px]"
                >
                  {getLeadsByStatus('closed').map((lead, index) => (
                    <Draggable key={lead.id} draggableId={lead.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {renderCard(lead)}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

export default Kanban;
