function FeaturedSection({ title, items = [], renderItem }) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">{title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {items.map(renderItem)}
          </div>
        </div>
      </section>
    );
  }
  
  export default FeaturedSection;