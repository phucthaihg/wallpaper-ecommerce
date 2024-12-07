import { Link } from 'react-router-dom';

function CategoryCard({ category }) {
  return (
    <Link 
      to={`/categories/${category.id}`}
      className="block group relative rounded-lg overflow-hidden"
    >
      <div className="aspect-square">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <h3 className="text-xl font-bold">{category.name}</h3>
        {category.description && (
          <p className="mt-2 text-sm text-white/90">{category.description}</p>
        )}
      </div>
    </Link>
  );
}

export default CategoryCard;