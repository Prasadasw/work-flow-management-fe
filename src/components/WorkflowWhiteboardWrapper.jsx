import { ReactFlowProvider } from '@xyflow/react'
import WorkflowWhiteboard from './WorkflowWhiteboard'

const WorkflowWhiteboardWrapper = ({ tasks, projectName, onClose }) => {
  return (
    <ReactFlowProvider>
      <WorkflowWhiteboard 
        tasks={tasks} 
        projectName={projectName} 
        onClose={onClose} 
      />
    </ReactFlowProvider>
  )
}

export default WorkflowWhiteboardWrapper
