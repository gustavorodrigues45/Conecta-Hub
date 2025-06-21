
// src/types/index.ts

export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string; // URL to avatar image
  role: string; // e.g., "Estudante de Design Gráfico"
  bio?: string;
  portfolio?: ProjectStub[];
  connections?: Connection[]; // Simplified for now
  // Add other fields as needed: email, github, behance, etc.
}

export interface ProjectStub {
  id: string;
  title: string;
  imageUrl: string; // Main image for card
  category?: string;
}

export interface Project extends ProjectStub {
  author: User;
  description: string;
  images: string[]; // URLs to project images
  tags?: string[];
  figmaLink?: string;
  githubLink?: string;
  // Add other fields: dateCreated, likes, comments, etc.
}

export interface Vaga {
  id: string;
  title: string;
  companyName: string;
  companyLogo: string; // URL to company logo
  description: string;
  type: 'Freela' | 'Fixa' | 'Estágio';
  location: string; // e.g., "Remoto", "São Paulo, SP"
  details?: string; // Additional details like duration, pay
  // Add other fields: requirements, responsibilities, datePosted, etc.
}

export interface Connection {
  userId: string; // ID of the connected user
  status: 'pending' | 'accepted' | 'declined';
  // Add other fields: dateConnected, messages, etc.
}

// You can expand these types as your application grows.
// For example, for mockData.ts, you might create more specific types.
