function ProductFilter({ 
    categories, 
    selectedCategory, 
    minPrice, 
    maxPrice, 
    sort, 
    onFilterChange 
  }) {
    return (
      <div className="space-y-6">
        {/* Category Filter */}
        <div>
          <h3 className="text-lg font-medium mb-4">Danh mục</h3>
          <div className="space-y-2">
            {categories.map(category => (
              <label key={category.id} className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  value={category.id}
                  checked={selectedCategory === category.id}
                  onChange={(e) => onFilterChange({ category: e.target.value })}
                  className="mr-2"
                />
                {category.name}
              </label>
            ))}
          </div>
        </div>
  
        {/* Price Range */}
        <div>
          <h3 className="text-lg font-medium mb-4">Giá</h3>
          <div className="space-y-4">
            <input
              type="number"
              placeholder="Giá tối thiểu"
              value={minPrice || ''}
              onChange={(e) => onFilterChange({ minPrice: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
            />
            <input
              type="number"
              placeholder="Giá tối đa"
              value={maxPrice || ''}
              onChange={(e) => onFilterChange({ maxPrice: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>
  
        {/* Sort */}
        <div>
          <h3 className="text-lg font-medium mb-4">Sắp xếp</h3>
          <select
            value={sort}
            onChange={(e) => onFilterChange({ sort: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="createdAt">Mới nhất</option>
            <option value="price">Giá thấp đến cao</option>
            <option value="-price">Giá cao đến thấp</option>
            <option value="name">Tên A-Z</option>
          </select>
        </div>
      </div>
    );
  }
  
  export default ProductFilter;