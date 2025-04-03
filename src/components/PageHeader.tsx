
interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

const PageHeader = ({ title, subtitle }: PageHeaderProps) => {
  return (
    // Updated background to white, adjusted padding and margin
    <div className="bg-cardiair-white py-16 md:py-20 mt-16"> {/* mt-16 assumes fixed navbar height */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Updated title color */}
        <h1 className="text-3xl md:text-5xl font-bold mb-4 animate-fade-in text-cardiair-gray-dark">{title}</h1>
        {subtitle && (
          // Updated subtitle color
          <p className="text-xl md:text-2xl text-cardiair-gray-medium max-w-3xl animate-slide-up">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
