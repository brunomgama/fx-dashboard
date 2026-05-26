export type NavigationItem = {
	title: string;
	icon: React.ComponentType<{ className?: string }>;
	url?: string;
	children?: NavigationItem[];
};
