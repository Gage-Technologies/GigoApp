export default interface Post {
    _id: string;
    title: string;
    description: string;
    author: string;
    author_id: string;
    tags: string[];
    tag_strings: string[];
    created_at: Date;
    updated_at: Date;
    repo_id: string;
    tier: number;
    tier_string: string;
    awards: string[];
    top_reply: string | null;
    coffee: number;
    post_type: number;
    post_type_string: string;
    views: number;
    completions: number;
    attempts: number;
    languages: number[];
    languages_strings: string[];
    published: boolean;
    visibility: number;
    visibility_string: string;
    thumbnail: string;
    leads: boolean;
    challenge_cost: string;
    exclusive_description: string;
    name: string;
    color_palette: string;
    render_in_front: boolean;
    estimated_tutorial_time_millis: number | null;
    deleted: boolean;
    has_access: boolean;
    start_time_millis: number;
    stripe_price_id: number | string;
    post_title: "string";
    tutorial_preview?: string;
}

export interface ProjectTutorial {
    number: number;
    content: string;
}