import React from 'react'
import WorkflowWhiteboardWrapper from './WorkflowWhiteboardWrapper'

const WorkflowDemo = () => {
  const sampleTasks = [
    {
      _id: '1',
      taskTitle: 'Project Planning',
      taskDescription: 'Define project scope and requirements',
      status: 'done',
      priority: 'high',
      date: '2024-01-01',
      daysSpent: 8
    },
    {
      _id: '2',
      taskTitle: 'Design Phase',
      taskDescription: 'Create UI/UX mockups and wireframes',
      status: 'working',
      priority: 'medium',
      date: '2024-01-05',
      daysSpent: 12
    },
    {
      _id: '3',
      taskTitle: 'Development',
      taskDescription: 'Implement core functionality',
      status: 'pending',
      priority: 'high',
      date: '2024-01-15',
      daysSpent: 0
    },
    {
      _id: '4',
      taskTitle: 'Testing',
      taskDescription: 'Perform unit and integration tests',
      status: 'pending',
      priority: 'medium',
      date: '2024-01-25',
      daysSpent: 0
    }
  ]

  return (
    <div className="h-screen w-full bg-gray-50">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Workflow Whiteboard Demo</h1>
        <p className="text-gray-600 mb-4">This is a demo of the React Flow workflow whiteboard with sample tasks.</p>
      </div>
      <div className="h-full">
        <WorkflowWhiteboardWrapper 
          tasks={sampleTasks}
          projectName="Sample Project"
          onClose={() => console.log('Demo closed')}
        />
      </div>
    </div>
  )
}

export default WorkflowDemo
