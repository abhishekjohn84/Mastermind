import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { 
  Brain, LayoutDashboard, Plus, Calendar, CheckSquare, FileText, 
  FolderOpen, Tag, Target, Activity, Heart, BarChart3, Map, 
  CalendarDays, Users, BookOpen, ChefHat, Archive, Settings,
  X, Star, Zap, Coffee, Briefcase, Home, Car, Plane,
  Music, Camera, Gamepad2, Palette, Code, Dumbbell, GraduationCap,
  Clock, AlertCircle, Flag, Search, Filter, Save, Trash2, Edit,
  CalendarIcon, User, Hash, Trophy, Award, TrendingUp, 
  CheckCircle, Circle, Menu, X as CloseIcon, Inbox
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import './App.css'

// Task Categories and Priority Levels
const TASK_CATEGORIES = [
  { id: 'work', name: 'Work', color: '#3B82F6', icon: Briefcase },
  { id: 'personal', name: 'Personal', color: '#10B981', icon: Home },
  { id: 'health', name: 'Health', color: '#EF4444', icon: Heart },
  { id: 'learning', name: 'Learning', color: '#8B5CF6', icon: GraduationCap },
  { id: 'finance', name: 'Finance', color: '#F59E0B', icon: Target },
  { id: 'social', name: 'Social', color: '#EC4899', icon: Users }
]

const PRIORITY_LEVELS = {
  HIGH: { value: 'high', label: 'High', color: '#EF4444', icon: AlertCircle },
  MEDIUM: { value: 'medium', label: 'Medium', color: '#F59E0B', icon: Flag },
  LOW: { value: 'low', label: 'Low', color: '#10B981', icon: Clock }
}

// Goal Categories
const GOAL_CATEGORIES = [
  { id: 'personal', name: 'Personal Development', color: '#10B981', icon: User },
  { id: 'career', name: 'Career & Professional', color: '#3B82F6', icon: Briefcase },
  { id: 'health', name: 'Health & Fitness', color: '#EF4444', icon: Heart },
  { id: 'learning', name: 'Learning & Education', color: '#8B5CF6', icon: GraduationCap },
  { id: 'financial', name: 'Financial', color: '#F59E0B', icon: Target },
  { id: 'relationships', name: 'Relationships & Social', color: '#EC4899', icon: Users }
]

// Default navigation items
const defaultNavigationItems = [
  { id: 1, name: 'Dashboard', path: '/', icon: LayoutDashboard, isDefault: true },
  { id: 2, name: 'Quick Capture', path: '/quick-capture', icon: Plus, isDefault: true },
  { id: 3, name: 'My Day', path: '/my-day', icon: Calendar, isDefault: true },
  { id: 4, name: 'Tasks', path: '/tasks', icon: CheckSquare, isDefault: true },
  { id: 5, name: 'Notes', path: '/notes', icon: FileText, isDefault: true },
  { id: 6, name: 'Projects', path: '/projects', icon: FolderOpen, isDefault: true },
  { id: 7, name: 'Tags', path: '/tags', icon: Tag, isDefault: true },
  { id: 8, name: 'Goals', path: '/goals', icon: Target, isDefault: true },
  { id: 9, name: 'Habits', path: '/habits', icon: Activity, isDefault: true },
  { id: 10, name: 'Health & Wellness', path: '/health', icon: Heart, isDefault: true },
  { id: 11, name: 'Weekly Review', path: '/weekly-review', icon: BarChart3, isDefault: true },
  { id: 12, name: 'Life Areas', path: '/life-areas', icon: Map, isDefault: true },
  { id: 13, name: 'Annual Planning', path: '/annual-planning', icon: CalendarDays, isDefault: true },
  { id: 14, name: 'People', path: '/people', icon: Users, isDefault: true },
  { id: 15, name: 'Books', path: '/books', icon: BookOpen, isDefault: true },
  { id: 16, name: 'Recipes', path: '/recipes', icon: ChefHat, isDefault: true },
  { id: 17, name: 'Progress', path: '/progress', icon: Target, isDefault: true },
  { id: 18, name: 'Archive', path: '/archive', icon: Archive, isDefault: true },
  { id: 19, name: 'Settings', path: '/settings', icon: Settings, isDefault: true }
]

// Utility functions
const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

const loadFromLocalStorage = (key, defaultValue = []) => {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : defaultValue
  } catch (error) {
    console.error('Error loading from localStorage:', error)
    return defaultValue
  }
}

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: d.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined 
  })
}

const isToday = (date) => {
  if (!date) return false
  const today = new Date()
  const taskDate = new Date(date)
  return today.toDateString() === taskDate.toDateString()
}

const isOverdue = (date) => {
  if (!date) return false
  const today = new Date()
  const taskDate = new Date(date)
  return taskDate < today && !isToday(date)
}

const calculateGoalProgress = (goal, tasks = []) => {
  if (goal.milestones && goal.milestones.length > 0) {
    const completedMilestones = goal.milestones.filter(m => m.completed).length
    return Math.round((completedMilestones / goal.milestones.length) * 100)
  }
  
  if (goal.linkedTaskIds && goal.linkedTaskIds.length > 0) {
    const linkedTasks = tasks.filter(task => goal.linkedTaskIds.includes(task.id))
    const completedTasks = linkedTasks.filter(task => task.completed).length
    return linkedTasks.length > 0 ? Math.round((completedTasks / linkedTasks.length) * 100) : 0
  }
  
  return goal.manualProgress || 0
}

// Navigation Item Component
const NavigationItem = React.memo(({ item, isActive, onDelete }) => {
  const IconComponent = item.icon
  
  return (
    <div className="group relative">
      <Link
        to={item.path}
        className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
          isActive
            ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
        }`}
      >
        <IconComponent className="h-5 w-5 flex-shrink-0" />
        <span className="font-medium truncate">{item.name}</span>
      </Link>
      {!item.isDefault && (
        <button
          onClick={() => onDelete(item.id)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-red-100 rounded"
        >
          <X className="h-3 w-3 text-red-500" />
        </button>
      )}
    </div>
  )
})

// Dashboard Card Component
const DashboardCard = React.memo(({ title, children, className = "" }) => (
  <Card className={`transition-all duration-300 hover:shadow-lg ${className}`}>
    <CardHeader className="pb-3">
      <CardTitle className="text-lg font-semibold text-gray-800">{title}</CardTitle>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
))

// Task Item Component
const TaskItem = React.memo(({ task, onToggle, projects, tags }) => {
  const priorityConfig = PRIORITY_LEVELS[task.priority?.toUpperCase()] || PRIORITY_LEVELS.MEDIUM
  const PriorityIcon = priorityConfig.icon
  const project = projects.find(p => p.id === task.projectId)
  const taskTags = tags.filter(tag => task.tags?.includes(tag.id))
  
  return (
    <div className={`group p-4 border rounded-lg transition-all duration-200 hover:shadow-md ${
      task.completed ? 'bg-gray-50 opacity-75' : 'bg-white'
    } ${isOverdue(task.dueDate) && !task.completed ? 'border-red-200 bg-red-50' : 'border-gray-200'}`}>
      <div className="flex items-start space-x-3">
        <button
          onClick={() => onToggle(task.id)}
          className="mt-1 flex-shrink-0"
        >
          {task.completed ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <Circle className="h-5 w-5 text-gray-400 hover:text-green-600 transition-colors" />
          )}
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {task.title}
            </h3>
            <PriorityIcon 
              className="h-4 w-4 flex-shrink-0" 
              style={{ color: priorityConfig.color }} 
            />
          </div>
          
          {task.description && (
            <p className="text-sm text-gray-600 mb-2">{task.description}</p>
          )}
          
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            {task.dueDate && (
              <span className={`flex items-center space-x-1 ${
                isOverdue(task.dueDate) && !task.completed ? 'text-red-600 font-medium' : ''
              }`}>
                <CalendarIcon className="h-3 w-3" />
                <span>{formatDate(task.dueDate)}</span>
              </span>
            )}
            
            {project && (
              <span className="flex items-center space-x-1">
                <FolderOpen className="h-3 w-3" />
                <span style={{ color: project.color }}>{project.name}</span>
              </span>
            )}
            
            {taskTags.length > 0 && (
              <div className="flex items-center space-x-1">
                <Hash className="h-3 w-3" />
                <div className="flex space-x-1">
                  {taskTags.map(tag => (
                    <Badge key={tag.id} variant="secondary" className="text-xs">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
})

// Goal Item Component
const GoalItem = React.memo(({ goal, tasks, onToggle }) => {
  const category = GOAL_CATEGORIES.find(c => c.id === goal.category)
  const progress = calculateGoalProgress(goal, tasks)
  
  return (
    <div className={`group p-4 border rounded-lg transition-all duration-200 hover:shadow-md ${
      goal.completed ? 'bg-gray-50 opacity-75' : 'bg-white'
    } border-gray-200`}>
      <div className="flex items-start space-x-3">
        <button
          onClick={() => onToggle(goal.id)}
          className="mt-1 flex-shrink-0"
        >
          {goal.completed ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <Circle className="h-5 w-5 text-gray-400 hover:text-green-600 transition-colors" />
          )}
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className={`font-medium ${goal.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {goal.title}
            </h3>
            {category && (
              <Badge style={{ backgroundColor: category.color, color: 'white' }} className="text-xs">
                {category.name}
              </Badge>
            )}
          </div>
          
          {goal.description && (
            <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
          )}
          
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm text-gray-600">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>
    </div>
  )
})

// Main App Component
function App() {
  const location = useLocation()
  
  // Mobile responsiveness state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  // Navigation state
  const [navigationItems, setNavigationItems] = useState(() => 
    loadFromLocalStorage('mastermind_navigation', defaultNavigationItems)
  )
  const [showAddForm, setShowAddForm] = useState(false)
  const [newItemName, setNewItemName] = useState('')

  // Data state
  const [tasks, setTasks] = useState(() => loadFromLocalStorage('mastermind_tasks', [
    {
      id: '1',
      title: 'Review quarterly goals',
      description: 'Analyze Q1 performance and set Q2 objectives',
      category: 'work',
      priority: 'high',
      dueDate: new Date().toISOString(),
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Morning workout',
      description: '30 minutes cardio and strength training',
      category: 'health',
      priority: 'medium',
      dueDate: new Date().toISOString(),
      completed: true,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString()
    }
  ]))
  
  const [projects, setProjects] = useState(() => loadFromLocalStorage('mastermind_projects', [
    {
      id: '1',
      name: 'Website Redesign',
      description: 'Complete overhaul of company website',
      color: '#3B82F6',
      createdAt: new Date().toISOString()
    }
  ]))
  
  const [tags, setTags] = useState(() => loadFromLocalStorage('mastermind_tags', [
    { id: '1', name: 'urgent', color: '#EF4444' },
    { id: '2', name: 'important', color: '#F59E0B' }
  ]))
  
  const [goals, setGoals] = useState(() => loadFromLocalStorage('mastermind_goals', [
    {
      id: '1',
      title: 'Learn React Development',
      description: 'Master React and build 3 projects',
      category: 'learning',
      timeframe: 'medium',
      targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      milestones: [
        { id: '1', title: 'Complete React basics', completed: true },
        { id: '2', title: 'Build first project', completed: false },
        { id: '3', title: 'Learn advanced concepts', completed: false }
      ],
      completed: false,
      createdAt: new Date().toISOString()
    }
  ]))

  // Gamification state
  const [userStats, setUserStats] = useState(() => 
    loadFromLocalStorage('mastermind_user_stats', {
      totalPoints: 1247,
      level: 3,
      currentStreak: 4,
      bestStreak: 12,
      tasksCompleted: 89,
      achievementsUnlocked: 4,
      goalsCompleted: 2
    })
  )

  // Computed values
  const todayTasks = useMemo(() => 
    tasks.filter(task => !task.completed && isToday(task.dueDate)),
    [tasks]
  )

  const overdueTasks = useMemo(() => 
    tasks.filter(task => !task.completed && isOverdue(task.dueDate)),
    [tasks]
  )

  const completedTasksToday = useMemo(() => 
    tasks.filter(task => task.completed && isToday(task.completedAt)),
    [tasks]
  )

  const activeGoals = useMemo(() => 
    goals.filter(goal => !goal.completed),
    [goals]
  )

  // Event handlers
  const handleMobileMenuToggle = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev)
  }, [])

  const handleNavigationItemDelete = useCallback((id) => {
    setNavigationItems(prev => prev.filter(item => item.id !== id))
  }, [])

  const handleAddNavigationItem = useCallback(() => {
    if (newItemName.trim()) {
      const newItem = {
        id: Date.now(),
        name: newItemName.trim(),
        path: `/${newItemName.toLowerCase().replace(/\s+/g, '-')}`,
        icon: Star,
        isDefault: false
      }
      setNavigationItems(prev => [...prev, newItem])
      setNewItemName('')
      setShowAddForm(false)
    }
  }, [newItemName])

  const handleTaskToggle = useCallback((taskId) => {
    const task = tasks.find(t => t.id === taskId)
    if (task) {
      const isCompleting = !task.completed
      setTasks(prev => prev.map(t => 
        t.id === taskId 
          ? { 
              ...t, 
              completed: isCompleting,
              completedAt: isCompleting ? new Date().toISOString() : null
            }
          : t
      ))
      
      if (isCompleting) {
        setUserStats(prev => ({
          ...prev,
          totalPoints: prev.totalPoints + 50,
          tasksCompleted: prev.tasksCompleted + 1
        }))
      }
    }
  }, [tasks])

  const handleGoalToggle = useCallback((goalId) => {
    const goal = goals.find(g => g.id === goalId)
    if (goal) {
      const isCompleting = !goal.completed
      setGoals(prev => prev.map(g => 
        g.id === goalId 
          ? { 
              ...g, 
              completed: isCompleting,
              completedAt: isCompleting ? new Date().toISOString() : null
            }
          : g
      ))
      
      if (isCompleting) {
        setUserStats(prev => ({
          ...prev,
          totalPoints: prev.totalPoints + 500,
          goalsCompleted: prev.goalsCompleted + 1
        }))
      }
    }
  }, [goals])

  // Save to localStorage
  useEffect(() => {
    saveToLocalStorage('mastermind_navigation', navigationItems)
  }, [navigationItems])

  useEffect(() => {
    saveToLocalStorage('mastermind_tasks', tasks)
  }, [tasks])

  useEffect(() => {
    saveToLocalStorage('mastermind_projects', projects)
  }, [projects])

  useEffect(() => {
    saveToLocalStorage('mastermind_tags', tags)
  }, [tags])

  useEffect(() => {
    saveToLocalStorage('mastermind_goals', goals)
  }, [goals])

  useEffect(() => {
    saveToLocalStorage('mastermind_user_stats', userStats)
  }, [userStats])

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
          onClick={handleMobileMenuToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`w-80 bg-white border-r border-gray-200 flex-shrink-0 ${
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
              onClick={handleMobileMenuToggle}
              className="sm:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>
          {/* Quick Stats */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{userStats.totalPoints}</div>
                <div className="text-sm text-gray-500">Points</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">Level {userStats.level}</div>
                <div className="text-sm text-gray-500">Current</div>
              </div>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Shortcuts</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/inbox"
                className="flex flex-col items-center gap-2 p-3 rounded-xl text-center transition-colors text-gray-700 hover:bg-gray-50 border border-gray-200"
              >
                <div className="p-2 bg-gray-500 rounded-lg">
                  <Inbox className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-medium">Inbox</span>
                <Star className="h-3 w-3 text-yellow-500 fill-current" />
              </Link>

              <Link
                to="/today"
                className="flex flex-col items-center gap-2 p-3 rounded-xl text-center transition-colors text-gray-700 hover:bg-gray-50 border border-gray-200"
              >
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-medium">Today</span>
                <Star className="h-3 w-3 text-yellow-500 fill-current" />
              </Link>

              <Link
                to="/scheduled"
                className="flex flex-col items-center gap-2 p-3 rounded-xl text-center transition-colors text-gray-700 hover:bg-gray-50 border border-gray-200"
              >
                <div className="p-2 bg-orange-500 rounded-lg">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-medium">Scheduled</span>
                <Star className="h-3 w-3 text-yellow-500 fill-current" />
              </Link>

              <Link
                to="/flagged"
                className="flex flex-col items-center gap-2 p-3 rounded-xl text-center transition-colors text-gray-700 hover:bg-gray-50 border border-gray-200"
              >
                <div className="p-2 bg-red-500 rounded-lg">
                  <Flag className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-medium">Flagged</span>
                <Star className="h-3 w-3 text-yellow-500 fill-current" />
              </Link>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {navigationItems.map((item) => (
                <NavigationItem
                  key={item.id}
                  item={item}
                  isActive={location.pathname === item.path}
                  onDelete={handleNavigationItemDelete}
                />
              ))}
            </div>

            {/* Add New Item */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              {showAddForm ? (
                <div className="space-y-3">
                  <Input
                    placeholder="Enter item name"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddNavigationItem()}
                  />
                  <div className="flex items-center space-x-2">
                    <Button onClick={handleAddNavigationItem} size="sm">
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowAddForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowAddForm(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <div className="sm:hidden bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={handleMobileMenuToggle}
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
          <Routes>
            <Route path="/" element={<Dashboard 
              tasks={tasks}
              goals={goals}
              projects={projects}
              userStats={userStats}
              todayTasks={todayTasks}
              overdueTasks={overdueTasks}
              completedTasksToday={completedTasksToday}
              activeGoals={activeGoals}
              onTaskToggle={handleTaskToggle}
              onGoalToggle={handleGoalToggle}
            />} />
            <Route path="/tasks" element={<TasksPage 
              tasks={tasks}
              projects={projects}
              tags={tags}
              onTaskToggle={handleTaskToggle}
            />} />
            <Route path="/goals" element={<GoalsPage 
              goals={goals}
              tasks={tasks}
              onGoalToggle={handleGoalToggle}
            />} />
            <Route path="/progress" element={<ProgressPage 
              userStats={userStats}
            />} />
            <Route path="*" element={<ComingSoon />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

// Dashboard Component
const Dashboard = React.memo(({ 
  tasks, goals, projects, userStats, todayTasks, overdueTasks, 
  completedTasksToday, activeGoals, onTaskToggle, onGoalToggle 
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">+45</div>
          <div className="text-sm text-gray-500">Points Today</div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard title="Today's Tasks">
          <div className="space-y-2">
            <div className="text-2xl font-bold text-blue-600">{todayTasks.length}</div>
            <p className="text-sm text-gray-600">
              {completedTasksToday.length} completed today
            </p>
            {overdueTasks.length > 0 && (
              <p className="text-sm text-red-600">
                {overdueTasks.length} overdue
              </p>
            )}
          </div>
        </DashboardCard>

        <DashboardCard title="Active Goals">
          <div className="space-y-2">
            <div className="text-2xl font-bold text-green-600">{activeGoals.length}</div>
            <p className="text-sm text-gray-600">
              {goals.filter(g => g.completed).length} completed
            </p>
          </div>
        </DashboardCard>

        <DashboardCard title="Projects">
          <div className="space-y-2">
            <div className="text-2xl font-bold text-purple-600">{projects.length}</div>
            <p className="text-sm text-gray-600">
              {projects.length} active
            </p>
          </div>
        </DashboardCard>

        <DashboardCard title="Progress">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span className="text-lg font-bold">{userStats.totalPoints}</span>
            </div>
            <div className="text-sm text-gray-600">
              Level {userStats.level} • {userStats.currentStreak}d streak
            </div>
            <div className="text-xs text-gray-500">
              {userStats.achievementsUnlocked}/12 achievements
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Tasks */}
        <DashboardCard title="Today's Focus">
          <div className="space-y-3">
            {todayTasks.length > 0 ? (
              todayTasks.slice(0, 5).map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={onTaskToggle}
                  projects={projects}
                  tags={[]}
                />
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No tasks for today. Great job!</p>
            )}
          </div>
        </DashboardCard>

        {/* Recent Goals */}
        <DashboardCard title="Goal Progress">
          <div className="space-y-4">
            {activeGoals.length > 0 ? (
              activeGoals.slice(0, 3).map(goal => (
                <GoalItem
                  key={goal.id}
                  goal={goal}
                  tasks={tasks}
                  onToggle={onGoalToggle}
                />
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No active goals. Set some goals to get started!</p>
            )}
          </div>
        </DashboardCard>
      </div>
    </div>
  )
})

// Tasks Page Component
const TasksPage = React.memo(({ tasks, projects, tags, onTaskToggle }) => {
  const [searchTerm, setSearchTerm] = useState('')
  
  const filteredTasks = useMemo(() => {
    return tasks.filter(task =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [tasks, searchTerm])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600">Manage and organize your tasks efficiently</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tasks List */}
      <Card>
        <CardHeader>
          <CardTitle>Tasks ({filteredTasks.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredTasks.length > 0 ? (
              filteredTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={onTaskToggle}
                  projects={projects}
                  tags={tags}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <CheckSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first task.'}
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Task
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
})

// Goals Page Component
const GoalsPage = React.memo(({ goals, tasks, onGoalToggle }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Goals</h1>
          <p className="text-gray-600">Track your long-term objectives and milestones</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Goal
        </Button>
      </div>

      {/* Goals List */}
      <Card>
        <CardHeader>
          <CardTitle>Goals ({goals.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {goals.length > 0 ? (
              goals.map(goal => (
                <GoalItem
                  key={goal.id}
                  goal={goal}
                  tasks={tasks}
                  onToggle={onGoalToggle}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <Target className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No goals found</h3>
                <p className="text-gray-500 mb-4">Set your first goal to start tracking your progress.</p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Goal
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
})

// Progress Page Component
const ProgressPage = React.memo(({ userStats }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Progress</h1>
          <p className="text-gray-600">Track your achievements and productivity metrics</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">{userStats.totalPoints}</div>
          <div className="text-sm text-gray-500">Total Points</div>
        </div>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard title="Tasks Completed">
          <div className="space-y-2">
            <div className="text-2xl font-bold text-green-600">{userStats.tasksCompleted}</div>
            <p className="text-sm text-gray-600">All time</p>
          </div>
        </DashboardCard>

        <DashboardCard title="Current Streak">
          <div className="space-y-2">
            <div className="text-2xl font-bold text-orange-600">{userStats.currentStreak}d</div>
            <p className="text-sm text-gray-600">Best: {userStats.bestStreak} days</p>
          </div>
        </DashboardCard>

        <DashboardCard title="Goals Completed">
          <div className="space-y-2">
            <div className="text-2xl font-bold text-purple-600">{userStats.goalsCompleted}</div>
            <p className="text-sm text-gray-600">Lifetime achievements</p>
          </div>
        </DashboardCard>

        <DashboardCard title="Achievements">
          <div className="space-y-2">
            <div className="text-2xl font-bold text-yellow-600">{userStats.achievementsUnlocked}</div>
            <p className="text-sm text-gray-600">Unlocked</p>
          </div>
        </DashboardCard>
      </div>
    </div>
  )
})

// Coming Soon Component
const ComingSoon = React.memo(() => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
        <Zap className="h-8 w-8 text-blue-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Coming Soon</h2>
      <p className="text-gray-600">This feature is under development and will be available soon.</p>
    </div>
  </div>
))

// Wrap App with Router
function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  )
}

export default AppWithRouter

