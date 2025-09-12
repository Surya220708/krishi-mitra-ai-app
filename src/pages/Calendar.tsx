import React, { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Plus, AlertTriangle, CheckCircle, Clock, Droplets, Sprout, Scissors, Bug } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BottomNavigation } from "@/components/ui/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CropTask {
  id: string;
  type: 'irrigation' | 'sowing' | 'harvesting' | 'fertilizing' | 'pestControl';
  cropName: string;
  title: string;
  description: string;
  dueDate: Date;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  completed: boolean;
  weatherBased: boolean;
}

const Calendar = () => {
  const { t } = useLanguage();
  const [tasks, setTasks] = useState<CropTask[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [weatherAlert, setWeatherAlert] = useState<string | null>(null);
  
  // Mock weather data
  const [currentWeather] = useState({
    temp: 32,
    humidity: 75,
    rainPredicted: true,
    windSpeed: 15
  });

  const taskIcons = {
    irrigation: Droplets,
    sowing: Sprout,
    harvesting: Scissors,
    fertilizing: CalendarIcon,
    pestControl: Bug
  };

  const priorityColors = {
    urgent: "bg-destructive text-destructive-foreground",
    high: "bg-orange-500 text-white",
    medium: "bg-yellow-500 text-black",
    low: "bg-green-500 text-white"
  };

  // Initialize with sample tasks
  useEffect(() => {
    const sampleTasks: CropTask[] = [
      {
        id: "1",
        type: "irrigation",
        cropName: "Wheat",
        title: t('calendar.irrigation'),
        description: "Morning irrigation recommended due to high temperature",
        dueDate: new Date(),
        priority: "urgent",
        completed: false,
        weatherBased: true
      },
      {
        id: "2", 
        type: "sowing",
        cropName: "Rice",
        title: t('calendar.sowing'),
        description: "Optimal weather conditions for rice sowing",
        dueDate: new Date(Date.now() + 86400000),
        priority: "high",
        completed: false,
        weatherBased: true
      },
      {
        id: "3",
        type: "fertilizing",
        cropName: "Corn",
        title: t('calendar.fertilizing'),
        description: "Apply nitrogen fertilizer",
        dueDate: new Date(Date.now() + 2 * 86400000),
        priority: "medium",
        completed: false,
        weatherBased: false
      }
    ];
    setTasks(sampleTasks);

    // Set weather alert based on conditions
    if (currentWeather.rainPredicted) {
      setWeatherAlert("Heavy rain predicted today. Consider postponing irrigation and outdoor activities.");
    }
  }, [t, currentWeather]);

  const getTodaysTasks = () => {
    const today = new Date();
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return taskDate.toDateString() === today.toDateString() && !task.completed;
    });
  };

  const getUpcomingTasks = () => {
    const today = new Date();
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return taskDate > today && !task.completed;
    }).slice(0, 5);
  };

  const getOverdueTasks = () => {
    const today = new Date();
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return taskDate < today && !task.completed;
    });
  };

  const markTaskComplete = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: true } : task
    ));
    toast({
      title: t('calendar.taskCompleted'),
      description: "Task has been marked as completed",
    });
  };

  const addNewTask = (taskData: Partial<CropTask>) => {
    const newTask: CropTask = {
      id: Date.now().toString(),
      type: taskData.type || 'irrigation',
      cropName: taskData.cropName || '',
      title: taskData.title || '',
      description: taskData.description || '',
      dueDate: taskData.dueDate || new Date(),
      priority: taskData.priority || 'medium',
      completed: false,
      weatherBased: false
    };
    
    setTasks(prev => [...prev, newTask]);
    setIsAddDialogOpen(false);
    toast({
      title: t('calendar.taskAdded'),
      description: "New task has been added to your calendar",
    });
  };

  const formatTimeRemaining = (dueDate: Date) => {
    const now = new Date();
    const diff = dueDate.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} ${t('calendar.days')}`;
    if (hours > 0) return `${hours} ${t('calendar.hours')}`;
    return t('calendar.overdue');
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6 pt-12">
        <div className="flex items-center gap-3 mb-2">
          <CalendarIcon size={28} className="animate-pulse" />
          <div>
            <h1 className="text-2xl font-bold">{t('calendar.title')}</h1>
            <p className="text-primary-foreground/90">{t('calendar.subtitle')}</p>
          </div>
        </div>
      </div>

      {/* Weather Alert */}
      {weatherAlert && (
        <div className="px-6 -mt-4 relative z-10">
          <Card className="bg-orange-50 border-orange-200 animate-slide-in">
            <div className="flex items-center gap-3 text-orange-800">
              <AlertTriangle size={20} />
              <div>
                <p className="font-semibold">{t('calendar.weatherAlert')}</p>
                <p className="text-sm">{weatherAlert}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      <div className="px-6 mt-6 space-y-6">
        {/* Today's Reminders */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">{t('calendar.todaysReminders')}</h2>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Plus size={16} />
                  {t('calendar.addReminder')}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('calendar.addReminder')}</DialogTitle>
                </DialogHeader>
                <AddTaskForm onSubmit={addNewTask} t={t} />
              </DialogContent>
            </Dialog>
          </div>

          {getTodaysTasks().length === 0 ? (
            <Card className="text-center py-8">
              <CheckCircle size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">{t('calendar.noReminders')}</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {getTodaysTasks().map((task) => (
                <TaskCard key={task.id} task={task} onComplete={markTaskComplete} t={t} />
              ))}
            </div>
          )}
        </div>

        {/* Overdue Tasks */}
        {getOverdueTasks().length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-destructive mb-3">{t('calendar.overdue')}</h3>
            <div className="space-y-3">
              {getOverdueTasks().map((task) => (
                <TaskCard key={task.id} task={task} onComplete={markTaskComplete} t={t} isOverdue />
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Tasks */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">{t('calendar.upcomingTasks')}</h3>
          <div className="space-y-3">
            {getUpcomingTasks().map((task) => (
              <TaskCard key={task.id} task={task} onComplete={markTaskComplete} t={t} />
            ))}
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

const TaskCard = ({ task, onComplete, t, isOverdue = false }: {
  task: CropTask;
  onComplete: (id: string) => void;
  t: (key: string) => string;
  isOverdue?: boolean;
}) => {
  const Icon = {
    irrigation: Droplets,
    sowing: Sprout,
    harvesting: Scissors,
    fertilizing: CalendarIcon,
    pestControl: Bug
  }[task.type];

  const priorityColors = {
    urgent: "bg-destructive text-destructive-foreground",
    high: "bg-orange-500 text-white",
    medium: "bg-yellow-500 text-black", 
    low: "bg-green-500 text-white"
  };

  const formatTimeRemaining = (dueDate: Date) => {
    const now = new Date();
    const diff = dueDate.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} ${t('calendar.days')}`;
    if (hours > 0) return `${hours} ${t('calendar.hours')}`;
    return t('calendar.overdue');
  };

  return (
    <Card className={`hover:shadow-md transition-all ${isOverdue ? 'border-destructive bg-destructive/5' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className={`p-2 rounded-lg ${task.weatherBased ? 'bg-blue-100 text-blue-600' : 'bg-muted'}`}>
            <Icon size={20} />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-foreground">{task.title}</h4>
              <Badge variant="outline" className="text-xs">
                {task.cropName}
              </Badge>
              <Badge className={`text-xs ${priorityColors[task.priority]}`}>
                {t(`calendar.${task.priority}`)}
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground mb-1">{task.description}</p>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock size={12} />
              <span>{formatTimeRemaining(task.dueDate)}</span>
              {task.weatherBased && (
                <Badge variant="outline" className="text-xs">
                  {t('calendar.weatherBased')}
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <Button
          size="sm"
          variant="outline"
          onClick={() => onComplete(task.id)}
          className="gap-2"
        >
          <CheckCircle size={16} />
          {t('calendar.markComplete')}
        </Button>
      </div>
    </Card>
  );
};

const AddTaskForm = ({ onSubmit, t }: { onSubmit: (data: Partial<CropTask>) => void; t: (key: string) => string }) => {
  const [formData, setFormData] = useState({
    type: 'irrigation' as const,
    cropName: '',
    title: '',
    description: '',
    priority: 'medium' as const,
    dueDate: new Date().toISOString().slice(0, 16)
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      dueDate: new Date(formData.dueDate)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>{t('calendar.selectTask')}</Label>
        <Select value={formData.type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="irrigation">{t('calendar.irrigation')}</SelectItem>
            <SelectItem value="sowing">{t('calendar.sowing')}</SelectItem>
            <SelectItem value="harvesting">{t('calendar.harvesting')}</SelectItem>
            <SelectItem value="fertilizing">{t('calendar.fertilizing')}</SelectItem>
            <SelectItem value="pestControl">{t('calendar.pestControl')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>{t('calendar.selectCrop')}</Label>
        <Input 
          value={formData.cropName}
          onChange={(e) => setFormData(prev => ({ ...prev, cropName: e.target.value }))}
          placeholder={t('calendar.cropPlaceholder')}
        />
      </div>

      <div>
        <Label>{t('calendar.taskTitle')}</Label>
        <Input 
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder={t('calendar.taskTitlePlaceholder')}
        />
      </div>

      <div>
        <Label>{t('calendar.description')}</Label>
        <Textarea 
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder={t('calendar.descriptionPlaceholder')}
        />
      </div>

      <div>
        <Label>{t('calendar.priority')}</Label>
        <Select value={formData.priority} onValueChange={(value: any) => setFormData(prev => ({ ...prev, priority: value }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="urgent">{t('calendar.urgent')}</SelectItem>
            <SelectItem value="high">{t('calendar.high')}</SelectItem>
            <SelectItem value="medium">{t('calendar.medium')}</SelectItem>
            <SelectItem value="low">{t('calendar.low')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>{t('calendar.setDate')}</Label>
        <Input 
          type="datetime-local"
          value={formData.dueDate}
          onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
        />
      </div>

      <Button type="submit" className="w-full">
        {t('calendar.addReminder')}
      </Button>
    </form>
  );
};

export default Calendar;