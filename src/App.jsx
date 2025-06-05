import React, { useState, useEffect, useMemo } from 'react'
import { 
  Brain, Menu, X, Plus, Search, Filter, Calendar, 
  CheckCircle2, Circle, Star, Flag, Inbox, Clock,
  Target, FileText, Tag, BarChart3, Settings,
  FolderPlus, PlusCircle, Edit3, Trash2, ArrowUp, ArrowDown,
  Home, ListTodo, Folder, BookOpen, Hash, TrendingUp,
  Users, Bell, Archive, ChevronDown, ChevronRight
} from 'lucide-react'

// UI Components
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
    {children}
  </div>
)

const CardContent = ({ children, className = "" }) => (
  <div className={`${className}`}>
    {children}
  </div>
)

const Button = ({ children, variant = "default", size = "default", className = "", ...props }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background"
  
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80"
  }
  
  const sizes = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 rounded-md",
    lg: "h-11 px-8 rounded-md"
  }
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

const Input = ({ className = "", ...props }) => (
  <input
    className={`flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
)

const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    destructive: "bg-destructive text-destructive-foreground",
    outline: "text-foreground border border-input"
  }
  
  return (
    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variants[variant]} ${className}`}>
      {children}
    </div>
  )
}

function App() {
  // State management
  const [activeSection, setActiveSection] = useState('dashboard')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Review quarterly goals', completed: false, priority: 'high', category: 'work', project: 'Q4 Planning', dueDate: '2024-12-15', tags: ['important', 'review'] },
    { id: 2, title: 'Update project documentation', completed: false, priority: 'medium', category: 'work', project: 'Documentation', dueDate: '2024-12-20', tags: ['docs'] },
    { id: 3, title: 'Plan team meeting agenda', completed: true, priority: 'medium', category: 'work', project: 'Team Management', dueDate: '2024-12-10', tags: ['meeting'] },
    { id: 4, title: 'Research new productivity tools', completed: false, priority: 'low', category: 'personal', project: 'Self Improvement', dueDate: '2024-12-25', tags: ['research'] },
    { id: 5, title: 'Prepare presentation slides', completed: false, priority: 'high', category: 'work', project: 'Q4 Planning', dueDate: '2024-12-18', tags: ['presentation'] }
  ])
  
  const [projects, setProjects] = useState([
    { id: 1, name: 'Q4 Planning', description: 'Strategic planning for Q4 goals and objectives', progress: 75, category: 'work', status: 'active', dueDate: '2024-12-31' },
    { id: 2, name: 'Documentation', description: 'Update and maintain project documentation', progress: 45, category: 'work', status: 'active', dueDate: '2024-12-30' },
    { id: 3, name: 'Team Management', description: 'Improve team collaboration and processes', progress: 60, category: 'work', status: 'active', dueDate: '2025-01-15' },
    { id: 4, name: 'Self Improvement', description: 'Personal development and skill building', progress: 30, category: 'personal', status: 'active', dueDate: '2025-02-01' }
  ])
  
  const [goals, setGoals] = useState([
    { id: 1, title: 'Learn React Development', description: 'Master React and modern web development', progress: 33, type: 'skill', target: 100, current: 33, dueDate: '2025-03-01' },
    { id: 2, title: 'Complete 50 Tasks', description: 'Finish 50 high-priority tasks this quarter', progress: 60, type: 'productivity', target: 50, current: 30, dueDate: '2024-12-31' },
    { id: 3, title: 'Read 12 Books', description: 'Read one book per month for personal growth', progress: 75, type: 'learning', target: 12, current: 9, dueDate: '2024-12-31' }
  ])
  
  const [notes, setNotes] = useState([
    { id: 1, title: 'Meeting Notes - Q4 Planning', content: 'Key discussion points from quarterly planning meeting...', category: 'work', tags: ['meeting', 'planning'], createdAt: '2024-12-01' },
    { id: 2, title: 'Book Summary - Atomic Habits', content: 'Key insights and takeaways from James Clear\'s book...', category: 'personal', tags: ['books', 'habits'], createdAt: '2024-11-28' },
    { id: 3, title: 'Project Ideas', content: 'Collection of potential project ideas for next year...', category: 'ideas', tags: ['brainstorming', 'projects'], createdAt: '2024-11-25' }
  ])
  
  const [categories, setCategories] = useState([
    { id: 1, name: 'Work', color: 'bg-blue-500', count: 8, pinned: false },
    { id: 2, name: 'Personal', color: 'bg-green-500', count: 5, pinned: false },
    { id: 3, name: 'Ideas', color: 'bg-purple-500', count: 3, pinned: false },
    { id: 4, name: 'Learning', color: 'bg-orange-500', count: 4, pinned: false },
    { id: 5, name: 'Health', color: 'bg-red-500', count: 2, pinned: false },
    { id: 6, name: 'Finance', color: 'bg-yellow-500', count: 3, pinned: false }
  ])
  
  const [tags, setTags] = useState([
    { id: 1, name: 'important', color: 'bg-red-500', count: 12 },
    { id: 2, name: 'urgent', color: 'bg-orange-500', count: 8 },
    { id: 3, name: 'review', color: 'bg-blue-500', count: 6 },
    { id: 4, name: 'meeting', color: 'bg-green-500', count: 10 },
    { id: 5, name: 'research', color: 'bg-purple-500', count: 5 },
    { id: 6, name: 'planning', color: 'bg-indigo-500', count: 7 }
  ])

  // Smart lists configuration
  const smartLists = [
    { id: 'inbox', name: 'Inbox', icon: Inbox, color: 'bg-gray-500', pinned: true },
    { id: 'today', name: 'Today', icon: Calendar, color: 'bg-blue-500', pinned: true },
    { id: 'scheduled', name: 'Scheduled', icon: Clock, color: 'bg-orange-500', pinned: true },
    { id: 'flagged', name: 'Flagged', icon: Flag, color: 'bg-red-500', pinned: true },
    { id: 'all', name: 'All', icon: ListTodo, color: 'bg-gray-600', pinned: false }
  ]

  // User stats
  const userStats = {
    totalPoints: 1247,
    level: 3,
    streak: 4
  }

  // Navigation items
  const navigationItems = [
    { id: 'dashboard', name: 'Dashboard', icon: Home, color: 'text-blue-600' },
    { id: 'quick-capture', name: 'Quick Capture', icon: PlusCircle, color: 'text-green-600' },
    { id: 'tasks', name: 'Tasks', icon: ListTodo, color: 'text-purple-600' },
    { id: 'projects', name: 'Projects', icon: Folder, color: 'text-orange-600' },
    { id: 'goals', name: 'Goals', icon: Target, color: 'text-red-600' },
    { id: 'notes', name: 'Notes', icon: FileText, color: 'text-indigo-600' },
    { id: 'categories', name: 'Categories', icon: Tag, color: 'text-pink-600' },
    { id: 'tags', name: 'Tags', icon: Hash, color: 'text-cyan-600' },
    { id: 'calendar', name: 'Calendar', icon: Calendar, color: 'text-emerald-600' },
    { id: 'progress', name: 'Progress', icon: BarChart3, color: 'text-yellow-600' },
    { id: 'habits', name: 'Habits', icon: TrendingUp, color: 'text-teal-600' },
    { id: 'analytics', name: 'Analytics', icon: BarChart3, color: 'text-violet-600' },
    { id: 'settings', name: 'Settings', icon: Settings, color: 'text-gray-600' }
  ]

  // Get pinned smart lists and categories for quick shortcuts
  const pinnedSmartLists = smartLists.filter(list => list.pinned)
  const pinnedCategories = categories.filter(cat => cat.pinned)

  // Dashboard render function
  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600">+45 Points Today</div>
          <div className="text-sm text-gray-500">Keep up the great work!</div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Tasks</p>
                <p className="text-3xl font-bold text-blue-600">
                  {tasks.filter(task => !task.completed && new Date(task.dueDate) <= new Date()).length}
                </p>
              </div>
              <ListTodo className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Projects</p>
                <p className="text-3xl font-bold text-orange-600">
                  {projects.filter(project => project.status === 'active').length}
                </p>
              </div>
              <Folder className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Goals in Progress</p>
                <p className="text-3xl font-bold text-red-600">{goals.length}</p>
              </div>
              <Target className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Progress</p>
                <p className="text-3xl font-bold text-purple-600">{userStats.totalPoints}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section Previews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Focus */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Today's Focus</h3>
              <Button variant="ghost" size="sm" onClick={() => setActiveSection('tasks')}>
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {tasks.filter(task => !task.completed && new Date(task.dueDate) <= new Date()).slice(0, 3).map(task => (
                <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Circle className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}>
                        {task.priority}
                      </Badge>
                      <span className="text-sm text-gray-500">{task.project}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Goal Progress */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Goal Progress</h3>
              <Button variant="ghost" size="sm" onClick={() => setActiveSection('goals')}>
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {goals.slice(0, 3).map(goal => (
                <div key={goal.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">{goal.title}</p>
                    <span className="text-sm text-gray-500">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Projects */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Active Projects</h3>
              <Button variant="ghost" size="sm" onClick={() => setActiveSection('projects')}>
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {projects.filter(project => project.status === 'active').slice(0, 3).map(project => (
                <div key={project.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-gray-900">{project.name}</p>
                    <span className="text-sm text-gray-500">{project.progress}%</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-orange-600 h-1.5 rounded-full transition-all duration-300" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Notes */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Notes</h3>
              <Button variant="ghost" size="sm" onClick={() => setActiveSection('notes')}>
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {notes.slice(0, 3).map(note => (
                <div key={note.id} className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900 mb-1">{note.title}</p>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{note.content}</p>
                  <div className="flex items-center gap-2">
                    {note.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  // Other render functions (simplified for brevity)
  const renderTasks = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>
      <div className="grid gap-4">
        {tasks.map(task => (
          <Card key={task.id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                {task.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-400" />
                )}
                <div className="flex-1">
                  <p className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}>
                      {task.priority}
                    </Badge>
                    <span className="text-sm text-gray-500">{task.project}</span>
                    <span className="text-sm text-gray-500">Due: {task.dueDate}</span>
                  </div>
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
        <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <Card key={project.id}>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">{project.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{project.description}</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Progress</span>
                  <span className="text-sm font-medium">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
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
        <h1 className="text-3xl font-bold text-gray-900">Goals</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Goal
        </Button>
      </div>
      <div className="grid gap-6">
        {goals.map(goal => (
          <Card key={goal.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                <Badge>{goal.type}</Badge>
              </div>
              <p className="text-gray-600 mb-4">{goal.description}</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Progress: {goal.current} / {goal.target}</span>
                  <span className="text-sm font-medium">{goal.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
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
        <h1 className="text-3xl font-bold text-gray-900">Notes</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Note
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map(note => (
          <Card key={note.id}>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">{note.title}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{note.content}</p>
              <div className="flex items-center gap-2 mb-2">
                {note.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-gray-500">{note.createdAt}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderCategories = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
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
                  onClick={() => {
                    setCategories(categories.map(cat =>
                      cat.id === category.id ? { ...cat, pinned: !cat.pinned } : cat
                    ))
                  }}
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
        <h1 className="text-3xl font-bold text-gray-900">Tags</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Tag
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tags.map(tag => (
          <Card key={tag.id}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg ${tag.color}`}>
                  <Hash className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">{tag.name}</h3>
                  <p className="text-sm text-gray-500">{tag.count} items</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderComingSoon = () => (
    <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <div className="text-6xl mb-4">🚀</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Coming Soon</h2>
        <p className="text-gray-600">This feature is under development and will be available soon!</p>
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

      {/* Sidebar - Apple Reminders Style */}
      <div className={`w-64 bg-white border-r border-gray-200 flex-shrink-0 ${
        isMobileMenuOpen ? 'fixed inset-y-0 left-0 z-50 transform translate-x-0' : 'fixed inset-y-0 left-0 z-50 transform -translate-x-full sm:relative sm:translate-x-0'
      } transition-transform duration-300 ease-in-out`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-blue-600 rounded-lg">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">MASTERMIND</h1>
                <p className="text-xs text-gray-500">Your Second Brain</p>
              </div>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="sm:hidden p-1 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-4 w-4" />
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

          {/* Quick Shortcuts - Apple Reminders Style */}
          <div className="p-4 border-b border-gray-200">
            <div className="grid grid-cols-2 gap-2">
              {pinnedSmartLists.slice(0, 4).map((list) => {
                const Icon = list.icon
                return (
                  <button
                    key={list.id}
                    onClick={() => {
                      setActiveSection(list.id)
                      setIsMobileMenuOpen(false)
                    }}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl text-center transition-colors ${
                      activeSection === list.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${list.color}`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-xs font-medium">{list.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

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
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${item.color}`} />
                    <span className="font-medium">{item.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Add Category Button - Apple Reminders Style */}
          <div className="p-4 border-t border-gray-200">
            <button className="w-full flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <Plus className="h-4 w-4" />
              <span className="font-medium">Add Category</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="sm:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="font-semibold text-gray-900">MASTERMIND</h1>
          <div className="w-9" /> {/* Spacer */}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

