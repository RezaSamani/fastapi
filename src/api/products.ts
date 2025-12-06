
const API_BASE = "http://172.17.17.10:8000";

export async function apiGetProducts() {
  const res = await fetch(`${API_BASE}/products/`, {
    headers: { Authorization: "Bearer " + localStorage.getItem("theToken") },
  });

  return res.json();
}

export async function apiCreateProduct(formData: FormData) {
  const res = await fetch(`${API_BASE}/products/create`, {
    method: "POST",
    headers: { Authorization: "Bearer " + localStorage.getItem("theToken") },
    body: formData,
  });
  console.log("1010");


  return res.json();
}

export async function apiUpdateProduct(id: string | number, formData: FormData) {
  const res = await fetch(`${API_BASE}/products/update/${id}`, {
    method: "PUT",
    headers: { Authorization: "Bearer " + localStorage.getItem("theToken") },
    body: formData,
  });
  return res.json();
}

export async function apiDeleteProduct(id: number) {
  const res = await fetch(`${API_BASE}/products/delete/${id}`, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + localStorage.getItem("theToken") },
  });
  return res.json();
}

export async function apiGetSingleProduct(id: number | string) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    headers: { Authorization: "Bearer " + localStorage.getItem("theToken") },
  });
  return res.json();
}

