export interface PageLayout {
    type: 'standard' | 'fullWidth' | 'split' | 'custom' | 'static';
    content: any;
    backgroundColor?: string;
    margin?: number[];
}

export interface PageConfig {
    key: string;
    title: string;
    description: string;
    bullets?: string[];
    value?: string;
    headerImage?: string;
    iconImage?: string;
    backgroundColor?: string;
    textColor?: string;
    valueColor?: string;
    layout?: PageLayout;
    height?: string
}