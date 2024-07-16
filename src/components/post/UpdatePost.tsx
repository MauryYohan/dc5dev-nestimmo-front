'use client'
import { useState } from 'react';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePost } from "@/services/post.service";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type UpdatePostProps = {
    post: {
        id: string;
        title: string;
        description: string;
        category: {
            title: string;
        };
    };
    onCancel: () => void;
}

const UpdatePost = ({ post, onCancel }: UpdatePostProps) => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [title, setTitle] = useState(post.title);
    const [description, setDescription] = useState(post.description);

    const updateMutation = useMutation({
        mutationFn: updatePost,
        onSuccess: () => {
            toast({
                title: 'Post updated',
                description: 'Your post has been updated successfully',
            });
            queryClient.invalidateQueries(['post', post.id]);
            onCancel();
        }
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const updatedPost = {
            id: post.id,
            title,
            description,
            category: post.category?.title,
        };
        updateMutation.mutate(updatedPost);
    }

    return (
        <form onSubmit={handleSubmit}>
            <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
            />
            <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Updating...' : 'Update'}
            </Button>
            <Button type="button" onClick={onCancel}>Cancel</Button>
        </form>
    );
}

export default UpdatePost;