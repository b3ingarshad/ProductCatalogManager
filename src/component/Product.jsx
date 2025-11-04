import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addProduct, updateProduct } from "../features/products/productSlice";
import { useDispatch } from "react-redux";
import { categories } from "../data/categories"; 


const Product = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    category: "",
    description: "",
    expiryDate: "",
    costPrice: "",
    sellPrice: "",
    discount: "",
    finalPrice: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (id) {
      const products = JSON.parse(localStorage.getItem("products")) || [];
      const productToEdit = products.find((p) => p.id === id);
      if (productToEdit) {
        setFormData(productToEdit);
        setIsEditMode(true);
      } else {
        navigate("/list");
      }
    }
  }, [id, navigate]);

  useEffect(() => {
    if (formData.sellPrice && formData.discount !== "") {
      const discountAmount = (formData.sellPrice * formData.discount) / 100;
      const finalPrice = formData.sellPrice - discountAmount;
      setFormData((prev) => ({ ...prev, finalPrice }));
    }
  }, [formData.sellPrice, formData.discount]);

  const validate = (data) => {
    const newErrors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!data.name.trim()) newErrors.name = "Name is required";
    if (!data.category) newErrors.category = "Category is required";
    if (!data.costPrice || data.costPrice <= 0)
      newErrors.costPrice = "Cost price must be positive";
    if (!data.sellPrice || data.sellPrice <= 0)
      newErrors.sellPrice = "Sell price must be positive";
    if (data.discount < 0 || data.discount > 90)
      newErrors.discount = "Discount must be between 0–90%";
    if (data.expiryDate && new Date(data.expiryDate) < today)
      newErrors.expiryDate = "Expiry date cannot be in the past";

    return newErrors;
  };

  useEffect(() => {
    const validationErrors = validate(formData);
    setErrors(validationErrors);
  }, [formData]);

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const products = JSON.parse(localStorage.getItem("products")) || [];

      if (isEditMode) {
        dispatch(updateProduct(formData));
      } else {
        const lastId =
          products.length > 0
            ? Math.max(...products.map((p) => Number(p.id)))
            : 0;
        const newProduct = {
          ...formData,
          id: (lastId + 1).toString(),
        };

        dispatch(addProduct(newProduct));
      }

      setIsSubmitting(false);
      setShowToast(true);

      setTimeout(() => navigate("/list"), 1200);
    }, 1000);
  };

  const handleReset = () => {
    setFormData({
      id: "",
      name: "",
      category: "",
      description: "",
      expiryDate: "",
      costPrice: "",
      sellPrice: "",
      discount: "",
      finalPrice: "",
    });
    setErrors({});
    setIsEditMode(false);
  };

  return (
    <div className="container py-5">
      <div className="col-lg-6 col-md-8 mx-auto">
        <div className="card shadow-lg border-0">
          <div className="card-header bg-primary bg-gradient text-white text-center py-3">
            <h4 className="mb-0">
              {isEditMode ? "Edit Product" : "Add New Product"}
            </h4>
          </div>

          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Product Name <span className="text-danger">*</span>
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`form-control ${
                    errors.name ? "is-invalid" : ""
                  }`}
                  placeholder="Enter product name"
                />
                {errors.name && (
                  <div className="invalid-feedback">{errors.name}</div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Category <span className="text-danger">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`form-select ${
                    errors.category ? "is-invalid" : ""
                  }`}
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <div className="invalid-feedback">{errors.category}</div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Short description"
                  rows="3"
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Expiry Date</label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    className={`form-control ${
                      errors.expiryDate ? "is-invalid" : ""
                    }`}
                  />
                  {errors.expiryDate && (
                    <div className="invalid-feedback">
                      {errors.expiryDate}
                    </div>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    Cost Price <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    name="costPrice"
                    value={formData.costPrice}
                    onChange={handleChange}
                    className={`form-control ${
                      errors.costPrice ? "is-invalid" : ""
                    }`}
                    placeholder="Enter cost price"
                  />
                  {errors.costPrice && (
                    <div className="invalid-feedback">{errors.costPrice}</div>
                  )}
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    Sell Price <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    name="sellPrice"
                    value={formData.sellPrice}
                    onChange={handleChange}
                    className={`form-control ${
                      errors.sellPrice ? "is-invalid" : ""
                    }`}
                    placeholder="Enter sell price"
                  />
                  {errors.sellPrice && (
                    <div className="invalid-feedback">{errors.sellPrice}</div>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Discount (%)</label>
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleChange}
                    className={`form-control ${
                      errors.discount ? "is-invalid" : ""
                    }`}
                    placeholder="Enter discount"
                  />
                  {errors.discount && (
                    <div className="invalid-feedback">{errors.discount}</div>
                  )}
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Final Price</label>
                <input
                  type="number"
                  name="finalPrice"
                  value={formData.finalPrice}
                  readOnly
                  className="form-control bg-light"
                />
              </div>

              <div className="d-flex justify-content-between mt-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn btn-outline-secondary"
                  disabled={isSubmitting}
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="btn btn-primary px-4"
                  disabled={isSubmitting || !isValid}
                >
                  {isSubmitting ? (
                    <div
                      className="spinner-border spinner-border-sm text-light"
                      role="status"
                    ></div>
                  ) : isEditMode ? (
                    "Update"
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {showToast && (
          <div
            className="toast align-items-center text-bg-success border-0 position-fixed bottom-0 end-0 m-4 show"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="d-flex">
              <div className="toast-body">
                ✅ {isEditMode ? "Product updated" : "Product saved"} successfully!
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;
