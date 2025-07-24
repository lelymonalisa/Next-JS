"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { myAppHook } from "@/context/AppProvider";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

interface ProductType {
    title:string,
    description:string,
    cost:number,
    file:string,
    banner_image:File | null
}

const Dashboard: React.FC = () => {
    const { isLoading, authToken } = myAppHook();
    const router = useRouter();
    const fileRef = React.useRef<HTMLInputElement>(null);
    const [formData, setFormData] = React.useState<ProductType>({
        title: "",
        description: "",
        cost: 0,
        file: "",
        banner_image: null
    });

    useEffect(() => {
        if(!authToken) {
            router.push("/auth"); // Redirect to auth page if not authenticated
        }
        return
    }, [authToken])

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

        const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            console.log("Form Data Submitted:", formData);
            try {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/products`, formData, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        "Content-Type": "multipart/form-data"
                    }
                });
                toast.success("Product added successfully!");
                console.log("Response:", response.data);
            } catch (error) {
                console.error("Error submitting form:", error);
                toast.error("Failed to add product.");
            }
        }
    return <> 
        <div className="container mt-4">
        <div className="row">

            <div className="col-md-6">
                <div className="card p-4">
                    <h4>Add Product</h4>
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
                        <button className="btn btn-primary" type="submit">Add Product</button>
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
                        <tr>
                            <td>1</td>
                            <td>Sample Product</td>
                            {/* <td><Image src="#" alt="Product" width={50} height={50} /></td> */}
                            <td>$100</td>
                            <td>
                                <button className="btn btn-warning btn-sm me-2">Edit</button>
                                <button className="btn btn-danger btn-sm">Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    </>
}

export default Dashboard;