export interface User {
  id: string
  email: string
  displayName?: string
  avatar?: string
}

export interface Lead {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  status: string
  source: string
  budget?: number
  notes?: string
  createdAt: string
  updatedAt: string
  userId: string
  assignedAgentId?: string
}

export interface Property {
  id: string
  title: string
  address: string
  price: number
  propertyType: string
  bedrooms?: number
  bathrooms?: number
  squareFeet?: number
  description?: string
  status: string
  images?: string[]
  createdAt: string
  updatedAt: string
  userId: string
  listingAgentId?: string
}

export interface Task {
  id: string
  title: string
  description?: string
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'in-progress' | 'completed'
  dueDate?: string
  assignedTo?: string
  leadId?: string
  propertyId?: string
  createdAt: string
  updatedAt: string
  userId: string
}

export interface Note {
  id: string
  content: string
  tags?: string[]
  leadId?: string
  propertyId?: string
  taskId?: string
  createdAt: string
  updatedAt: string
  userId: string
}

export interface PipelineStage {
  id: string
  name: string
  color: string
  order: number
  userId: string
}

export interface Deal {
  id: string
  title: string
  value: number
  stageId: string
  leadId: string
  propertyId?: string
  probability: number
  expectedCloseDate?: string
  notes?: string
  createdAt: string
  updatedAt: string
  userId: string
}

// Relationship tables for many-to-many connections
export interface LeadProperty {
  id: string
  leadId: string
  propertyId: string
  relationship: string // 'interested', 'viewing', 'offer', etc.
  createdAt: string
  userId: string
}

export interface AgentProperty {
  id: string
  agentId: string
  propertyId: string
  role: string // 'listing', 'selling', 'co-listing', etc.
  createdAt: string
  userId: string
}

export interface AgentLead {
  id: string
  agentId: string
  leadId: string
  role: string // 'primary', 'secondary', 'referral', etc.
  createdAt: string
  userId: string
}