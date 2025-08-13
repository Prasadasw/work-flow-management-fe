import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Edit3, 
  Calendar, 
  Clock, 
  Target,
  CheckCircle,
  AlertCircle,
  Clock as ClockIcon
} from 'lucide-react'
import api from '../utils/api'
import toast from 'react-hot-toast'

const TaskDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    taskTitle: '',
    taskDescription: '',
    daysSpent: '',
    date: '',
    status: '',
    priority: '',
    notes: ''
  })

  useEffect(() => {
    fetchTask()
  }, [id])

  const fetchTask = async () => {
    try {
      const response = await api.get(`/tasks/${id}`)
      const taskData = response.data.data
      setTask(taskData)
      setFormData({
        taskTitle: taskData.taskTitle,
        taskDescription: taskData.taskDescription,
        daysSpent: taskData.daysSpent || '',
        date: taskData.date ? new Date(taskData.date).toISOString().split('T')[0] : '',
        status: taskData.status,
        priority: taskData.priority,
        notes: taskData.notes || ''
      })
    } catch (error) {
      toast.error('Failed to fetch task details')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    
    if (!formData.taskTitle.trim()) {
      toast.error('Task title is required')
      return
    }

    try {
      await api.put(`/tasks/${id}`, formData)
      toast.success('Task updated successfully!')
      setEditing(false)
      fetchTask()
    } catch (error) {
      toast.error('Failed to update task')
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/tasks/${id}`)
        toast.success('Task deleted successfully!')
        navigate('/tasks')
      } catch (error) {
        toast.error('Failed to delete task')
      }
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
      case 'done': return <CheckCircle className="h-5 w-5" />
      case 'working': return <ClockIcon className="h-5 w-5" />
      case 'pending': return <AlertCircle className="h-5 w-5" />
      default: return <ClockIcon className="h-5 w-5" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Task not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Task Details</h1>
            <p className="text-gray-600">Project: {task.projectId?.projectName}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="btn btn-secondary inline-flex items-center"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Edit
            </button>
          )}
          <button
            onClick={handleDelete}
            className="btn btn-danger inline-flex items-center"
          >
            Delete
          </button>
        </div>
      </div>

      {editing ? (
        /* Edit Form */
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Edit Task</h3>
          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Title *
              </label>
              <input
                type="text"
                value={formData.taskTitle}
                onChange={(e) => setFormData({...formData, taskTitle: e.target.value})}
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.taskDescription}
                onChange={(e) => setFormData({...formData, taskDescription: e.target.value})}
                rows={4}
                className="input"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Spent (hours)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.daysSpent}
                  onChange={(e) => setFormData({...formData, daysSpent: e.target.value})}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="input"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="input"
                >
                  <option value="pending">Pending</option>
                  <option value="working">Working</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  className="input"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                rows={3}
                className="input"
              />
            </div>

            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Update Task
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* View Mode */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{task.taskTitle}</h2>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(task.status)}
                </div>
              </div>

              {task.taskDescription && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                  <p className="text-gray-600">{task.taskDescription}</p>
                </div>
              )}

              {task.notes && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Notes</h3>
                  <p className="text-gray-600">{task.notes}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium text-gray-900">
                      {new Date(task.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {task.daysSpent > 0 && (
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Time Spent</p>
                      <p className="font-medium text-gray-900">{task.daysSpent} hours</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Info</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Project</p>
                  <p className="font-medium text-gray-900">{task.projectId?.projectName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="font-medium text-gray-900">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {task.completedDate && (
                  <div>
                    <p className="text-sm text-gray-500">Completed</p>
                    <p className="font-medium text-gray-900">
                      {new Date(task.completedDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate(`/projects/${task.projectId?._id}`)}
                  className="w-full btn btn-secondary"
                >
                  View Project
                </button>
                <button
                  onClick={() => navigate('/tasks')}
                  className="w-full btn btn-outline"
                >
                  All Tasks
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TaskDetail
