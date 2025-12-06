import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    apiCreateProduct,
    apiUpdateProduct,
    apiGetSingleProduct,
    apiGetProducts,
} from "@/api/products";

export type ProductData = {
    id?: number;
    name?: string;
    price?: number;
    image?: string | null;
};

export interface ProductFormProps {
    mode: "create" | "edit";
    initialData?: ProductData;
    onSuccess?: (product: ProductData) => void;
    onClose?: () => void;
}

export function ProductForm({
    mode,
    initialData,
    onSuccess,
    onClose,
}: ProductFormProps)

{
    const [name, setName] = useState(initialData?.name ?? "");
    const [price, setPrice] = useState(initialData?.price?.toString() ?? "");
    const [imageFile, setImageFile] = useState<File | null>(null);

    // ⭐ PREVIEW FIX
    const [preview, setPreview] = useState<string | null>(
        initialData?.image ?? null
    );

    const [loading, setLoading] = useState(false);

    // Reset form when initialData changes
    useEffect(() => {
        setName(initialData?.name ?? "");
        setPrice(initialData?.price?.toString() ?? "");
        setPreview(initialData?.image ?? null);
        setImageFile(null);
    }, [initialData]);

    // ⭐ FIXED BLOB CLEANUP — revokes only old blob URLs
    useEffect(() => {
        const oldUrl = preview;

        return () => {
            if (oldUrl && oldUrl.startsWith("blob:")) {
                URL.revokeObjectURL(oldUrl);
            }
        };
    }, [preview]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setImageFile(file);

        if (file) {
            const blobUrl = URL.createObjectURL(file);
            setPreview(blobUrl);
        }
    };

    const handleSubmit = async () => {
        if (!name.trim() || !price) {
            alert("Please fill required fields. . .");
            return;
        }

        if (mode === "edit" && !initialData?.id) {
            alert("Missing product id.");
            return;
        }

        setLoading(true);

        const fd = new FormData();
        fd.append("name", name);
        fd.append("price", price);

        if (imageFile) {
            fd.append("image", imageFile);
        }

        try {
            let result;

            if (mode === "create") {
                result = await apiCreateProduct(fd);
            } else {
                await apiUpdateProduct(initialData!.id!, fd);

                // Ensure updated data returned
                const fresh = await apiGetSingleProduct(initialData!.id!);
                result = fresh?.product ?? fresh;
            }

            onSuccess?.(result);
            onClose?.();
        } catch (err) {
            alert("Network error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto flex flex-col gap-4">
           
            <h2 className="text-xl font-semibold">
                {mode === "create" ? "Create Product" : "Edit Product"}
            </h2>

            <div>
                <Label>Product Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div>
                <Label>Price</Label>
                <Input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
            </div>

            <div>
                <Label>Image</Label>
                <Input type="file" accept="image/*" onChange={handleFileChange} />

                {/* ⭐ ALWAYS USE preview — fixes CREATE mode issue */}
                {preview && (
                    <img
                        src={preview}
                        className="w-32 h-32 mt-2 object-cover rounded-lg shadow"
                        alt="Preview"
                    />
                )}
            </div>

            <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={loading}>
                    {loading ? "Saving..." : mode === "create" ? "Add" : "Save"}
                </Button>
            </div>
        </div>
    );
}
