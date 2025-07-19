import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { z } from "zod";
import {
  DollarSign,
  Globe,
  Cpu,
  Zap,
  Search,
  MemoryStick,
  CpuIcon,
  IndianRupee
} from "lucide-react";

const formSchema = z.object({
  budget: z.number().min(1, "Budget is required"),
  country: z.string().min(1),
  region: z.string().min(1),
  os_type: z.string().min(1),
  ram: z.number().min(1),
  vcpus: z.number().min(1),
  is_gpu: z.boolean(),
  is_spot: z.boolean()
});
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
  
type GpuRequestFormProps = {
  onResult: (data: GpuPricingResult[], currencySymbol: string) => void;
};

type PricingFormValues = z.infer<typeof formSchema>;

const GpuRequestForm: React.FC<GpuRequestFormProps> = ({ onResult }) => {
  const [response, setResponse] = useState<GpuPricingResult>();
  const [currencySymbol, setCurrencySymbol] = useState<string>("$");
  console.log(response);
  

  const form = useForm<PricingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      budget: 500,
      country: "india",
      region: "",
      os_type: "linux",
      ram: 16,
      vcpus: 4,
      is_gpu: true,
      is_spot: false
    }
  });

  const watchCountry = form.watch("country");

  useEffect(() => {
    setCurrencySymbol(watchCountry === "India" ? "₹" : "$");
  }, [watchCountry]);

  const onSubmit = async (values: PricingFormValues) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_SERVER_BASE_URL}/pricing`, values);
      const responseData = res.data.data;
      onResult(responseData, currencySymbol);
      setResponse(res.data.data);
      console.log("Success:", res.data.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
      <CardHeader className="pb-4">
        <CardTitle className="text-xl text-white">Specify Your Requirements</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {/* Country */}
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-200">Currency</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
                          <SelectValue placeholder="Select a country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-zinc-800 text-zinc-100">
                        <SelectItem value="India">India (INR)</SelectItem>
                        <SelectItem value="USA">USA (USD)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* OS Type */}
              <FormField
                control={form.control}
                name="os_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-200">Operating System</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
                          <SelectValue placeholder="Select OS" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-zinc-800 text-zinc-100">
                        <SelectItem value="Linux">Linux</SelectItem>
                        <SelectItem value="Windows">Windows</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Budget */}
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-zinc-200">
                      {currencySymbol === "₹" ? (
                        <IndianRupee className="h-4 w-4 text-green-400" />
                      ) : (
                        <DollarSign className="h-4 w-4 text-green-400" />
                      )}
                      Budget
                    </FormLabel>
                    <FormControl>
                      <Input
                      
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="bg-zinc-800 border-zinc-700 pl-8 text-zinc-100"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Region */}
              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-zinc-200">
                      <Globe className="h-4 w-4 text-indigo-400" />
                      Region
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
                          <SelectValue placeholder="Select a region" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-zinc-800 border-zinc-700 text-zinc-100">
                        <SelectItem value="ap-south-mum-1">Mumbai</SelectItem>
                        <SelectItem value="ap-south-noi-1">Noida</SelectItem>
                        <SelectItem value="us-east-at-1">Atlanta</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* RAM */}
              <FormField
                control={form.control}
                name="ram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-zinc-200">
                      <MemoryStick className="h-4 w-4 text-indigo-400" />
                      RAM:{" "}
                      <span className="ml-1 font-semibold text-white">{field.value} GB</span>
                    </FormLabel>
                    <FormControl>
                      <div className="pt-2 px-1">
                        <Slider
                          min={1}
                          max={512}
                          step={1}
                          value={[field.value]}
                          onValueChange={(vals) => field.onChange(vals[0])}
                          className="py-4"
                        />
                        <div className="flex justify-between text-xs text-zinc-500 mt-1">
                          <span>1 GB</span>
                          <span>256 GB</span>
                          <span>512 GB</span>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* vCPUs */}
              <FormField
                control={form.control}
                name="vcpus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-zinc-200">
                      <Cpu className="h-4 w-4 text-indigo-400" />
                      vCPUs
                    </FormLabel>
                    <FormControl>
                      <Input
                        
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="bg-zinc-800 border-zinc-700 text-zinc-100"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Checkboxes in 2-column layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* GPU */}
              <FormField
                control={form.control}
                name="is_gpu"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 rounded-md border border-zinc-800 p-4 bg-zinc-900/50">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-zinc-200 flex items-center gap-2">
                        <CpuIcon className="h-4 w-4 text-indigo-400" />
                        GPU Required
                      </FormLabel>
                      <FormDescription className="text-zinc-400">
                        Do you require GPU acceleration?
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {/* Spot */}
              <FormField
                control={form.control}
                name="is_spot"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 rounded-md border border-zinc-800 p-4 bg-zinc-900/50">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-zinc-200 flex items-center gap-2">
                        <Zap className="h-4 w-4 text-indigo-400" />
                        Spot Instance Allowed
                      </FormLabel>
                      <FormDescription className="text-zinc-400">
                        Use spot instances to reduce cost (interruption possible).
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white"
            >
              <Search className="mr-2 h-4 w-4" />
              Find Recommended GPUs
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default GpuRequestForm;
