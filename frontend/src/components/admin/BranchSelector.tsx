import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBranches } from "@/hooks/use-branches";

interface Props {
  value: string;
  onChange: (v: string) => void;
  showAll?: boolean;
  label?: string;
}

const BranchSelector = ({ value, onChange, showAll = true, label }: Props) => {
  const branches = useBranches();
  return (
    <div>
      {label && <label className="text-sm font-medium text-foreground">{label}</label>}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select branch" />
        </SelectTrigger>
        <SelectContent>
          {showAll && <SelectItem value="all">All Branches</SelectItem>}
          {branches.map(b => (
            <SelectItem key={b.id} value={b.id}>{b.branch_name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default BranchSelector;
