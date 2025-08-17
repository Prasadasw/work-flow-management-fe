import { useState, useCallback, useMemo, useEffect } from 'react'
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  useReactFlow,
  getBezierPath,
  getSmoothStepPath
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { 
  Plus, 
  Save, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut,
  Target,
  Calendar,
  Clock,
  CheckCircle,
  Clock as ClockIcon,
  AlertCircle
} from 'lucide-react'

const WorkflowWhiteboard = ({ tasks, projectName, onClose }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [selectedNode, setSelectedNode] = useState(null)
  const [showConnectionMode, setShowConnectionMode] = useState(false)
  const [connectionSource, setConnectionSource] = useState(null)
  
  const { fitView, zoomIn, zoomOut, setViewport } = useReactFlow()



  // Helper functions for styling - moved to top to avoid hoisting issues
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
      case 'done': return <CheckCircle className="h-3 w-3" />
      case 'working': return <ClockIcon className="h-3 w-3" />
      case 'pending': return <AlertCircle className="h-3 w-3" />
      default: return <ClockIcon className="h-3 w-3" />
    }
  }

  const getStatusBorderColor = (status) => {
    switch (status) {
      case 'done': return '#10b981'
      case 'working': return '#3b82f6'
      case 'pending': return '#f59e0b'
      default: return '#6b7280'
    }
  }

  // Create initial workflow connections based on task dates
  const createInitialConnections = useCallback(() => {
    if (tasks.length < 2) return []
    
    const sortedTasks = [...tasks].sort((a, b) => new Date(a.date) - new Date(b.date))
    const newEdges = []
    
    for (let i = 0; i < sortedTasks.length - 1; i++) {
      const sourceTask = sortedTasks[i]
      const targetTask = sortedTasks[i + 1]
      
      newEdges.push({
        id: `edge-${sourceTask._id}-${targetTask._id}`,
        source: sourceTask._id,
        target: targetTask._id,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#3b82f6', strokeWidth: 2 },
        label: 'Next',
        labelStyle: { fill: '#3b82f6', fontWeight: 600 }
      })
    }
    
    setEdges(newEdges)
  }, [tasks, setEdges])

  // Convert tasks to React Flow nodes
  const taskNodes = useMemo(() => {
    if (!tasks || tasks.length === 0) {
      return []
    }
    
    return tasks.map((task, index) => {
      const row = Math.floor(index / 3)
      const col = index % 3
      const x = 250 + (col * 300)
      const y = 100 + (row * 200)
      
      return {
        id: task._id,
        type: 'taskNode',
        position: { x, y },
        data: { 
          task,
          label: task.taskTitle,
          status: task.status,
          priority: task.priority,
          description: task.taskDescription,
          date: task.date,
          daysSpent: task.daysSpent
        },
        style: {
          width: 280,
          height: 160,
          borderRadius: '12px',
          border: '2px solid',
          borderColor: getStatusBorderColor(task.status),
          backgroundColor: 'white',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out'
        }
      }
    })
  }, [tasks])

  // Initialize nodes when component mounts or tasks change
  useEffect(() => {
    if (taskNodes.length > 0) {
      setNodes(taskNodes)
      // Auto-arrange nodes in a grid
      setTimeout(() => {
        fitView({ padding: 0.1 })
      }, 100)
      // Create initial connections
      createInitialConnections()
    }
  }, [taskNodes, setNodes, fitView, createInitialConnections])

  // Handle node selection
  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node)
    if (showConnectionMode && connectionSource && connectionSource !== node.id) {
      // Create connection
      const newEdge = {
        id: `edge-${connectionSource}-${node.id}`,
        source: connectionSource,
        target: node.id,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#10b981', strokeWidth: 2 },
        label: 'Connected',
        labelStyle: { fill: '#10b981', fontWeight: 600 }
      }
      
      setEdges((eds) => addEdge(newEdge, eds))
      setShowConnectionMode(false)
      setConnectionSource(null)
    }
  }, [showConnectionMode, connectionSource, setEdges, setShowConnectionMode, setConnectionSource])



  // Handle edge creation
  const onConnect = useCallback((params) => {
    const newEdge = {
      ...params,
      id: `edge-${params.source}-${params.target}`,
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#10b981', strokeWidth: 2 },
      label: 'Connected',
      labelStyle: { fill: '#10b981', fontWeight: 600 }
    }
    setEdges((eds) => addEdge(newEdge, eds))
  }, [setEdges])

  // Start connection mode
  const startConnection = useCallback((nodeId) => {
    setShowConnectionMode(true)
    setConnectionSource(nodeId)
  }, [setShowConnectionMode, setConnectionSource])

  // Reset workflow
  const resetWorkflow = useCallback(() => {
    setEdges([])
    createInitialConnections()
  }, [createInitialConnections])

  // Auto-arrange nodes
  const arrangeNodes = useCallback(() => {
    const newNodes = taskNodes.map((node, index) => {
      const row = Math.floor(index / 3)
      const col = index % 3
      const x = 250 + (col * 300)
      const y = 100 + (row * 200)
      
      return {
        ...node,
        position: { x, y }
      }
    })
    
    setNodes(newNodes)
    setTimeout(() => fitView({ padding: 0.1 }), 100)
  }, [taskNodes, setNodes, fitView])

  // Custom task node component
  const TaskNode = ({ data }) => {
    const { task, status, priority, description, date, daysSpent } = data
    
    return (
      <div className="p-4 h-full">
        <div className="flex items-start justify-between mb-3">
          <h4 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">
            {task.taskTitle}
          </h4>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
              {getStatusIcon(status)}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(priority)}`}>
              {priority}
            </span>
          </div>
        </div>
        
        {description && (
          <p className="text-gray-600 text-xs mb-3 line-clamp-2">{description}</p>
        )}
        
        <div className="space-y-2 text-xs text-gray-500">
          <div className="flex items-center space-x-2">
            <Calendar className="h-3 w-3" />
            <span>{new Date(date).toLocaleDateString()}</span>
          </div>
          {daysSpent > 0 && (
            <div className="flex items-center space-x-2">
              <Clock className="h-3 w-3" />
              <span>{daysSpent} hours</span>
            </div>
          )}
        </div>
        
        {/* Connection handles */}
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg cursor-pointer hover:bg-blue-600 transition-colors" />
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg cursor-pointer hover:bg-green-600 transition-colors" />
        
        {/* Action buttons */}
        <div className="absolute top-2 right-2 flex space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              startConnection(task._id)
            }}
            className={`p-1 rounded text-xs transition-colors ${
              showConnectionMode && connectionSource === task._id
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title="Connect to another task"
          >
            <Target className="h-3 w-3" />
          </button>
        </div>
      </div>
    )
  }

  const nodeTypes = {
    taskNode: TaskNode
  }

  return (
    <div className="h-full w-full">
      {nodes.length === 0 ? (
        <div className="h-full w-full bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Workflow...</h3>
            <p className="text-gray-600 mb-4">Preparing your interactive whiteboard</p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </div>
      ) : (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
          className="bg-gray-50"
          connectionMode="loose"
          snapToGrid={true}
          snapGrid={[20, 20]}
          minZoom={0.1}
          maxZoom={2}
          defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
          style={{ height: '100%', width: '100%' }}
        >
        <Background variant="dots" gap={20} size={1} color="#e5e7eb" />
        <Controls />
        <MiniMap 
          nodeColor={(node) => getStatusBorderColor(node.data.status)}
          nodeStrokeWidth={3}
          zoomable
          pannable
        />
        

        
        {/* Top Panel */}
        <Panel position="top-left" className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 m-4">
          <div className="flex items-center space-x-4">
            <div>
              <h3 className="font-semibold text-gray-900">Workflow Whiteboard</h3>
              <p className="text-sm text-gray-600">{projectName}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={arrangeNodes}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Auto-arrange nodes"
              >
                <RotateCcw className="h-4 w-4 text-gray-600" />
              </button>
              <button
                onClick={resetWorkflow}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Reset workflow"
              >
                <RotateCcw className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>
        </Panel>

        {/* Connection Mode Indicator */}
        {showConnectionMode && (
          <Panel position="top-center" className="bg-green-100 border border-green-300 rounded-lg px-4 py-2">
            <div className="flex items-center space-x-2 text-green-800">
              <Target className="h-4 w-4" />
              <span className="font-medium">Connection Mode Active</span>
              <span className="text-sm">Click on another task to connect</span>
            </div>
          </Panel>
        )}

        {/* Zoom Controls */}
        <Panel position="bottom-right" className="bg-white rounded-lg shadow-lg border border-gray-200 p-2 m-4">
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => zoomIn()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4 text-gray-600" />
            </button>
            <button
              onClick={() => zoomOut()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4 text-gray-600" />
            </button>
            <button
              onClick={() => fitView({ padding: 0.1 })}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Fit View"
            >
              <Target className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </Panel>

        {/* Legend */}
        <Panel position="bottom-left" className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 m-4">
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900 text-sm">Legend</h4>
            <div className="flex items-center space-x-2 text-xs">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Completed</span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>In Progress</span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Pending</span>
            </div>
                     </div>
         </Panel>
         </ReactFlow>
       )}
     </div>
   )
 }

export default WorkflowWhiteboard
