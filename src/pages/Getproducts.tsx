import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit, Trash, ShoppingCart } from "lucide-react";
import Modal from "@/components/Modal";
import { ProductForm } from "./ProductForm";
import {
  apiGetProducts,
  apiDeleteProduct,
} from "@/api/products";

export default function ProductsList() {
  interface Product {
    id: number;
    name: string;
    image?: string;
    price?: number;
    [key: string]: any;
  }

  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState<string>("");
  const [editing, setEditing] = useState<Product | null>(null);
  // state for create modal (opens ProductForm in create mode)
  const [creating, setCreating] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const data = await apiGetProducts();
      setProducts(data.products || data);
    })();
  }, []);

  const handleDelete = async (id: number) => {
    await apiDeleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleUpdate = (updated: { id?: number; [key: string]: any }) => {
    // in edit mode the returned product should have an id; if not, ignore
    if (updated.id === undefined) return;
    setProducts((prev) =>
      prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p))
    );
  };

  const filtered = products.filter((p) =>
    p?.name?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    
    <div className="p-6">
      {/* Search + create button row */}
      <div className="flex items-center justify-center gap-3 max-w-3xl mx-auto mb-6">
        <Input
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
        />
        <Button size="sm" onClick={() => setCreating(true)}>
          + Create
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {filtered.map((p) => (
          <Card key={p.id} className="shadow hover:shadow-lg">
            <CardHeader className="flex justify-between">
              <CardTitle>{p.name}</CardTitle>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => setEditing(p)}>
                  <Edit size={14} />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(p.id)}>
                  <Trash size={14} />
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              {p.image ? (
                <img src={p.image} className="w-full h-48 rounded object-cover" />
              ) : (
                <div className="h-40 flex items-center justify-center bg-gray-100 text-gray-500">
                  No Image
                </div>
              )}
            </CardContent>

            <CardFooter className="flex justify-between">
              <p className="font-bold">{p.price} تومان</p>
              <Button variant="outline" size="sm">
                <ShoppingCart size={14} /> خرید
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

        {/* Edit modal (reuses ProductForm) */}
        {editing && (
          <Modal onClose={() => setEditing(null)}>
            <ProductForm
              mode="edit"
              initialData={editing}
              onSuccess={handleUpdate}
              onClose={() => setEditing(null)}
            />
          </Modal>
        )}

        {/* Create modal: opens ProductForm in create mode and prepends created product to list */}
        {creating && (
          <Modal onClose={() => setCreating(false)}>
            <ProductForm
              mode="create"
              onSuccess={(prod: any) => {
                // insert at top for immediate feedback
                setProducts((prev) => [prod, ...prev]);
              }}
              onClose={() => setCreating(false)}
            />
          </Modal>
        )}
    </div>
  );
}
