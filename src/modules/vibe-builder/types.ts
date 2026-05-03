export interface Component {
  id: string;
  type: 'hero' | 'heading' | 'text' | 'image' | 'navbar' | 'footer' | 'contact' | 'features';
  props: Record<string, any>;
}

export interface Page {
  id: string;
  name: string;
  slug: string;
  components: Component[];
}

export interface Site {
  id: string;
  name: string;
  slug: string;
  pages: Page[];
  published: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}