import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function Create_Product() {

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleAddProduct = async () => {
    if (!name || !price || !imageFile) {
      alert("Please fill all fields!");
      return;
    }

    // Convert image to Base64
    const base64Image = await convertFileToBase64(imageFile);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("image", imageFile);

    const res = await fetch("http://172.17.17.10:8000/products/create", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("theToken"),
      },
      body: formData,
    });

    if (res.ok) {
      alert("Product created!");
      console.log(res);
    } else {
      alert("Failed to create product");
      console.log(res);
      console.log("ERROR BODY:", await res.json());

    }
  };


  return (
    <div className="max-w-md mx-auto mt-8 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Create Product</h1>

      <div className="flex flex-col gap-1">
        <Label htmlFor="productName">Product Name</Label>
        <Input id="productName" onChange={(e) => setName(e.target.value)} placeholder="Enter product name" />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="productPrice">Product Price</Label>
        <Input id="productPrice" onChange={(e) => setPrice(e.target.value)} type="number" placeholder="Enter product price" />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="productPicture">Product Picture</Label>
        <Input id="productPicture" onChange={(e) => setImageFile(e.target.files?.[0] || null)} type="file" />
      </div>

      <Button onClick={handleAddProduct}>Add Product</Button>
    </div>
  );
}

export default Create_Product;
