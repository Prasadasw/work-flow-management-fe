import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Plus, 
  Calendar, 
  Clock, 
  User, 
  Target,
  Edit3,
  Trash2,
  Eye,
  CheckCircle,
  Clock as ClockIcon,
  AlertCircle,
  Workflow,
  X
} from 'lucide-react'
import api from '../utils/api'
import toast from 'react-hot-toast'

const ProjectDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [showWorkflow, setShowWorkflow] = useState(false)
  const [taskFormData, setTaskFormData] = useState({
    taskTitle: '',
    taskDescription: '',
    daysSpent: '',
    date: new Date().toISOString().split('T')[0],
    status: 'working',
    priority: 'medium'
  })

  useEffect(() => {
    fetchProjectDetails()
    fetchProjectTasks()
  }, [id])

  const fetchProjectDetails = async () => {
    try {
      const response = await api.get(`/projects/${id}`)
      setProject(response.data.data)
    } catch (error) {
      toast.error('Failed to fetch project details')
    }
  }

  const fetchProjectTasks = async () => {
    try {
      const response = await api.get(`/tasks/project/${id}`)
      setTasks(response.data.data)
    } catch (error) {
      toast.error('Failed to fetch project tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleTaskSubmit = async (e) => {
    e.preventDefault()
    if (!taskFormData.taskTitle.trim()) {
      toast.error('Task title is required')
      return
    }

    try {
      await api.post('/tasks', {
        ...taskFormData,
        projectId: id
      })
      toast.success('Task added successfully!')
      setTaskFormData({
        taskTitle: '',
        taskDescription: '',
        daysSpent: '',
        date: new Date().toISOString().split('T')[0],
        status: 'working',
        priority: 'medium'
      })
      setShowTaskForm(false)
      fetchProjectTasks()
    } catch (error) {
      toast.error('Failed to create task')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'done': return 'bg-green-100 text-green-800'
      case 'working': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-blue-100 text-blue-800'
      case 'low': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'done': return <CheckCircle className="h-4 w-4" />
      case 'working': return <ClockIcon className="h-4 w-4" />
      case 'pending': return <AlertCircle className="h-4 w-4" />
      default: return <ClockIcon className="h-4 w-4" />
    }
  }

  const WorkflowModal = () => {
    if (!showWorkflow) return null

    const sortedTasks = [...tasks].sort((a, b) => new Date(a.date) - new Date(b.date))

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
          </div>

          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
            <div className="bg-white px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Workflow className="h-6 w-6 text-primary-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Project Workflow: {project?.projectName}
                  </h3>
                </div>
                <button
                  onClick={() => setShowWorkflow(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-8">
              {sortedTasks.length === 0 ? (
                <div className="text-center py-12">
                  <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
                  <p className="text-gray-600 mb-6">Add tasks to see the workflow diagram</p>
                  <button
                    onClick={() => {
                      setShowWorkflow(false)
                      setShowTaskForm(true)
                    }}
                    className="btn btn-primary inline-flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Task
                  </button>
                </div>
              ) : (
                <div className="workflow-container">
                  <div className="workflow-timeline">
                    {sortedTasks.map((task, index) => (
                      <div key={task._id} className="workflow-item">
                        <div className="workflow-node">
                          <div className={`workflow-task ${getStatusColor(task.status)}`}>
                            <div className="workflow-task-header">
                              <h4 className="workflow-task-title">{task.taskTitle}</h4>
                              <div className="workflow-task-status">
                                {getStatusIcon(task.status)}
                                <span className="ml-1 capitalize">{task.status}</span>
                              </div>
                            </div>
                            
                            {task.taskDescription && (
                              <p className="workflow-task-description">{task.taskDescription}</p>
                            )}
                            
                            <div className="workflow-task-meta">
                              <div className="workflow-task-date">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(task.date).toLocaleDateString()}</span>
                              </div>
                              {task.daysSpent > 0 && (
                                <div className="workflow-task-time">
                                  <Clock className="h-4 w-4" />
                                  <span>{task.daysSpent} hours</span>
                                </div>
                              )}
                              <div className={`workflow-task-priority ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {index < sortedTasks.length - 1 && (
                          <div className="workflow-arrow">
                            <div className="workflow-arrow-line"></div>
                            <div className="workflow-arrow-head"></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Completed</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>In Progress</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span>Pending</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowWorkflow(false)}
                  className="btn btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Project not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/projects')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{project.projectName}</h1>
            <p className="text-gray-600">{project.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowWorkflow(true)}
            className="btn btn-secondary inline-flex items-center relative"
          >
            <Workflow className="h-4 w-4 mr-2" />
            View Workflow
            {tasks.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-primary-100 text-primary-800 text-xs font-medium rounded-full">
                {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
              </span>
            )}
          </button>
          <button
            onClick={() => setShowTaskForm(!showTaskForm)}
            className="btn btn-primary inline-flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Task 
          </button>
        </div>
      </div>

      {/* Project Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="font-semibold text-gray-900 capitalize">{project.status}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Start Date</p>
              <p className="font-semibold text-gray-900">
                {new Date(project.startDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <User className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Client</p>
              <p className="font-semibold text-gray-900">{project.clientName || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Priority</p>
              <p className="font-semibold text-gray-900 capitalize">{project.priority}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Task Form */}
      {showTaskForm && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Quick Task</h3>
          <form onSubmit={handleTaskSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="What are you working on today?"
                value={taskFormData.taskTitle}
                onChange={(e) => setTaskFormData({...taskFormData, taskTitle: e.target.value})}
                className="input"
                required
              />
              <input
                type="number"
                placeholder="Hours spent (optional)"
                value={taskFormData.daysSpent}
                onChange={(e) => setTaskFormData({...taskFormData, daysSpent: e.target.value})}
                className="input"
                min="0"
                step="0.5"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="date"
                value={taskFormData.date}
                onChange={(e) => setTaskFormData({...taskFormData, date: e.target.value})}
                className="input"
              />
              <select
                value={taskFormData.status}
                onChange={(e) => setTaskFormData({...taskFormData, status: e.target.value})}
                className="input"
              >
                <option value="working">Working</option>
                <option value="done">Done</option>
                <option value="pending">Pending</option>
              </select>
              <select
                value={taskFormData.priority}
                onChange={(e) => setTaskFormData({...taskFormData, priority: e.target.value})}
                className="input"
              >
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
                <option value="low">Low</option>
              </select>
            </div>
            <textarea
              placeholder="Brief description (optional)"
              value={taskFormData.taskDescription}
              onChange={(e) => setTaskFormData({...taskFormData, taskDescription: e.target.value})}
              className="input"
              rows={2}
            />
            <div className="flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowTaskForm(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Add Task
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tasks Section */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Project Tasks ({tasks.length})</h2>
        </div>
        
        {tasks.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Target className="h-12 w-12 mx-auto" />
            </div>
            <p className="text-gray-600 mb-4">No tasks yet for this project</p>
            <button
              onClick={() => setShowTaskForm(true)}
              className="btn btn-primary inline-flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add First Task
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {tasks.map((task) => (
              <div key={task._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{task.taskTitle}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    
                    {task.taskDescription && (
                      <p className="text-gray-600 text-sm mb-3">{task.taskDescription}</p>
                    )}
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(task.date).toLocaleDateString()}
                      </span>
                      {task.daysSpent > 0 && (
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {task.daysSpent} hours
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => navigate(`/tasks/${task._id}`)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => navigate(`/tasks/${task._id}/edit`)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Edit Task"
                    >
                      <Edit3 className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Workflow Modal */}
      <WorkflowModal />
    </div>
  )
}

export default ProjectDetail
