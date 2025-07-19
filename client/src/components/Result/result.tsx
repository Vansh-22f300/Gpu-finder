import ResultCard from "./result-card";

type GpuPricingResult = {
    country: string;
    operating_system: string;
    resource_class: string;
    resource_name: string;
    vcpus: number;
    ram: number;
    price_per_hour: number;
    price_per_month: number;
    price_per_year: number;
    price_per_spot: number;
    currency: string;
    is_gpu: 1 | 0;
    is_spot: 1 | 0;
    resource: string;
    resource_type: string;
    region: string;
    gpu_description: string;
    is_public: 1 | 0;
    score: number;
  };
  
type ResultProps = {
  results?: GpuPricingResult[]; // Make optional to avoid crash on undefined
  currencySymbol: string;
};

const Result: React.FC<ResultProps> = ({ results = [], currencySymbol }) => {
  if (results.length === 0) {
    return (
      <div className="mt-6 text-center text-white text-lg">
        No recommended instances found based on your criteria.
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-6">
      <h2 className="text-2xl font-semibold text-white text-center">
        Recommended Instances
      </h2>
      <div className="grid grid-cols-2 gap-6">
        {results.map((item, index) => (
          <ResultCard key={index} data={item} currencySymbol={currencySymbol} />
        ))}
      </div>
    </div>
  );
};

export default Result;
