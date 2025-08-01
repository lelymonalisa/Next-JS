"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { myAppHook } from "@/context/AppProvider";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

interface ProductType {
    id?: number,
    title?:string,
    description?:string,
    cost?:number,
    file?:string,
    banner_image?:File | null
}

const Dashboard: React.FC = () => {
    const { isLoading, authToken } = myAppHook();
    const router = useRouter();
    const fileRef = React.useRef<HTMLInputElement>(null);
    const [products, setProducts] = React.useState<ProductType[]>([]);
    const [isEdit, setIsEdit] = React.useState<boolean>(false);
    const [formData, setFormData] = React.useState<ProductType>({
        title: "",
        description: "",
        cost: 0,
        file: "",
        banner_image: null
    });

    // page load when authtoken
    useEffect(() => {
        if(!authToken) {
            router.push("/auth"); // Redirect to auth page if not authenticated
            return;
        }
        fetchAllProducts();
    }, [authToken])

    // on change from inpu
    const handleOnChangeEvent = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            if (e.target.files){
                // file uploaded
                setFormData({
                    ...formData,
                    banner_image: e.target.files[0],
                    file: URL.createObjectURL(e.target.files[0])
                });
            } else {
                // file not uploaded
                setFormData({
                    ...formData,
                    [e.target.name]: e.target.value
                });
            }
        }

        // form submission handler
    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            console.log("Form Data Submitted:", formData);
            try {
                if(isEdit) {
                    // edit operation
                    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/products/${formData.id}`, {
                        ...formData,
                        "_method": "PUT" 
                    }, {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                            "Content-Type": "multipart/form-data"
                        }
                    });
                    toast.success(response.data.message);
                    fetchAllProducts();
                } else {
                    // add operation
                    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/products/${formData.id}`, formData, {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                            "Content-Type": "multipart/form-data"
                        }
                    });

                    if(response.data.status){
                        toast.success(response.data.message)
                        setFormData({
                            title: "",
                            description: "",
                            cost: 0,
                            file: "",
                            banner_image: null
                    })
                    if(fileRef.current) {
                        fileRef.current.value = ""; // Reset file input
                    }
                }
                console.log("Response:", response.data);
                toast.success("Product added successfully!");
                }
            } catch (error) {
                console.error("Error submitting form:", error);
                toast.error("Failed to add product.");
            }
        }

    const fetchAllProducts = async () => {
            try{
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                });
                setProducts(response.data.products);
            } catch (error) {
                console.error("Error fetching products:", error);
                toast.error("Failed to fetch products.");
            }
        }

    const handleDeleteProduct = async (id: number) => {
        try{
            Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
            }).then(async(result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
                        headers: {
                            Authorization: `Bearer ${authToken}`
                        }
                    });
                    if(response.data.status) {
                        toast.success("Product deleted successfully!");
                        // Swal.fire({
                        // title: "Deleted!",
                        // text: "Your file has been deleted.",
                        // icon: "success"
                        // });
                        // fetchAllProducts(); // Refresh product list
                    }
                } catch (error) {
                    console.log("Error deleting product:", error);
                }
            }
            });
        } catch(error) {
            console.log("Error deleting product:", error);
        }
    }

    return <> 
        <div className="container mt-4">
        <div className="row">

            <div className="col-md-6">
                <div className="card p-4">
                    <h4>{isEdit ? "Edit" : "Add"} Product</h4>
                    <form onSubmit={ handleFormSubmit}>
                        <input className="form-control mb-2" 
                            name="title" 
                            placeholder="Title" 
                            value={formData.title}
                            onChange={ handleOnChangeEvent }
                            required 
                        />
                        <input className="form-control mb-2" 
                            name="description" 
                            placeholder="Description" 
                            value={formData.description}
                            onChange={ handleOnChangeEvent }
                            required 
                        />
                        <input className="form-control mb-2" 
                            name="cost" 
                            placeholder="Cost" 
                            value={formData.cost}
                            onChange={ handleOnChangeEvent }
                            type="number" 
                            required 
                        />
                        <div className="mb-2">
                            {
                                formData.file && (
                                    <Image
                                        src={formData.file}
                                        alt="Preview"
                                        id="bannerPreview"
                                        width={100}
                                        height={100}
                                    />
                                )
                            }
                        </div>
                        <input className="form-control mb-2" 
                            type="file" 
                            id="bannerInput" 
                            ref={ fileRef }
                            onChange={ handleOnChangeEvent }
                        />
                        <button className="btn btn-primary" type="submit">{isEdit ? "Edit" : "Add"} Product</button>
                    </form>
                </div>
            </div>

            <div className="col-md-6">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Banner</th>
                            <th>Cost</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            products.map((singleProduct, index) => (
                            <tr key={index}>
                                <td>{singleProduct.id}</td>
                                <td>{singleProduct.title}</td>
                                <td>{
                                        singleProduct.banner_image ? (<img src={singleProduct.banner_image} alt="Product" width={50} height={50} />) : "No Image"
                                    }
                                </td>
                                <td>{singleProduct.cost}</td>
                                <td>
                                    <button className="btn btn-warning btn-sm me-2" onClick={() => {
                                        setFormData({
                                            id: singleProduct.id,
                                            title: singleProduct.title,
                                            cost: singleProduct.cost,
                                            description: singleProduct.description,
                                            file: singleProduct.banner_image,
                                        })
                                        setIsEdit(true);
                                    }}>Edit</button>
                                    <button className="btn btn-danger btn-sm" onClick={ () => 
                                        handleDeleteProduct(singleProduct.id)
                                    }>Delete</button>
                                </td>
                             </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    </>
}

export default Dashboard;