export interface PostCreateDTO {
    title: string;
    description: string;
}

export interface PostUpdateDTO {
    id: string;
    title: string;
    description: string;
    category: string; 
}