import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash, Edit, Plus, ShoppingCart } from "lucide-react";

function ProductsList() {
  const [products, setProducts] = useState([]);

  const getProducts = async () => {
    try {
      const res = await fetch("http://172.17.17.10:8000/products/", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("theToken"),
        },
      });

      if (!res.ok) {
        console.log("Fetch error:", await res.json());
        return;
      }

      const data = await res.json();
      console.log("Products:", data);
      setProducts(data.products);

    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="p-6">
      <Button onClick={getProducts} className="mb-4">
        Load Products
      </Button>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((p: any) => (
          <Card key={p.id} className="shadow-lg">
            <CardHeader>
              <CardTitle>{p.name}</CardTitle>
                <div className="flex gap-2">
      <Edit size={20} className="cursor-pointer text-blue-600" />
      <Trash size={20} className="cursor-pointer text-red-600" />
    </div>
            </CardHeader>

            <CardContent>
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
              <p className="text-lg font-semibold">${p.price}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default ProductsList;
