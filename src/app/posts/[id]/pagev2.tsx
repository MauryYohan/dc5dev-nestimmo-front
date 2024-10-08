'use client'
import { useState } from 'react';
import DialogConfirmDelete from "@/components/globals/DialogConfirmDelete";
import { useToast } from "@/components/ui/use-toast";
import { deletePost, fetchPostById } from "@/services/post.service";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import UpdatePost from "@/components/posts/UpdatePost";

type PostDetailParams = {
    id: string;
}

const PostDetail = () => {
    const { id } = useParams<PostDetailParams>();
    const router = useRouter();
    const { toast } = useToast();
    const [isEditing, setIsEditing] = useState(false);

    const { isPending, error, data } = useQuery({
        queryKey: ['post', id],
        queryFn: () => fetchPostById(id)
    })

    const deleteMutation = useMutation({
        mutationFn: deletePost,
        onSuccess: () => {
            toast({
                title: 'Post deleted',
                description: 'Your post has been deleted',
            })
            router.push('/')
        }
    });

    const handleDelete = () => {
        deleteMutation.mutate(id);
    }

    if (isPending) return <div className="h-full flex justify-center items-center">Loading...</div>

    return (
        <div>
            {isEditing ? (
                <UpdatePost 
                    post={data} 
                    onCancel={() => setIsEditing(false)} 
                />
            ) : (
                <>
                    <h1>{data.title}</h1>
                    <p>{data.description}</p>
                    <p>{data.category?.name}</p>
                    <Button onClick={() => setIsEditing(true)}>Edit Post</Button>
                    <DialogConfirmDelete
                        handleDelete={handleDelete}
                        isPending={deleteMutation.isPending}
                    />
                </>
            )}
        </div>
    );
}

export default PostDetail;