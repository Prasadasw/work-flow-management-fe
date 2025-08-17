import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Workflow } from 'lucide-react'
import api from '../utils/api'
import toast from 'react-hot-toast'
import WorkflowWhiteboardWrapper from '../components/WorkflowWhiteboardWrapper'

const ProjectWorkflow = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
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
    <div className="h-screen w-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(`/projects/${id}`)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div className="flex items-center space-x-3">
              <Workflow className="h-6 w-6 text-primary-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Workflow Whiteboard: {project.projectName}
                </h1>
                <p className="text-sm text-gray-600">
                  {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} • Interactive workflow visualization
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-500">
              <span className="font-medium">Status:</span> {project.status}
            </div>
            <div className="text-sm text-gray-500">
              <span className="font-medium">Priority:</span> {project.priority}
            </div>
          </div>
        </div>
      </div>

      {/* Workflow Whiteboard */}
      <div className="h-full">
        {tasks.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Workflow className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
              <p className="text-gray-600 mb-6">Add tasks to see the interactive workflow whiteboard</p>
              <button
                onClick={() => navigate(`/projects/${id}`)}
                className="btn btn-primary inline-flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Project
              </button>
            </div>
          </div>
        ) : (
          <WorkflowWhiteboardWrapper
            tasks={tasks}
            projectName={project.projectName}
            onClose={() => navigate(`/projects/${id}`)}
          />
        )}
      </div>
    </div>
  )
}

export default ProjectWorkflow
