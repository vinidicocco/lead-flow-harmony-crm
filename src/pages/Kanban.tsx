import React, { useState, useEffect, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProfile } from '@/context/ProfileContext';
import { getTasksForProfile } from '@/data/mockDataUtils';
import { Task } from '@/types';
import { toast } from 'sonner';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const Kanban = () => {
  const { currentProfile } = useProfile();
  const tasks = useMemo(() => getTasksForProfile(currentProfile), [currentProfile]);
  const [columns, setColumns] = useState({
    'todo': {
      id: 'todo',
      title: 'A Fazer',
      tasks: tasks.filter(task => task.status === 'todo')
    },
    'in-progress': {
      id: 'in-progress',
      title: 'Em Andamento',
      tasks: tasks.filter(task => task.status === 'in-progress')
    },
    'done': {
      id: 'done',
      title: 'Concluído',
      tasks: tasks.filter(task => task.status === 'done')
    }
  });

  useEffect(() => {
    setColumns({
      'todo': {
        id: 'todo',
        title: 'A Fazer',
        tasks: tasks.filter(task => task.status === 'todo')
      },
      'in-progress': {
        id: 'in-progress',
        title: 'Em Andamento',
        tasks: tasks.filter(task => task.status === 'in-progress')
      },
      'done': {
        id: 'done',
        title: 'Concluído',
        tasks: tasks.filter(task => task.status === 'done')
      }
    });
  }, [tasks]);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'todo',
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'medium',
    assignedTo: '',
    profile: currentProfile,
    orgId: 'your_org_id'
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value: string, name: string) => {
    setNewTask({ ...newTask, [name]: value });
  };

  const addTask = () => {
    // Basic validation
    if (!newTask.title || !newTask.description) {
      toast.error('Por favor, preencha todos os campos.');
      return;
    }

    // Simulate adding a task (in real app, this would be an API call)
    const newTaskWithId = { ...newTask, id: Date.now().toString() };

    // Update the columns state to include the new task
    setColumns(prevColumns => {
      return {
        ...prevColumns,
        'todo': {
          ...prevColumns.todo,
          tasks: [...prevColumns.todo.tasks, newTaskWithId]
        }
      };
    });

    toast.success('Tarefa adicionada com sucesso!');
    closeModal();
    setNewTask({
      title: '',
      description: '',
      status: 'todo',
      dueDate: new Date().toISOString().split('T')[0],
      priority: 'medium',
      assignedTo: '',
      profile: currentProfile,
      orgId: 'your_org_id'
    }); // Reset form
  };

  const onDragEnd = (result: DropResult) => {
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

    const start = columns[source.droppableId];
    const finish = columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.tasks);
      const [removed] = newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, removed);

      const newColumn = {
        ...start,
        tasks: newTaskIds,
      };

      setColumns({
        ...columns,
        [newColumn.id]: newColumn,
      });
      return;
    }

    // Moving from one list to another
    const startTaskIds = Array.from(start.tasks);
    const [removed] = startTaskIds.splice(source.index, 1);

    const finishTaskIds = Array.from(finish.tasks);
    finishTaskIds.splice(destination.index, 0, removed);

    const newStart = {
      ...start,
      tasks: startTaskIds,
    };

    const newFinish = {
      ...finish,
      tasks: finishTaskIds,
    };

    // Update the status of the moved task
    const taskId = draggableId;
    const newStatus = destination.droppableId;

    // Optimistically update the task's status in the state
    setColumns(prevColumns => {
      const updatedColumns = { ...prevColumns };

      // Remove the task from the source column
      updatedColumns[source.droppableId] = {
        ...updatedColumns[source.droppableId],
        tasks: updatedColumns[source.droppableId].tasks.filter(task => task.id !== taskId)
      };

      // Add the task to the destination column with the updated status
      updatedColumns[destination.droppableId] = {
        ...updatedColumns[destination.droppableId],
        tasks: [...updatedColumns[destination.droppableId].tasks, {
          ...tasks.find(task => task.id === taskId)!, // Find the task in the original tasks array
          status: newStatus
        }]
      };

      return updatedColumns;
    });

    setColumns({
      ...columns,
      [newStart.id]: newStart,
      [newFinish.id]: newFinish,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Kanban</h1>
          <p className="text-gray-500 mt-1">Gerencie suas tarefas de forma visual</p>
        </div>
        <Button onClick={openModal}>Adicionar Tarefa</Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.values(columns).map((column) => (
            <Card key={column.id}>
              <CardHeader>
                <CardTitle>{column.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <Droppable droppableId={column.id}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-4"
                    >
                      {column.tasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-white p-4 rounded-md shadow-sm border"
                            >
                              <h3 className="font-medium">{task.title}</h3>
                              <p className="text-sm text-gray-500">{task.description}</p>
                              <div className="mt-2 flex items-center justify-between">
                                <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                                  {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {formatDate(task.dueDate)}
                                </span>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </CardContent>
            </Card>
          ))}
        </div>
      </DragDropContext>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Adicionar Nova Tarefa</h3>
              <div className="mt-2">
                <Input
                  type="text"
                  name="title"
                  placeholder="Título da Tarefa"
                  value={newTask.title}
                  onChange={handleInputChange}
                  className="mb-4"
                />
                <Textarea
                  name="description"
                  placeholder="Descrição da Tarefa"
                  value={newTask.description}
                  onChange={handleInputChange}
                  className="mb-4"
                />
                <div className="mb-4">
                  <Label htmlFor="dueDate" className="block text-gray-700 text-sm font-bold mb-2">
                    Data de Vencimento
                  </Label>
                  <Input
                    type="date"
                    name="dueDate"
                    value={newTask.dueDate}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <Label htmlFor="priority" className="block text-gray-700 text-sm font-bold mb-2">
                    Prioridade
                  </Label>
                  <Select onValueChange={(value) => handleSelectChange(value, 'priority')}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baixa</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="items-center px-4 py-3">
                <Button onClick={addTask} className="mr-2">
                  Adicionar
                </Button>
                <Button variant="secondary" onClick={closeModal}>
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Kanban;
