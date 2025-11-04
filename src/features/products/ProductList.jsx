import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setSearch,
  setCategory,
  setSort,
  setPage,
  deleteProduct,
  bulkDelete,
  setStatus,
} from "./productSlice";
import { useSearchParams, useNavigate } from "react-router-dom";
import { categories } from "../../data/categories";
import "./ProductList.css";

const ProductList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, search, category, sort, page, pageSize, status, error } =
    useSelector((state) => state.products);

  const [selected, setSelected] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);

    if (params.search) dispatch(setSearch(params.search));
    if (params.category) dispatch(setCategory(params.category));
    if (params.sortField)
      dispatch(
        setSort({ field: params.sortField, order: params.sortOrder || "asc" })
      );
    if (params.page) dispatch(setPage(Number(params.page)));
  }, []);

  useEffect(() => {
    const params = {
      ...(search ? { search } : {}),
      ...(category ? { category } : {}),
      ...(sort.field ? { sortField: sort.field, sortOrder: sort.order } : {}),
      page,
    };
    setSearchParams(params);
  }, [search, category, sort, page, setSearchParams]);

  const filteredItems = useMemo(() => {
    let result = [...items];

    if (search) {
      const lower = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(lower) ||
          p.description.toLowerCase().includes(lower)
      );
    }

    if (category) result = result.filter((p) => p.category === category);

    if (sort.field) {
      const dir = sort.order === "asc" ? 1 : -1;
      result.sort((a, b) => {
        if (sort.field === "expiryDate")
          return dir * (new Date(a.expiryDate) - new Date(b.expiryDate));
        return dir * (a[sort.field] > b[sort.field] ? 1 : -1);
      });
    }

    return result;
  }, [items, search, category, sort]);

  const totalItems = filteredItems.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const pagedItems = filteredItems.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  useEffect(() => {
    if (page > totalPages && totalPages > 0) dispatch(setPage(totalPages));
  }, [totalPages, page, dispatch]);

  const totals = useMemo(() => {
    const sum = (key) =>
      filteredItems.reduce((acc, p) => acc + Number(p[key] || 0), 0);
    return {
      cost: sum("costPrice"),
      sell: sum("sellPrice"),
      final: sum("finalPrice"),
    };
  }, [filteredItems]);

  const handleDelete = (id) => {
    if (!window.confirm("Delete this product?")) return;
    dispatch(setStatus("loading"));
    setTimeout(() => {
      dispatch(deleteProduct(id));
      dispatch(setStatus("idle"));
    }, 800);
  };

  const handleProduct = () =>{
    navigate('/')
  }

  const handleBulkDelete = () => {
    if (!selected.length) return alert("No items selected");
    if (!window.confirm("Delete selected products?")) return;
    dispatch(setStatus("loading"));
    setTimeout(() => {
      dispatch(bulkDelete(selected));
      setSelected([]);
      dispatch(setStatus("idle"));
    }, 1000);
  };

  if (status === "error") {
    return (
      <div className="empty-state error">
        <div className="icon">⚠️</div>
        <p className="message">{error || "Oops! Something went wrong."}</p>
        <button
          className="action-btn"
          onClick={() => dispatch(setStatus("idle"))}
        >
          🔄 Retry
        </button>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="loading-state">
        <div className="spinner">⏳</div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="empty-state">
        <div className="icon">📦</div>
        <p className="message">No products found yet.</p>
        <button className="action-btn" onClick={() => navigate("/")}>
          ➕ Add Product
        </button>
      </div>
    );
  }

  return (
    <div className="list-container">
      <div className="filters">
        <input
          type="text"
          placeholder="Search name/description..."
          value={search}
          onChange={(e) => dispatch(setSearch(e.target.value))}
        />
       <select
  value={category}
  onChange={(e) => dispatch(setCategory(e.target.value))}
>
  <option value="">All Categories</option>
  {categories.map((cat) => (
    <option key={cat} value={cat}>
      {cat}
    </option>
  ))}
</select>

        <button onClick={handleBulkDelete} disabled={status === "loading"}>
          {status === "loading" ? "Deleting..." : "Bulk Delete"}
        </button>
        <button className="btn btn-success" onClick={handleProduct}>
          Add Product
        </button>
      </div>

      <table className="product-table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={(e) =>
                  e.target.checked
                    ? setSelected(pagedItems.map((p) => p.id))
                    : setSelected([])
                }
                checked={
                  pagedItems.length > 0 && selected.length === pagedItems.length
                }
              />
            </th>
            {[
              "name",
              "category",
              "expiryDate",
              "costPrice",
              "sellPrice",
              "discount",
              "finalPrice",
            ].map((col) => (
              <th
                key={col}
                onClick={() =>
                  dispatch(
                    setSort({
                      field: col,
                      order:
                        sort.field === col && sort.order === "asc"
                          ? "desc"
                          : "asc",
                    })
                  )
                }
              >
                {col.charAt(0).toUpperCase() + col.slice(1)}{" "}
                {sort.field === col ? (sort.order === "asc" ? "↑" : "↓") : ""}
              </th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {pagedItems.map((p) => (
            <tr key={p.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selected.includes(p.id)}
                  onChange={(e) =>
                    e.target.checked
                      ? setSelected([...selected, p.id])
                      : setSelected(selected.filter((id) => id !== p.id))
                  }
                />
              </td>
              <td>{p.name}</td>
              <td>{p.category}</td>
              <td>{p.expiryDate}</td>
              <td>{p.costPrice}</td>
              <td>{p.sellPrice}</td>
              <td>{p.discount}%</td>
              <td>{p.finalPrice}</td>
              <td>
                <button onClick={() => navigate(`/edit/${p.id}`)}>Edit</button>
                <button onClick={() => handleDelete(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>

        <tfoot>
          <tr>
            <td colSpan="4">Totals:</td>
            <td>{totals.cost}</td>
            <td>{totals.sell}</td>
            <td></td>
            <td>{totals.final}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>

      <div className="pagination">
        <span>
          Page {page} of {totalPages} — {totalItems} items
        </span>
        <div>
          <button
            disabled={page === 1}
            onClick={() => dispatch(setPage(page - 1))}
          >
            Prev
          </button>
          <button
            disabled={page === totalPages}
            onClick={() => dispatch(setPage(page + 1))}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
