import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, Trash, ShoppingCart, ALargeSmall } from "lucide-react";
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
  const [Shopping, setShopping] = useState<boolean>(false);
  type CartItem = {
    productId: number;
    quantity: number;
  };

  const getQuantity = (productId: number) => {
    const item = cart.find((c) => c.productId === productId);
    return item ? item.quantity : 0;
  };


  const [cart, setCart] = useState<CartItem[]>([]);



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

  const handleUpdate = (updated: { id?: number;[key: string]: any }) => {
    // in edit mode the returned product should have an id; if not, ignore
    if (updated.id === undefined) return;
    setProducts((prev) =>
      prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p))
    );
  };

  const handleShop = () => {
    const payload = {
      user_id: 0, // or real user id
      items: cart.map((item) => ({
        product_id: item.productId,
        quantity: item.quantity,
      })),
    };
    setShopping(true);
    console.log("Order payload:", payload);
    // here you would call your API, e.g. apiCreateOrder(payload)
  };

  const cartWithProducts = cart
  .map((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return null;

    const lineTotal = (product.price ?? 0) * item.quantity;

    return {
      ...item,
      product,
      lineTotal,
    };
  })
  .filter(Boolean) as {
    productId: number;
    quantity: number;
    product: Product;
    lineTotal: number;
  }[];

const cartTotal = cartWithProducts.reduce((sum, item) => sum + item.lineTotal, 0);



  const increment = (productId: number) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.productId === productId);
      if (!existing) {
        return [...prev, { productId, quantity: 1 }];
      }
      return prev.map((c) =>
        c.productId === productId
          ? { ...c, quantity: c.quantity + 1 }
          : c
      );
    });
  };

  const decrement = (productId: number) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.productId === productId);
      if (!existing) return prev;

      if (existing.quantity === 1) {
        // remove from cart when it hits 0
        return prev.filter((c) => c.productId !== productId);
      }

      return prev.map((c) =>
        c.productId === productId
          ? { ...c, quantity: c.quantity - 1 }
          : c
      );
    });
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
        <div className="mt-6 flex justify-end">
          <Button onClick={handleShop}>
            <ShoppingCart className="mr-2" size={16} />
            مشاهده سفارش‌ها
          </Button>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-2 ">
        {filtered.map((p) => (
          <Card key={p.id} className="shadow hover:shadow-lg ">
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

            <CardContent className="">
              {p.image ? (
                <img src={p.image} className="w-full h-48 rounded object-cover" />
              ) : (
                <div className="h-40 flex items-center justify-center bg-gray-100 text-gray-500">
                  No Image
                </div>
              )}
            </CardContent>

            <CardFooter className="grid justify-between grid-cols-2">
              <p className="font-bold ">{p.price} تومان</p>

              {(() => {
                const qty = getQuantity(p.id);

                if (qty === 0) {
                  return (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => increment(p.id)}
                    >
                      <ShoppingCart size={14} /> خرید
                    </Button>
                  );
                }

                return (
                  <div className="grid grid-cols-4">
                    <Button size="icon-sm" onClick={() => decrement(p.id)}>
                      -
                    </Button>
                    <Label className="text-center">{qty}</Label>
                    <Button size="icon-sm" onClick={() => increment(p.id)}>
                      +
                    </Button>
                  </div>
                );
              })()}
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

{Shopping && (
  <Modal onClose={() => setShopping(false)}>
    <div className="p-4 space-y-4">
      <h2 className="text-2xl mb-4">سفارش‌ها</h2>

      {cartWithProducts.length === 0 ? (
        <p className="text-gray-500">سبد خرید خالی است.</p>
      ) : (
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {cartWithProducts.map(({ productId, product, quantity, lineTotal }) => (
            <div
              key={productId}
              className="flex items-center justify-between border rounded p-2 gap-2"
            >
              <div className="flex items-center gap-3">
                {product.image ? (
                  <img
                    src={product.image}
                    className="w-12 h-12 rounded object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                    بدون تصویر
                  </div>
                )}

                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-gray-600">
                    قیمت واحد: {product.price ?? 0} تومان
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm">تعداد: {quantity}</p>
                <p className="font-bold">جمع: {lineTotal} تومان</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between border-t pt-3 mt-2">
        <span className="font-semibold">مجموع کل:</span>
        <span className="font-bold">{cartTotal} تومان</span>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={() => setShopping(false)}>
          بستن
        </Button>
        <Button
          disabled={cartWithProducts.length === 0}
          onClick={() => {
            const payload = {
              user_id: 0, // واقعی اینجا
              items: cart.map((item) => ({
                product_id: item.productId,
                quantity: item.quantity,
              })),
            };

            console.log("Order payload:", payload);
            // TODO: apiCreateOrder(payload)
            // بعد از موفقیت:
            // setCart([]);
            // setShopping(false);
          }}
        >
          ثبت سفارش
        </Button>
      </div>
    </div>
  </Modal>
)}


    </div>
  );
}
