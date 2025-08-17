import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, FileText } from 'lucide-react'
import api from '../utils/api'
import toast from 'react-hot-toast'
import ProjectReport from '../components/ProjectReport'

const ProjectReportPage = () => {
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
    <div className="min-h-screen bg-gray-50">
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
              <FileText className="h-6 w-6 text-primary-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Project Report: {project.projectName}
                </h1>
                <p className="text-sm text-gray-600">
                  Comprehensive project overview and task details
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Report */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProjectReport
          project={project}
          tasks={tasks}
          onClose={() => navigate(`/projects/${id}`)}
        />
      </div>
    </div>
  )
}

export default ProjectReportPage
