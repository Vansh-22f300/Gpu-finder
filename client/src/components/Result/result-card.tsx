import { FC } from "react";
import { DollarSign, Cpu, MemoryStick, IndianRupee } from "lucide-react";

type ResultCardProps = {
  data: {
    resource_name: string;
    gpu_description: string;
    price_per_hour: number;
    price_per_month: number;
    price_per_year: number;
    vcpus: number;
    ram: number;
    operating_system: string;
    region: string;
    currency: string;
    is_spot: number;
  };
  currencySymbol: string;
};

const ResultCard: FC<ResultCardProps> = ({ data, currencySymbol }) => {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6 shadow hover:shadow-lg transition duration-300">
      <div className="text-white text-lg font-semibold mb-1">{data.resource_name}</div>
      <div className="text-sm text-zinc-400 mb-2">{data.gpu_description} • {data.operating_system.toUpperCase()} • {data.region.toUpperCase()}</div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-zinc-300">
        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-indigo-500" />
          <span>{data.vcpus} vCPUs</span>
        </div>
        <div className="flex items-center gap-2">
          <MemoryStick className="h-4 w-4 text-indigo-500" />
          <span>{data.ram} GB RAM</span>
        </div>
        <div className="flex items-center gap-2">
            {currencySymbol=="$"?<DollarSign className="h-4 w-4 text-green-400" />:<IndianRupee className="h-4 w-4 text-green-400" />}
          
          <span>{data.price_per_hour.toFixed(2)} / hour</span>
        </div>
        <div className="flex items-center gap-2">
        {currencySymbol=="$"?<DollarSign className="h-4 w-4 text-purple-400" />:<IndianRupee className="h-4 w-4 text-purple-400" />}
          <span>{data.price_per_month.toFixed(0)} / month</span>
        </div>
        <div className="flex items-center gap-2">
        {currencySymbol=="$"?<DollarSign className="h-4 w-4 text-blue-400" />:<IndianRupee className="h-4 w-4 text-blue-400" />}
        <span>
    {typeof data.price_per_year === "number"
      ? `${data.price_per_year.toFixed(2)} / yearly`
      : "N/A"}
  </span>
        </div>
      </div>

      <div className="text-xs text-zinc-500 italic">
        {data.is_spot ? "Spot Instance" : "On-demand"} • {data.currency}
      </div>
    </div>
  );
};

export default ResultCard;
