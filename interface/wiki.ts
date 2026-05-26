export interface WikiPageMeta {
	path: string;
	tags: string[];
	title: string;
}

export interface WikiFiles {
	concepts: WikiPageMeta[];
	entities: WikiPageMeta[];
	sources: WikiPageMeta[];
	synthesis: WikiPageMeta[];
}

export interface WikiFileFrontmatter {
	area?: string;
	author?: string;
	created?: string;
	ingested?: string;
	'source-date'?: string;
	sources?: string[];
	subtype?: string;
	tags?: string[];
	title: string;
	type: string;
	updated?: string;
}

export interface WikiFileResponse {
	content: string;
	frontmatter: WikiFileFrontmatter;
}

export interface ChatMessage {
	content: string;
	pagesConsulted?: string[];
	role: 'assistant' | 'user';
}

export interface ChatResponse {
	answer: string;
	pages_consulted: string[];
}
