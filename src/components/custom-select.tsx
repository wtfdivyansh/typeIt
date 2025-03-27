
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CustomSelect({
  options,
  defaultValue,
  label,
  value,
  onChange,
}: {
  options: { value: string; label: string; icon: React.ReactNode }[];
  defaultValue: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="*:not-first:mt-2">
      <Label className="text-zinc-600">{label}</Label>
      <Select
        defaultValue={defaultValue}
        value={value}
        onValueChange={onChange}
      >
        <SelectTrigger className=" [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0 bg-zinc-800/50 border-zinc-700 focus:border-emerald-500/50 focus:ring-emerald-500/20 cursor-pointer">
          <SelectValue placeholder="Select framework" />
        </SelectTrigger>
        <SelectContent className=" [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]>span>svg]:shrink-0 bg-zinc-900 border-zinc-700 gap-y-1">
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="hover:bg-neutral-900 data-[state=checked]:bg-zinc-800 data-[state=checked]:text-emerald-500"
            >
              {option.icon}
              <span className="truncate text-zinc-500">{option.label}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
