import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckSquare, ArrowLeft, Clock, Calendar, Target } from 'lucide-react'
import api from '../utils/api'
import toast from 'react-hot-toast'

const CreateTask = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [projects, setProjects] = useState([])
  const [formData, setFormData] = useState({
    taskTitle: '',
    taskDescription: '',
    projectId: searchParams.get('projectId') || '',
    daysSpent: '',
    date: new Date().toISOString().split('T')[0],
    status: 'working',
    priority: 'medium'
  })

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects')
      setProjects(response.data.data)
    } catch (error) {
      toast.error('Failed to fetch projects')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.taskTitle.trim()) {
      toast.error('Task title is required')
      return
    }

    if (!formData.projectId) {
      toast.error('Please select a project')
      return
    }

    setLoading(true)
    try {
      await api.post('/tasks', formData)
      toast.success('Task created successfully!')
      
      // Navigate back to project if we came from there
      if (searchParams.get('projectId')) {
        navigate(`/projects/${searchParams.get('projectId')}`)
      } else {
        navigate('/tasks')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create task')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Task</h1>
          <p className="text-gray-600">Quick task creation for daily updates</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Task Title - Most Important */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What are you working on? *
            </label>
            <input
              type="text"
              value={formData.taskTitle}
              onChange={(e) => handleInputChange('taskTitle', e.target.value)}
              className="input text-lg"
              placeholder="e.g., Fixed login bug, Updated user dashboard..."
              required
            />
          </div>

          {/* Project Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project *
            </label>
            <select 
              value={formData.projectId}
              onChange={(e) => handleInputChange('projectId', e.target.value)}
              className="input"
              required
            >
              <option value="">Select a project</option>
              {projects.map(project => (
                <option key={project._id} value={project._id}>
                  {project.projectName}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Status and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="h-4 w-4 inline mr-1" />
                Time Spent (hours)
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={formData.daysSpent}
                onChange={(e) => handleInputChange('daysSpent', e.target.value)}
                className="input"
                placeholder="2.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="input"
              />
            </div>
          </div>

          {/* Status and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Target className="h-4 w-4 inline mr-1" />
                Status
              </label>
              <select 
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="input"
              >
                <option value="working">Working on it</option>
                <option value="done">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select 
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                className="input"
              >
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* Description - Optional */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (optional)
            </label>
            <textarea
              value={formData.taskDescription}
              onChange={(e) => handleInputChange('taskDescription', e.target.value)}
              rows={3}
              className="input"
              placeholder="Brief description of what you accomplished..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary inline-flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Add Task
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Quick Tips */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">💡 Quick Tips</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Keep task titles short and descriptive</li>
          <li>• Use "Working on it" for ongoing tasks</li>
          <li>• Mark as "Completed" when you finish</li>
          <li>• Track time spent for better reporting</li>
        </ul>
      </div>
    </div>
  )
}

export default CreateTask
