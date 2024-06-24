export default interface Attempt {
    _id: string;
    title?: string;
    post_title: string;
    description: string;
    author: string;
    author_id: string;
    created_at: Date;
    updated_at: Date;
    repo_id: string;
    author_tier: number;
    awards: string[];
    coffee: string;
    post_id: string;
    closed: boolean;
    success: boolean;
    closed_date: Date | null;
    tier: number;
    parent_attempt: string | null;
    thumbnail: string;
    post_type: number;
    post_type_string: string;
    exclusive_description: string;
    name: string;
    color_palette: string;
    render_in_front: boolean;
    estimated_tutorial_time_millis: number | null;
    start_time_millis: number;
}