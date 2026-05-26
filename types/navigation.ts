export interface NavigationItem {
	children?: NavigationItem[];
	icon: React.ComponentType<{ className?: string }>;
	title: string;
	url?: string;
}
