import React, { useState, useEffect } from 'react'
import { 
  Brain, LayoutDashboard, Plus, CheckSquare, Target, FolderOpen, FileText, BarChart3, 
  Menu, X, Star, Calendar, Clock, Flag, Archive, Settings, ChevronDown, ChevronRight,
  Edit3, Trash2, GripVertical, Search, Filter, Hash, Users, BookOpen, Heart,
  RotateCcw, MapPin, Zap, TrendingUp, Tag, Folder, User, Bell, Home, Activity,
  PieChart, LineChart, Award, Trophy, Flame, Timer, CheckCircle, Circle,
  ArrowUp, ArrowDown, Copy, Eye, EyeOff, Lock, Unlock, Download, Upload,
  RefreshCw, Save, Share, Link, Mail, Phone, MessageSquare, Video, Camera,
  Mic, Volume2, VolumeX, Play, Pause, SkipBack, SkipForward, Repeat, Shuffle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import './App.css'

// Complete data structures
const initialTasks = [
  { id: 1, title: 'Review quarterly goals', completed: false, priority: 'high', category: 'Work', project: 'Q1 Planning', dueDate: '2025-06-05', tags: ['urgent', 'planning'] },
  { id: 2, title: 'Complete project proposal', completed: true, priority: 'medium', category: 'Work', project: 'New Client', dueDate: '2025-06-04', tags: ['proposal', 'client'] },
  { id: 3, title: 'Morning workout', completed: false, priority: 'low', category: 'Health', project: 'Fitness Goals', dueDate: '2025-06-05', tags: ['health', 'routine'] },
  { id: 4, title: 'Read 30 pages', completed: false, priority: 'medium', category: 'Learning', project: 'Personal Development', dueDate: '2025-06-05', tags: ['reading', 'growth'] }
]

const initialProjects = [
  { id: 1, name: 'Q1 Planning', description: 'Quarterly planning and goal setting', category: 'Work', status: 'active', progress: 65, dueDate: '2025-06-30', tasks: 8, completedTasks: 5 },
  { id: 2, name: 'New Client', description: 'Onboarding new client project', category: 'Work', status: 'active', progress: 40, dueDate: '2025-07-15', tasks: 12, completedTasks: 5 },
  { id: 3, name: 'Fitness Goals', description: 'Health and wellness improvement', category: 'Health', status: 'active', progress: 25, dueDate: '2025-12-31', tasks: 20, completedTasks: 5 },
  { id: 4, name: 'Personal Development', description: 'Learning and skill development', category: 'Learning', status: 'active', progress: 80, dueDate: '2025-08-30', tasks: 15, completedTasks: 12 }
]

const initialGoals = [
  { id: 1, title: 'Learn React Development', progress: 33, category: 'Learning', target: 100, type: 'skill', deadline: '2025-08-30' },
  { id: 2, title: 'Lose 10 pounds', progress: 60, category: 'Health', target: 100, type: 'health', deadline: '2025-09-30' },
  { id: 3, title: 'Read 24 books', progress: 45, category: 'Learning', target: 100, type: 'habit', deadline: '2025-12-31' },
  { id: 4, title: 'Save $10,000', progress: 75, category: 'Finance', target: 100, type: 'financial', deadline: '2025-12-31' }
]

const initialNotes = [
  { id: 1, title: 'Meeting Notes - Q1 Review', content: 'Key points from quarterly review meeting...', category: 'Work', tags: ['meeting', 'review'], createdAt: '2025-06-04', updatedAt: '2025-06-04' },
  { id: 2, title: 'Book Summary - Atomic Habits', content: 'Key insights from James Clear\'s book...', category: 'Learning', tags: ['book', 'habits'], createdAt: '2025-06-03', updatedAt: '2025-06-03' },
  { id: 3, title: 'Workout Plan', content: 'Weekly workout routine and exercises...', category: 'Health', tags: ['fitness', 'routine'], createdAt: '2025-06-02', updatedAt: '2025-06-04' }
]

const initialCategories = [
  { id: 1, name: 'Work', color: 'bg-blue-500', icon: 'briefcase', count: 15 },
  { id: 2, name: 'Health', color: 'bg-green-500', icon: 'heart', count: 8 },
  { id: 3, name: 'Learning', color: 'bg-purple-500', icon: 'book', count: 12 },
  { id: 4, name: 'Finance', color: 'bg-yellow-500', icon: 'dollar-sign', count: 5 },
  { id: 5, name: 'Personal', color: 'bg-pink-500', icon: 'user', count: 7 },
  { id: 6, name: 'Family', color: 'bg-orange-500', icon: 'users', count: 4 }
]

const initialTags = [
  { id: 1, name: 'urgent', color: 'bg-red-500', count: 3 },
  { id: 2, name: 'planning', color: 'bg-blue-500', count: 5 },
  { id: 3, name: 'health', color: 'bg-green-500', count: 4 },
  { id: 4, name: 'learning', color: 'bg-purple-500', count: 6 },
  { id: 5, name: 'routine', color: 'bg-gray-500', count: 8 },
  { id: 6, name: 'client', color: 'bg-indigo-500', count: 2 }
]

// Smart lists configuration
const defaultSmartLists = [
  { id: 'inbox', name: 'Inbox', icon: Archive, color: 'bg-gray-500', pinned: true, type: 'smart' },
  { id: 'today', name: 'Today', icon: Calendar, color: 'bg-blue-500', pinned: true, type: 'smart' },
  { id: 'scheduled', name: 'Scheduled', icon: Clock, color: 'bg-orange-500', pinned: true, type: 'smart' },
  { id: 'flagged', name: 'Flagged', icon: Flag, color: 'bg-red-500', pinned: true, type: 'smart' },
  { id: 'all', name: 'All', icon: Archive, color: 'bg-gray-500', pinned: false, type: 'smart' },
  { id: 'completed', name: 'Completed', icon: CheckCircle, color: 'bg-green-500', pinned: false, type: 'smart' },
  { id: 'overdue', name: 'Overdue', icon: Timer, color: 'bg-red-600', pinned: false, type: 'smart' }
]

// Complete navigation items
const defaultNavigationItems = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, color: 'bg-blue-500', order: 1 },
  { id: 'quick-capture', name: 'Quick Capture', icon: Plus, color: 'bg-green-500', order: 2 },
  { id: 'tasks', name: 'Tasks', icon: CheckSquare, color: 'bg-purple-500', order: 3 },
  { id: 'projects', name: 'Projects', icon: FolderOpen, color: 'bg-pink-500', order: 4 },
  { id: 'goals', name: 'Goals', icon: Target, color: 'bg-cyan-500', order: 5 },
  { id: 'notes', name: 'Notes', icon: FileText, color: 'bg-indigo-500', order: 6 },
  { id: 'categories', name: 'Categories', icon: Tag, color: 'bg-yellow-500', order: 7 },
  { id: 'tags', name: 'Tags', icon: Hash, color: 'bg-orange-500', order: 8 },
  { id: 'calendar', name: 'Calendar', icon: Calendar, color: 'bg-teal-500', order: 9 },
  { id: 'progress', name: 'Progress', icon: BarChart3, color: 'bg-red-500', order: 10 },
  { id: 'habits', name: 'Habits', icon: RotateCcw, color: 'bg-emerald-500', order: 11 },
  { id: 'analytics', name: 'Analytics', icon: PieChart, color: 'bg-violet-500', order: 12 },
  { id: 'settings', name: 'Settings', icon: Settings, color: 'bg-gray-500', order: 13 }
]

function App() {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [tasks, setTasks] = useState(initialTasks)
  const [projects, setProjects] = useState(initialProjects)
  const [goals, setGoals] = useState(initialGoals)
  const [notes, setNotes] = useState(initialNotes)
  const [categories, setCategories] = useState(initialCategories)
  const [tags, setTags] = useState(initialTags)
  const [smartLists, setSmartLists] = useState(defaultSmartLists)
  const [navigationItems, setNavigationItems] = useState(defaultNavigationItems)
  const [isSmartListsExpanded, setIsSmartListsExpanded] = useState(true)
  const [isMyListsExpanded, setIsMyListsExpanded] = useState(true)
  const [showCreateSmartList, setShowCreateSmartList] = useState(false)
  const [newSmartListName, setNewSmartListName] = useState('')
  const [editingItem, setEditingItem] = useState(null)
  const [editingName, setEditingName] = useState('')

  // Dialog states
  const [showAddTask, setShowAddTask] = useState(false)
  const [showAddProject, setShowAddProject] = useState(false)
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [showAddNote, setShowAddNote] = useState(false)
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [showAddTag, setShowAddTag] = useState(false)

  // Form states
  const [newTask, setNewTask] = useState({ title: '', category: '', project: '', priority: 'medium', dueDate: '', tags: [] })
  const [newProject, setNewProject] = useState({ name: '', description: '', category: '', dueDate: '' })
  const [newGoal, setNewGoal] = useState({ title: '', category: '', target: 100, type: 'skill', deadline: '' })
  const [newNote, setNewNote] = useState({ title: '', content: '', category: '', tags: [] })
  const [newCategory, setNewCategory] = useState({ name: '', color: 'bg-blue-500', icon: 'folder' })
  const [newTag, setNewTag] = useState({ name: '', color: 'bg-gray-500' })

  // User stats
  const userStats = {
    totalPoints: 1247,
    level: 3,
    currentStreak: 4,
    pointsToday: 45,
    tasksCompleted: tasks.filter(t => t.completed).length,
    totalTasks: tasks.length,
    activeProjects: projects.filter(p => p.status === 'active').length,
    totalProjects: projects.length,
    goalsInProgress: goals.filter(g => g.progress < 100).length,
    totalGoals: goals.length
  }

  // Get pinned smart lists for quick shortcuts (limit to 4)
  const pinnedSmartLists = smartLists.filter(list => list.pinned).slice(0, 4)

  // Get pinned categories for quick shortcuts
  const pinnedCategories = categories.filter(cat => cat.pinned || false)

  const toggleTask = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ))
  }

  const createSmartList = () => {
    if (newSmartListName.trim()) {
      const newList = {
        id: `smart-${Date.now()}`,
        name: newSmartListName.trim(),
        icon: Star,
        color: 'bg-blue-500',
        pinned: false,
        type: 'smart'
      }
      setSmartLists([...smartLists, newList])
      setNewSmartListName('')
      setShowCreateSmartList(false)
    }
  }

  const toggleSmartListPin = (listId) => {
    setSmartLists(smartLists.map(list =>
      list.id === listId ? { ...list, pinned: !list.pinned } : list
    ))
  }

  const toggleCategoryPin = (categoryId) => {
    setCategories(categories.map(cat =>
      cat.id === categoryId ? { ...cat, pinned: !cat.pinned } : cat
    ))
  }

  const addTask = () => {
    if (newTask.title.trim()) {
      const task = {
        id: Date.now(),
        ...newTask,
        completed: false,
        tags: newTask.tags || []
      }
      setTasks([...tasks, task])
      setNewTask({ title: '', category: '', project: '', priority: 'medium', dueDate: '', tags: [] })
      setShowAddTask(false)
    }
  }

  const addProject = () => {
    if (newProject.name.trim()) {
      const project = {
        id: Date.now(),
        ...newProject,
        status: 'active',
        progress: 0,
        tasks: 0,
        completedTasks: 0
      }
      setProjects([...projects, project])
      setNewProject({ name: '', description: '', category: '', dueDate: '' })
      setShowAddProject(false)
    }
  }

  const addGoal = () => {
    if (newGoal.title.trim()) {
      const goal = {
        id: Date.now(),
        ...newGoal,
        progress: 0
      }
      setGoals([...goals, goal])
      setNewGoal({ title: '', category: '', target: 100, type: 'skill', deadline: '' })
      setShowAddGoal(false)
    }
  }

  const addNote = () => {
    if (newNote.title.trim()) {
      const note = {
        id: Date.now(),
        ...newNote,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        tags: newNote.tags || []
      }
      setNotes([...notes, note])
      setNewNote({ title: '', content: '', category: '', tags: [] })
      setShowAddNote(false)
    }
  }

  const addCategory = () => {
    if (newCategory.name.trim()) {
      const category = {
        id: Date.now(),
        ...newCategory,
        count: 0
      }
      setCategories([...categories, category])
      setNewCategory({ name: '', color: 'bg-blue-500', icon: 'folder' })
      setShowAddCategory(false)
    }
  }

  const addTag = () => {
    if (newTag.name.trim()) {
      const tag = {
        id: Date.now(),
        ...newTag,
        count: 0
      }
      setTags([...tags, tag])
      setNewTag({ name: '', color: 'bg-gray-500' })
      setShowAddTag(false)
    }
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">+{userStats.pointsToday}</div>
          <div className="text-sm text-gray-500">Points Today</div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Today's Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{tasks.filter(t => !t.completed && t.dueDate === '2025-06-05').length}</div>
            <div className="text-xs text-gray-500">{tasks.filter(t => t.completed && t.dueDate === '2025-06-05').length} completed today</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{userStats.activeProjects}</div>
            <div className="text-xs text-gray-500">{userStats.totalProjects} total projects</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Goals in Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{userStats.goalsInProgress}</div>
            <div className="text-xs text-gray-500">{userStats.totalGoals} total goals</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{userStats.totalPoints}</div>
            <div className="text-xs text-gray-500">Level {userStats.level} • {userStats.currentStreak}d streak</div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Focus and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              Today's Focus
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {tasks.filter(t => !t.completed && t.dueDate === '2025-06-05').map(task => (
              <div key={task.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{task.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={task.priority === 'high' ? 'destructive' : 'secondary'}>
                      {task.priority}
                    </Badge>
                    <span className="text-sm text-gray-500">{task.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Goal Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {goals.slice(0, 3).map(goal => (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{goal.title}</h3>
                  <span className="text-sm font-medium">{goal.progress}%</span>
                </div>
                <Progress value={goal.progress} className="h-2" />
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{goal.category}</span>
                  <span>Target: {goal.target}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderTasks = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600">Manage your tasks and to-dos</p>
        </div>
        <Dialog open={showAddTask} onOpenChange={setShowAddTask}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="task-title">Title</Label>
                <Input
                  id="task-title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  placeholder="Enter task title"
                />
              </div>
              <div>
                <Label htmlFor="task-category">Category</Label>
                <Select value={newTask.category} onValueChange={(value) => setNewTask({...newTask, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="task-project">Project</Label>
                <Select value={newTask.project} onValueChange={(value) => setNewTask({...newTask, project: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map(proj => (
                      <SelectItem key={proj.id} value={proj.name}>{proj.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="task-priority">Priority</Label>
                <Select value={newTask.priority} onValueChange={(value) => setNewTask({...newTask, priority: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="task-due">Due Date</Label>
                <Input
                  id="task-due"
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                />
              </div>
              <Button onClick={addTask} className="w-full">Add Task</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm">All ({tasks.length})</Button>
        <Button variant="outline" size="sm">Pending ({tasks.filter(t => !t.completed).length})</Button>
        <Button variant="outline" size="sm">Completed ({tasks.filter(t => t.completed).length})</Button>
      </div>

      <div className="space-y-3">
        {tasks.map(task => (
          <Card key={task.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                    {task.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={task.priority === 'high' ? 'destructive' : 'secondary'}>
                      {task.priority}
                    </Badge>
                    <span className="text-sm text-gray-500">Category: {task.category}</span>
                    <span className="text-sm text-gray-500">Project: {task.project}</span>
                    <span className="text-sm text-gray-500">{task.dueDate}</span>
                  </div>
                  {task.tags && task.tags.length > 0 && (
                    <div className="flex gap-1 mt-2">
                      {task.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">#{tag}</Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderProjects = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600">Manage your projects and initiatives</p>
        </div>
        <Dialog open={showAddProject} onOpenChange={setShowAddProject}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  value={newProject.name}
                  onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                  placeholder="Enter project name"
                />
              </div>
              <div>
                <Label htmlFor="project-description">Description</Label>
                <Textarea
                  id="project-description"
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  placeholder="Enter project description"
                />
              </div>
              <div>
                <Label htmlFor="project-category">Category</Label>
                <Select value={newProject.category} onValueChange={(value) => setNewProject({...newProject, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="project-due">Due Date</Label>
                <Input
                  id="project-due"
                  type="date"
                  value={newProject.dueDate}
                  onChange={(e) => setNewProject({...newProject, dueDate: e.target.value})}
                />
              </div>
              <Button onClick={addProject} className="w-full">Add Project</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <Card key={project.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{project.name}</span>
                <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                  {project.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">{project.description}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Tasks: {project.completedTasks}/{project.tasks}</span>
                <span>Due: {project.dueDate}</span>
              </div>
              <div className="text-sm">
                <Badge variant="outline">{project.category}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderGoals = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Goals</h1>
          <p className="text-gray-600">Track your goals and achievements</p>
        </div>
        <Dialog open={showAddGoal} onOpenChange={setShowAddGoal}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="goal-title">Goal Title</Label>
                <Input
                  id="goal-title"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                  placeholder="Enter goal title"
                />
              </div>
              <div>
                <Label htmlFor="goal-category">Category</Label>
                <Select value={newGoal.category} onValueChange={(value) => setNewGoal({...newGoal, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="goal-type">Goal Type</Label>
                <Select value={newGoal.type} onValueChange={(value) => setNewGoal({...newGoal, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="skill">Skill</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="habit">Habit</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="goal-deadline">Deadline</Label>
                <Input
                  id="goal-deadline"
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                />
              </div>
              <Button onClick={addGoal} className="w-full">Add Goal</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map(goal => (
          <Card key={goal.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{goal.title}</span>
                <Badge variant="outline">{goal.type}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{goal.progress}%</span>
                </div>
                <Progress value={goal.progress} className="h-2" />
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Category: {goal.category}</span>
                <span>Due: {goal.deadline}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderNotes = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notes</h1>
          <p className="text-gray-600">Capture and organize your thoughts</p>
        </div>
        <Dialog open={showAddNote} onOpenChange={setShowAddNote}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Note
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Note</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="note-title">Title</Label>
                <Input
                  id="note-title"
                  value={newNote.title}
                  onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                  placeholder="Enter note title"
                />
              </div>
              <div>
                <Label htmlFor="note-content">Content</Label>
                <Textarea
                  id="note-content"
                  value={newNote.content}
                  onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                  placeholder="Enter note content"
                  rows={6}
                />
              </div>
              <div>
                <Label htmlFor="note-category">Category</Label>
                <Select value={newNote.category} onValueChange={(value) => setNewNote({...newNote, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={addNote} className="w-full">Add Note</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map(note => (
          <Card key={note.id}>
            <CardHeader>
              <CardTitle className="text-lg">{note.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600 line-clamp-3">{note.content}</p>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Category: {note.category}</span>
                <span>Updated: {note.updatedAt}</span>
              </div>
              {note.tags && note.tags.length > 0 && (
                <div className="flex gap-1 flex-wrap">
                  {note.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">#{tag}</Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderCategories = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600">Organize your items with categories</p>
        </div>
        <Dialog open={showAddCategory} onOpenChange={setShowAddCategory}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="category-name">Category Name</Label>
                <Input
                  id="category-name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  placeholder="Enter category name"
                />
              </div>
              <div>
                <Label htmlFor="category-color">Color</Label>
                <Select value={newCategory.color} onValueChange={(value) => setNewCategory({...newCategory, color: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bg-blue-500">Blue</SelectItem>
                    <SelectItem value="bg-green-500">Green</SelectItem>
                    <SelectItem value="bg-purple-500">Purple</SelectItem>
                    <SelectItem value="bg-yellow-500">Yellow</SelectItem>
                    <SelectItem value="bg-pink-500">Pink</SelectItem>
                    <SelectItem value="bg-orange-500">Orange</SelectItem>
                    <SelectItem value="bg-red-500">Red</SelectItem>
                    <SelectItem value="bg-gray-500">Gray</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={addCategory} className="w-full">Add Category</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(category => (
          <Card key={category.id}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg ${category.color}`}>
                  <Tag className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.count} items</p>
                </div>
                <button
                  onClick={() => toggleCategoryPin(category.id)}
                  className="p-1 hover:bg-gray-100 rounded"
                  title={category.pinned ? "Unpin from Quick Shortcuts" : "Pin to Quick Shortcuts"}
                >
                  <Star className={`h-4 w-4 ${category.pinned ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderTags = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tags</h1>
          <p className="text-gray-600">Manage your tags and labels</p>
        </div>
        <Dialog open={showAddTag} onOpenChange={setShowAddTag}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Tag
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Tag</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="tag-name">Tag Name</Label>
                <Input
                  id="tag-name"
                  value={newTag.name}
                  onChange={(e) => setNewTag({...newTag, name: e.target.value})}
                  placeholder="Enter tag name"
                />
              </div>
              <div>
                <Label htmlFor="tag-color">Color</Label>
                <Select value={newTag.color} onValueChange={(value) => setNewTag({...newTag, color: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bg-blue-500">Blue</SelectItem>
                    <SelectItem value="bg-green-500">Green</SelectItem>
                    <SelectItem value="bg-purple-500">Purple</SelectItem>
                    <SelectItem value="bg-yellow-500">Yellow</SelectItem>
                    <SelectItem value="bg-pink-500">Pink</SelectItem>
                    <SelectItem value="bg-orange-500">Orange</SelectItem>
                    <SelectItem value="bg-red-500">Red</SelectItem>
                    <SelectItem value="bg-gray-500">Gray</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={addTag} className="w-full">Add Tag</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tags.map(tag => (
          <Card key={tag.id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${tag.color}`}></div>
                <span className="font-medium">#{tag.name}</span>
                <span className="text-sm text-gray-500 ml-auto">{tag.count}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderComingSoon = () => (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Coming Soon</h2>
        <p className="text-gray-600">This feature is under development.</p>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboard()
      case 'tasks':
        return renderTasks()
      case 'projects':
        return renderProjects()
      case 'goals':
        return renderGoals()
      case 'notes':
        return renderNotes()
      case 'categories':
        return renderCategories()
      case 'tags':
        return renderTags()
      default:
        return renderComingSoon()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`w-72 bg-white border-r border-gray-200 flex-shrink-0 ${
        isMobileMenuOpen ? 'fixed inset-y-0 left-0 z-50 transform translate-x-0' : 'fixed inset-y-0 left-0 z-50 transform -translate-x-full sm:relative sm:translate-x-0'
      } transition-transform duration-300 ease-in-out`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">MASTERMIND</h1>
                <p className="text-sm text-gray-500">Your Second Brain</p>
              </div>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="sm:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Quick Stats */}
          <div className="p-4 border-b border-gray-200">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div>
                <div className="text-lg font-bold text-blue-600">{userStats.totalPoints}</div>
                <div className="text-xs text-gray-500">Points</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-600">Level {userStats.level}</div>
                <div className="text-xs text-gray-500">Current</div>
              </div>
            </div>
          </div>

          {/* Quick Shortcuts Section */}
          {(pinnedSmartLists.length > 0 || pinnedCategories.length > 0) && (
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-700">Quick Shortcuts</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {pinnedSmartLists.map((list) => {
                  const Icon = list.icon
                  return (
                    <button
                      key={list.id}
                      onClick={() => {
                        setActiveSection(list.id)
                        setIsMobileMenuOpen(false)
                      }}
                      className={`flex flex-col items-center gap-1 p-3 rounded-lg text-center transition-colors ${
                        activeSection === list.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className={`p-2 rounded-md ${list.color}`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-xs font-medium">{list.name}</span>
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                    </button>
                  )
                })}
                {pinnedCategories.map((category) => (
                  <button
                    key={`cat-${category.id}`}
                    onClick={() => {
                      setActiveSection(`category-${category.id}`)
                      setIsMobileMenuOpen(false)
                    }}
                    className={`flex flex-col items-center gap-1 p-3 rounded-lg text-center transition-colors ${
                      activeSection === `category-${category.id}`
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className={`p-2 rounded-md ${category.color}`}>
                      <Tag className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-xs font-medium">{category.name}</span>
                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id)
                      setIsMobileMenuOpen(false)
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeSection === item.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className={`p-1.5 rounded-md ${item.color}`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium">{item.name}</span>
                  </button>
                )
              })}
            </div>

            {/* Smart Lists Section */}
            {smartLists.filter(list => !list.pinned).length > 0 && (
              <div className="mt-6">
                <button
                  onClick={() => setIsSmartListsExpanded(!isSmartListsExpanded)}
                  className="flex items-center justify-between w-full mb-2 text-sm font-semibold text-gray-700"
                >
                  <span>Smart Lists</span>
                  {isSmartListsExpanded ? (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                  )}
                </button>
                
                {isSmartListsExpanded && (
                  <div className="space-y-1">
                    {smartLists.filter(list => !list.pinned).map((list) => {
                      const Icon = list.icon
                      return (
                        <div key={list.id} className="group flex items-center">
                          <button
                            onClick={() => {
                              setActiveSection(list.id)
                              setIsMobileMenuOpen(false)
                            }}
                            className={`flex-1 flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                              activeSection === list.id
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <div className={`p-1.5 rounded-md ${list.color}`}>
                              <Icon className="h-4 w-4 text-white" />
                            </div>
                            <span className="font-medium">{list.name}</span>
                          </button>
                          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
                                   <button
                              onClick={() => toggleCategoryPin(category.id)}
                              className="p-0.5 hover:bg-gray-200 rounded"
                              title="Pin to Quick Shortcuts"
                            >
                              <Star className={`h-3 w-3 ${category.pinned ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
                            </button>
                          </div>
                        </div>
                      )
                    })}
                    
                    {/* Create Smart List */}
                    {showCreateSmartList ? (
                      <div className="flex items-center gap-1 px-3 py-2">
                        <Input
                          value={newSmartListName}
                          onChange={(e) => setNewSmartListName(e.target.value)}
                          placeholder="Smart list name"
                          className="h-7 text-sm"
                          onKeyDown={(e) => e.key === 'Enter' && createSmartList()}
                          autoFocus
                        />
                        <Button size="sm" onClick={createSmartList} className="h-7 px-2">
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowCreateSmartList(true)}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors text-gray-500 hover:bg-gray-100"
                      >
                        <Plus className="h-4 w-4" />
                        <span className="font-medium">Add Smart List</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <div className="sm:hidden bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-gray-900">MASTERMIND</span>
            </div>
            <div className="w-9" />
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default App

