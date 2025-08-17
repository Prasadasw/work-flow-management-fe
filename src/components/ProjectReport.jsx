import { useState } from 'react'
import { Download, FileText, Calendar, Clock, User, Target, CheckCircle, Clock as ClockIcon, AlertCircle, Building } from 'lucide-react'
import { saveAs } from 'file-saver'

const ProjectReport = ({ project, tasks, onClose }) => {
  const [downloading, setDownloading] = useState(false)

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const calculateProjectProgress = () => {
    if (tasks.length === 0) return 0
    const completedTasks = tasks.filter(task => task.status === 'done').length
    return Math.round((completedTasks / tasks.length) * 100)
  }

  const generateWordDocument = async () => {
    setDownloading(true)
    try {
      // Create a simple HTML template that we'll convert to Word
      const htmlContent = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; }
              h1 { color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }
              h2 { color: #374151; margin-top: 30px; }
              .project-info { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .task-item { border: 1px solid #e5e7eb; padding: 15px; margin: 10px 0; border-radius: 6px; }
              .status-badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
              .status-done { background: #d1fae5; color: #065f46; }
              .status-working { background: #dbeafe; color: #1e40af; }
              .status-pending { background: #fef3c7; color: #92400e; }
              .priority-high { background: #fed7aa; color: #c2410c; }
              .priority-medium { background: #dbeafe; color: #1e40af; }
              .priority-low { background: #e5e7eb; color: #374151; }
              .priority-urgent { background: #fecaca; color: #991b1b; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th, td { border: 1px solid #d1d5db; padding: 12px; text-align: left; }
              th { background: #f3f4f6; font-weight: bold; }
            </style>
          </head>
          <body>
            <h1>Project Report: ${project.projectName}</h1>
            
            <div class="project-info">
              <h2>Project Overview</h2>
              <p><strong>Project Name:</strong> ${project.projectName}</p>
              <p><strong>Description:</strong> ${project.description}</p>
              <p><strong>Status:</strong> ${project.status}</p>
              <p><strong>Priority:</strong> ${project.priority}</p>
              <p><strong>Start Date:</strong> ${formatDate(project.startDate)}</p>
              <p><strong>Client:</strong> ${project.clientName || 'N/A'}</p>
              <p><strong>Progress:</strong> ${calculateProjectProgress()}%</p>
            </div>

            <h2>Task Summary</h2>
            <p>Total Tasks: ${tasks.length}</p>
            <p>Completed: ${tasks.filter(t => t.status === 'done').length}</p>
            <p>In Progress: ${tasks.filter(t => t.status === 'working').length}</p>
            <p>Pending: ${tasks.filter(t => t.status === 'pending').length}</p>

            <h2>Detailed Task List</h2>
            <table>
              <thead>
                <tr>
                  <th>Task Title</th>
                  <th>Description</th>
                  <th>Status</th>
              </thead>
              <tbody>
                ${tasks.map(task => `
                  <tr>
                    <td>${task.taskTitle}</td>
                    <td>${task.taskDescription || 'N/A'}</td>
                    <td><span class="status-badge status-${task.status}">${task.status}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p><strong>Report Generated:</strong> ${new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
            </div>
          </body>
        </html>
      `

      // Convert HTML to Word document using a simple approach
      const blob = new Blob([htmlContent], { type: 'text/html' })
      saveAs(blob, `${project.projectName}_Project_Report.html`)
      
      // For a proper Word document, you would need a more sophisticated approach
      // This creates an HTML file that can be opened in Word
      
    } catch (error) {
      console.error('Error generating document:', error)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-primary-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Project Report</h3>
              <p className="text-sm text-gray-600">Comprehensive overview of project and tasks</p>
            </div>
          </div>
          <button
            onClick={generateWordDocument}
            disabled={downloading}
            className="btn btn-primary inline-flex items-center"
          >
            {downloading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </>
            )}
          </button>
        </div>
      </div>

      {/* Project Overview */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Project Overview</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Building className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Project Name</p>
                <p className="font-semibold text-gray-900">{project.projectName}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Target className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-semibold text-gray-900 capitalize">{project.status}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Priority</p>
                <p className="font-semibold text-gray-900 capitalize">{project.priority}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Start Date</p>
                <p className="font-semibold text-gray-900">{formatDate(project.startDate)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-indigo-600" />
              <div>
                <p className="text-sm text-gray-600">Client</p>
                <p className="font-semibold text-gray-900">{project.clientName || 'N/A'}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Progress</p>
                <p className="font-semibold text-gray-900">{calculateProjectProgress()}%</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Description:</p>
          <p className="text-gray-900 bg-gray-50 rounded-lg p-3">{project.description}</p>
        </div>
      </div>

      {/* Task Summary */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Task Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{tasks.length}</div>
            <div className="text-sm text-gray-600">Total Tasks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {tasks.filter(t => t.status === 'done').length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {tasks.filter(t => t.status === 'working').length}
            </div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {tasks.filter(t => t.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
        </div>
      </div>

      {/* Detailed Task List */}
      <div className="px-6 py-4">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Detailed Task List</h4>
        {tasks.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No tasks available for this project</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task, index) => (
              <div key={task._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                      <h5 className="font-semibold text-gray-900">{task.taskTitle}</h5>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        <span className="flex items-center space-x-1">
                          {getStatusIcon(task.status)}
                          <span>{task.status}</span>
                        </span>
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
                        {formatDate(task.date)}
                      </span>
                      {task.daysSpent > 0 && (
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {task.daysSpent} hours
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="text-center text-sm text-gray-600">
          <p>Report generated on {new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
          <p className="mt-1">Workflow Management System</p>
        </div>
      </div>
    </div>
  )
}

export default ProjectReport
