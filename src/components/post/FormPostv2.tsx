'use client'

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { createPost } from "@/services/post.service"
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { fetchAllCategories } from "@/services/category.service"

type FormPostProps = {
    setOpen: (open: boolean) => void;
}

type Category = {
    id: string;
    name: string;
}

const FormPost = ({ setOpen } : FormPostProps) => {
    const queryClient = useQueryClient();
    const { isLoading, error, data } = useQuery<Category[]>({
        queryKey: ['getAllCategories'],
        queryFn: fetchAllCategories,
    });

    const mutation = useMutation({
        mutationFn: createPost,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['getAllPosts']
            })
            setOpen(false);
        },
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const target = e.target as HTMLFormElement;
        const createPostDTO = {
            title: (target.elements.namedItem('title') as HTMLInputElement).value,
            description: (target.elements.namedItem('description') as HTMLTextAreaElement).value,
            category: (target.elements.namedItem('category') as HTMLSelectElement).value,
        }
        mutation.mutate(createPostDTO);
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-2">
                <Input
                    type="text"
                    placeholder="Post title"
                    name="title"
                    required={true}
                />
            </div>
            <div className="mb-2">
                <Textarea
                    placeholder="Post description"
                    name="description"
                    required={true}
                />
            </div>
            <div className="mb-2">
                <select 
                    name="category" 
                    required 
                    className="w-full p-2 border border-gray-300 rounded-md"
                >
                    <option value="">Select a category</option>
                    {data && data.map((category: Category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <Button type="submit" className="w-full" disabled={mutation.isPending}>
                    {mutation.isPending && <span className="mr-4 h-4 w-4 rounded-full bg-white animate-pulse"></span>}
                    Create post
                </Button>
            </div>
        </form>
    );
}

export default FormPost;