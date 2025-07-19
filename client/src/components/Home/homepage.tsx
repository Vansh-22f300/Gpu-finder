import { useState } from "react";
import GpuRequestForm from "@/components/Form/recommendation-form";
import Result from "@/components/Result/result";

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
  
export default function HomePage() {
  const [results, setResults] = useState<GpuPricingResult[]>([]);
  const [currencySymbol, setCurrencySymbol] = useState<string>("$");

  const handleResults = (data: GpuPricingResult[], symbol: string) => {
    setResults(data);
    setCurrencySymbol(symbol);
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center">GPU Recommendation System</h1>
        <p className="text-zinc-400 text-center">
          Fill in your requirements below to get the best GPU instance suggestions.
        </p>
        <GpuRequestForm onResult={handleResults} />
        <Result results={results} currencySymbol={currencySymbol} />
      </div>
    </main>
  );
}
